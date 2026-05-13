# Distributed Systems: From CAP to the New SQL Renaissance

## Introduction

The past decade has witnessed a fundamental shift in how we architect data-intensive applications. The monolithic relational database, once the undisputed centerpiece of enterprise architecture, has been challenged by a wave of distributed systems that prioritize scale, availability, and resilience over strict consistency.

This article explores the evolution from traditional ACID databases to the modern distributed systems landscape, examining the CAP theorem's practical implications, the rise of New SQL systems, and the emerging consensus around hybrid architectures.

## The CAP Theorem in Practice

Eric Brewer's CAP theorem, formalized by Gilbert and Lynch in 2002, states that a distributed data store can only provide two of three guarantees simultaneously: Consistency, Availability, and Partition Tolerance. While theoretically elegant, the practical interpretation has evolved significantly.

In real-world systems, partitions are not binary events but continuous phenomena. Network latency, packet loss, and temporary disconnections create a spectrum of partition scenarios. Modern systems don't simply choose CP or AP; they tune their behavior based on operational context.

For example, Amazon's DynamoDB defaults to eventual consistency but offers strongly consistent reads at higher latency. Cassandra allows per-operation tuning between quorum and one-node consistency. This "tunable consistency" model represents a pragmatic evolution from the CAP theorem's binary choice.

**Key Insight**: The CAP theorem isn't a constraint but a design space. Understanding the tradeoffs allows architects to make intentional decisions about consistency models, replication strategies, and failure modes.

## Consistency Models Explained

Consistency exists on a spectrum:

1. **Strong Consistency**: All reads return the most recent write. Simple for developers, expensive in distributed settings due to synchronization overhead.

2. **Eventual Consistency**: Reads may return stale data but will eventually converge. High availability and performance, but application logic must handle temporary inconsistencies.

3. **Causal Consistency**: Operations that are causally related are seen in the correct order. A useful middle ground that maps well to many real-world workflows.

4. **Read-Your-Writes**: A user always sees their own writes. Common in social media and collaboration tools.

The choice of consistency model fundamentally impacts application architecture. Eventual consistency requires conflict resolution logic at the application layer, while strong consistency may limit write throughput and availability.

## Partitioning Strategies

Distributed databases partition data across nodes to achieve scale. Three primary approaches dominate:

**Range Partitioning**: Data is divided by key ranges (e.g., users A-M on node 1, N-Z on node 2). Efficient for range queries but prone to hot spots.

**Hash Partitioning**: A hash function determines data placement. More uniform distribution but loses data ordering, making range queries expensive.

**Consistent Hashing**: A ring-based approach where nodes and keys hash into the same space. Minimizes remapping when nodes join or leave. Used by DynamoDB, Cassandra, and Riak.

Modern systems often combine approaches. CockroachDB uses range partitioning with automatic split and merge, while maintaining a global ordering via a distributed key-value store.

## Replication and Consensus

Replication ensures data durability and availability. The key challenge is maintaining consistency across replicas. Two major approaches exist:

**Leader-based Replication**: One node accepts writes and propagates changes. Simple but creates a single point of failure and potential bottleneck.

**Leaderless Replication**: Any node can accept writes. Higher availability but requires conflict resolution (e.g., last-write-wins, CRDTs, or application-level merging).

Consensus algorithms like Raft and Paxos solve the fundamental problem of getting multiple nodes to agree on a value despite failures. Raft's understandability has made it the consensus algorithm of choice for modern systems like etcd, Consul, and TiKV.

**Raft in Practice**: Raft operates through leader election, log replication, and safety guarantees. A cluster of 3-5 nodes can tolerate minority failures while maintaining strong consistency. Read performance can be optimized through leader leases and read-only replicas.

## The New SQL Movement

New SQL databases aim to provide the scalability of NoSQL systems with the transactional guarantees of traditional relational databases. Key players include:

**CockroachDB**: A distributed SQL database inspired by Google Spanner. Uses Raft for consensus and a global clock (HLC) for external consistency. Supports full SQL and ACID transactions across geo-distributed regions.

**TiDB**: A hybrid transactional/analytical processing (HTAP) system. Separates compute from storage, with TiKV (a key-value store) handling storage and a MySQL-compatible layer for SQL processing.

**YugabyteDB**: A distributed SQL database with a PostgreSQL-compatible query layer. Uses a custom consensus algorithm built on Raft principles.

These systems demonstrate that strong consistency, global distribution, and SQL compatibility are not mutually exclusive—though they come with latency costs that must be carefully managed.

## Performance Considerations

Distributed system performance is dominated by network latency. At 50ms inter-datacenter latency, a single round trip takes 100ms. With Raft's majority commit requiring multiple rounds, write latency can exceed 300ms for geo-distributed configurations.

Optimization strategies include:

- **Read Replicas**: Serve reads from local nodes while routing writes through consensus.
- **Caching Layers**: Redis/Memcached fronting for hot data.
- **Colocation**: Placing related data on the same node to minimize distributed transactions.
- **Batching and Pipelining**: Combining operations to reduce round trips.

Benchmarking shows that CockroachDB achieves 100K writes/second on a 3-node cluster with local SSDs, dropping to ~10K writes/second with 50ms of inter-region latency. Read throughput degrades less dramatically, as read replicas can serve local requests.

## Conclusion

The distributed database landscape has matured significantly. The choice is no longer between "SQL with ACID" and "NoSQL with scale." Modern systems offer a spectrum of consistency, performance, and deployment models.

For most applications, the practical recommendation is:

1. **Start simple**: Use a single-node SQL database. It will handle most workloads.
2. **Add replication**: When you need availability, add read replicas with synchronous failover.
3. **Distribute intentionally**: Only adopt distributed databases when data locality, write throughput, or global availability demands it.

The future belongs to systems that make distribution invisible to developers while providing strong guarantees. The New SQL movement is delivering on this promise, one Raft round at a time.
