import type { FileMeta } from '@/types';
import { countWords, countLines, isDiffText } from '@/utils';

/**
 * TextParser — Detects input type and extracts raw text from various sources.
 */
export class TextParser {
  /**
   * Detect content type from raw text
   */
  static detectType(text: string): FileMeta['type'] {
    if (isDiffText(text)) return 'diff';
    // Check for markdown headers / formatting
    if (/^#{1,6}\s/m.test(text) || /\*\*.*\*\*/.test(text) || /\[.*\]\(.*\)/.test(text)) {
      return 'markdown';
    }
    return 'text';
  }

  /**
   * Parse a File object and return text content + metadata
   */
  static async parseFile(file: File): Promise<{ text: string; meta: FileMeta }> {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const text = await TextParser.readFileAsText(file);

    let type: FileMeta['type'] = 'text';
    if (extension === 'md' || extension === 'markdown') type = 'markdown';
    else if (extension === 'diff' || extension === 'patch') type = 'diff';
    else if (extension === 'pdf') {
      // PDF needs special extraction
      const extracted = await TextParser.extractPdfText(file);
      return {
        text: extracted,
        meta: {
          name: file.name,
          type: 'pdf',
          size: file.size,
          wordCount: countWords(extracted),
          lineCount: countLines(extracted),
        },
      };
    } else {
      type = TextParser.detectType(text);
    }

    return {
      text,
      meta: {
        name: file.name,
        type,
        size: file.size,
        wordCount: countWords(text),
        lineCount: countLines(text),
      },
    };
  }

  /**
   * Read file as text
   */
  static readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Extract text from PDF using pdf.js
   */
  static async extractPdfText(file: File): Promise<string> {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pages: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map((item: any) => item.str).join(' ');
        pages.push(text);
      }

      return pages.join('\n\n');
    } catch (err) {
      console.error('PDF extraction failed:', err);
      return `[PDF Extraction Error: ${err instanceof Error ? err.message : 'Unknown error'}]`;
    }
  }

  /**
   * Normalize text: trim, remove BOM, normalize whitespace
   */
  static normalizeText(text: string): string {
    return text
      .replace(/^\uFEFF/, '') // Remove BOM
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\t/g, '  ')   // Tabs to spaces
      .trim();
  }
}
