# Enterprise Knowledge Lifecycle Governance
**Role:** Systems Administrator & Knowledge Architecture Lead  
**Organization:** Optimizely (Global Distributed Enterprise)  
**Stack:** Confluence Cloud API, Workato, Jira Service Management, Atlassian Rovo, Python, Webhooks  

---

## The Challenge: Knowledge Decay as an AI Blocker
As organizations deploy generative AI assistants (such as Atlassian Rovo, Microsoft Copilot, and custom RAG agents), an uncomfortable truth emerges: **AI assistants index whatever content they can access, including outdated, conflicting, and unmaintained documentation.**

In an enterprise Confluence instance containing thousands of pages across multiple global business units:
- Over 40% of documentation had no verified owner or had not been reviewed in over 12 months.
- Competing documentation versions gave conflicting answers to onboarding employees and AI indexing crawlers.
- Manual doc review initiatives consistently failed due to lack of tooling and accountability.

## The Architecture & Governance Engine
Rather than relying on human goodwill, I engineered an automated, policy-enforced **Knowledge Lifecycle Engine** integrating Confluence Cloud with Workato and Jira APIs:

1. **Metadata & Contract Schema Enforcement**:
   - Every production documentation page must declare explicit frontmatter metadata: `Owner (UUID)`, `Review Cadence (e.g., 90/180/365 days)`, `Domain Tag`, and `Classification Level`.
   - Pages lacking valid ownership or schemas are flagged during weekly validation sweeps.

2. **Automated Lifecycle Sweeps & SLA Tracking**:
   - A distributed Workato automation engine runs scheduled cron sweeps across target enterprise spaces.
   - When a page reaches its expiration threshold (`Last Verified Date + Cadence`), an automated review ticket is generated in Jira Service Management and assigned to the page owner with an SLA timer.

3. **Pruning & Deprecation Pipeline**:
   - If a page owner confirms obsolescence (or fails to respond after escalating notifications), the workflow automatically moves the page to an archived space with an explicit `NOINDEX` classification tag.
   - AI search connectors and RAG ingestion pipelines are configured to exclude deprecated spaces, preventing hallucinations and outdated answers from polluting enterprise queries.

## Concrete Outcomes
- **100% Schema Coverage**: Established mandatory verified ownership across targeted enterprise spaces.
- **Pruned Stale Corpus**: Automated deprecation and archiving of hundreds of obsolete legacy pages, immediately improving enterprise search precision.
- **Deterministic Ground Truth**: Rovo and internal AI integrations now query a certified corpus, eliminating conflicting architectural directives and outdated operational procedures.
