# OMEGA Cluster: Sovereign Multi-Node AI & High-Availability Platform
**Role:** Systems & Hypervisor Architect  
**Domain:** Sovereign Infrastructure & Local AI Inference  
**Stack:** Proxmox VE 8.x, Corosync QDevice, ik_llama.cpp, Qdrant, Tailscale Mesh, OPNsense, PBS  

---

## The Challenge: Sovereign High Availability on Asymmetric Hardware
Operating self-hosted local AI inference and production services at home typically suffers from single-point-of-failure vulnerabilities, resource contention between inference and memory planes, and split-brain risks when attempting high availability on small physical footprints.

## Cluster Topology & Architecture
The OMEGA cluster is engineered across two asymmetric physical nodes and a cloud quorum relay:

- **Node 1 (`hp260 / omega`)**: Proxmox Master & Homelab Hub (`192.168.20.11`)
  - Runs core operational containers (Homepage, DocuSeal, Uptime Kuma, Wallos, Ntfy, Shlink).
- **Node 2 (`ms02 / ms-ultra-02`)**: AI Workhorse (`192.168.20.20`)
  - Dedicated to high-throughput inference and memory services.
  - CT401 (`ai-core`): Dedicated LLM runtime (ik_llama.cpp, 35B model, 128K context, locked memory).
  - CT402 (`ai-mem`): Qdrant vector database with API-key authentication and embedding microservice.
  - CT403 (`ai-flow`): n8n automation runtime, Paperless-ngx, and SearXNG metasearch.
  - CT404 (`ai-obs`): Prometheus telemetry, Grafana dashboards, and Vaultwarden.
- **Node 3 (`VPS / omega-relay`)**: External Corosync Quorum Witness (`100.84.144.24`)
  - Resides outside the physical local failure domain. Provides the critical 3rd quorum vote to prevent split-brain during rolling hypervisor kernel updates.

## Key Engineering Innovations
1. **Quorum Resilience**: By placing the Corosync QDevice on an external encrypted WireGuard/Tailscale relay, either physical node can be rebooted or serviced without cluster quorum loss or guest locks.
2. **Workload Separation**: Separated the volatile media and transcode plane from the vector memory tier, stabilizing query latency at under 8ms.
3. **Inference Hardening**: P-core pinning, explicit `mlock` enforcement, and serving a verified 128K token context window with zero page-swapping.
4. **Verified Bare-Metal Recovery**: Automated deduplicated nightly backups to Proxmox Backup Server, verified through periodic scheduled restoration drills.
