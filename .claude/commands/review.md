# Commit Preparation

Analyze current git changes, group them by feature/fix/test/docs, and present commits for review. Wait for user to say "go" before staging and committing with appropriate messages.

## Steps

1. Run `git status` to see current changes
2. Run `git diff --stat` to see the extent of changes
3. Analyze changes and group them by feature/fix/test/docs
4. Present commits to user for review in this format:
   ```
   1. feat(domain): [description]
      - [files changed]
   2. test(domain): [description]
      - [files changed]
   ...
   ```
5. Wait for user to say "go" before staging and committing
6. Stage files with `git add` and commit with appropriate message
7. Run tests after each commit (pre-commit hook will do this)
