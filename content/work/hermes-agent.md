# Hermes: Dossier-Grounded Sovereign Operations Agent
**Role:** Sovereign Systems Architect & AI Infrastructure Engineer  
**Domain:** Sovereign AI & Autonomous Systems Operations  
**Stack:** Python, llama.cpp / ik_llama, Qdrant Vector DB, Tailscale Zero-Trust, Docker, Proxmox VE  

---

## The Challenge: The Unbounded Agent Fallacy
Autonomous operations agents often suffer from a fatal flaw in infrastructure management: **either they are toys restricted to harmless readouts, or they are dangerous black boxes granted unconstrained shell access.**

When an autonomous system operates on production infrastructure:
- LLMs hallucinate CLI commands or execute destructive mutations during cascade failures.
- Unchecked context windows lose track of operational state during extended multi-step tasks.
- Agents lack continuous grounding in the physical cluster topology, resulting in actions targeting wrong hosts or subnets.

## The Architectural Solution: Governed Autonomous Runtime
I engineered **Hermes**, a local autonomous systems operator deployed on the sovereign OMEGA cluster, built around a strict **Safety-First Operational Loop**:

```
[ Clarify Intent ] ➔ [ Inspect Live Telemetry ] ➔ [ Draft Action Plan ]
        ↓
[ Generate Preview / Diff ] ➔ [ Await Human Approval Gate ] ➔ [ Execute & Audit Log ]
```

### Key Technical Guardrails:
1. **Dossier-Grounded Execution**:
   - Hermes does not guess infrastructure layout. It loads authoritative runtime dossiers (verified node maps, IP allocations, container roles, and port bindings) directly from vector memory (Qdrant) and local canonical files before generating any command.
2. **Read-Mostly Triage Separation**:
   - Hermes is granted autonomous read-only authority to poll Prometheus metrics, scrape Loki log streams, and run non-mutating status probes.
   - **State-changing actions** (restarts, firewall modifications, container provisioning) are strictly halted behind cryptographic or webhook approval gates.
3. **Hermetic Local Inference**:
   - Runs against an on-premises 35B parameter quantized LLM running in ik_llama.cpp with locked memory (`mlock`) and pinned CPU cores, completely decoupled from external cloud API availability or data leakage.

## Measurable Results
- **Zero Accidental Mutative Incidents**: 100% of state-changing operations gated behind verified previews.
- **Under 2-Minute Incident Triage**: Automated anomaly detection and log correlation across 9 cluster containers without human intervention.
- **Self-Documenting Decision Ledger**: Every operational intervention logs its chain-of-thought and telemetry snapshot to a persistent audit trail.
