# OrbitOS — Claude Code

Read `AGENTS.md` before doing any work.

Then read:

- `OrbitOS master plan.md`
- `docs/ARCHITECTURE.md`
- `docs/DATABASE.md`
- `docs/SECURITY.md`
- `docs/DESIGN-SYSTEM.md`
- `docs/TESTING.md`
- `docs/DEVELOPMENT_ROADMAP.md`

The master plan is the product requirement source of truth. `AGENTS.md` is the agent execution contract.

Inspect the existing repository before coding. Continue implementation phase-by-phase, testing after each significant slice. Do not create mock functionality or silently introduce a competing architecture.

Canonical tenant terminology is **Business**:
`businesses` / `business_members` / `business_id`.

Do not treat `.claude/worktrees/` contents as application source.
