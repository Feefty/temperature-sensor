## CRITICAL RULES

- Never edit CLAUDE.md or AGENTS.md unless explicitly asked to update docs.
- Never spawn without permission unless the user explicitly asks to run it.
- Never use git in validator prompts. Validate files directly.
- (Add other items in the critical rules when prompted to do it)

---

## Agent Philosophy

This project uses **Opencode** as the agent orchestration layer, which automatically selects the optimal agent/model for each task. The guidelines in this file describe the expected workflow regardless of which specific agent is active. This is why we have decided to go with a single entrypoint of AGENTS.md and use a CLAUDE.md to include this file for Claude Code to always to take it into account. When available, we will use [**Cline Kanban**](https://cline.bot/kanban) (`pnpx kanban` to start the session) to manage the project by boards like Kanban style: creating new tasks and organising them by order of priority and category right through the boards UI without having to open the terminal.

---

## Anti-Patterns

> This section documents patterns to avoid. These are not hard rules but guidance to maintain a robust codebase. Future lint rules may formalize some of these into explicit warnings.

## Custom Commands

### /review - Commit Preparation

Use the `/review` slash command to prepare commits. This runs the workflow defined in `.claude/commands/review.md`:

1. Analyze changes with `git status` & `git diff --stat`
2. Group changes by feature/fix/test/docs
3. Present commits for review
4. Wait for "go" before staging and committing
5. Run tests after each commit

### Git Workflow and Guidelines

#### General guidelines

- Keep the commits small and focused
- Suggest committing often and commit messily if you need to
- Do not actually commit unless specified, always suggest what to commit first with the `/review` with a clear commit message and wait for "go" before staging and committing
- Prefer --force-with-lease over --force for pushing while rebasing
- Never git push --force on a shared branch itself
- Write commit messages like you’re explaining them to yourself six months from now
- Before you start recreating work from scratch, check reflog first
- When rebasing interactively, squash the WIP commits while rewording anything embarrassing and make the diff tell a coherent story.
- Use rebase in the local and remote branch and use merge commits when landing the work on the target branch
- At the beginning of any session, before touching a single file, run `git fetch origin` to sync your local view of what the remote actually looks like. Then `git rebase origin/[target_branch]`
- Avoid committing test commits (e.g., "test: verify setup"). If a test commit is made accidentally, undo it with `git reset --soft HEAD~1` before continuing work to avoid polluting the commit history.

### Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/) format enforced via husky + commitlint.

**Format:**

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**
| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code restructuring |
| `perf` | Performance improvement |
| `test` | Adding/updating tests |
| `build` | Build system changes |
| `ci` | CI/CD changes |
| `chore` | Maintenance tasks |
| `revert` | Reverting changes |

**Examples:**

```
feat(newsletter): make CTA button larger
docs: update AGENTS.md with new patterns
```

### Communication

- Be concise and direct
- Explain technical decisions
- Ask clarifying questions for ambiguous requirements
