---
name: create-pull-request
description: Draft and submit pull requests via gh CLI. Use when users ask to create/open/publish/submit a PR, push work for review, or update PR details.
compatibility: claude-code, opencode
---

# Create Pull Request

Draft a PR title and description, confirm with user, then submit via `gh pr create`.

## Trigger Phrases

Use this skill when users say things like:

- "create a PR"
- "open a PR"
- "publish a PR"
- "submit this for review"
- "raise a pull request"
- "update the PR"

## Workflow

- [ ] Ensure changes are committed
- [ ] Sync with latest `dev`
- [ ] Create/use correctly named branch
- [ ] Draft title and concise description
- [ ] Confirm with user
- [ ] Submit PR against `dev`

## Step 1: Check for Uncommitted Changes

```bash
git status --porcelain
```

If there are uncommitted changes, create commits directly with git commands, but only include changes the user explicitly requested or changes clearly in scope.

## Step 2: Branch and Base Branch Rules (Elios)

Always follow these repo-specific rules unless the user explicitly requests otherwise:

1. Branch from the latest `dev`
2. Open PRs with `--base dev`
3. Use one of these branch name formats:
   - `<team-slug>/feature-<name>`
   - `<team-slug>/bugfix-<name>`
   - `<team-slug>/ESB-123-<name>` (when a ticket exists)

Team slug convention:

- Use first initial + last name, lowercase (for example `mgroff`, `cbouche`)

Ticketing convention:

- Ticket system is JIRA.
- Ticket format is `ESB-123`.
- Example ticket URL format: `https://eliostalent.atlassian.net/browse/ESB-1531`.
- Never invent a ticket number.

Recommended setup sequence:

```bash
git fetch origin dev
git switch dev
git pull origin dev
git switch -c <team-slug>/feature-<name>
```

## Step 3: Gather Details

If not already clear from context, ask the user:

1. PR base branch (default `dev`)
2. Optional JIRA ticket (`ESB-###`)
3. Related tickets/links
4. Standards alignment notes
5. Intentional deviations

## Step 4: Draft Title and Description

### Title Rules

- Imperative mood ("Add", "Fix", "Refactor")
- 50 chars or fewer when practical
- Capitalize first word
- No trailing period
- Prefer `[ESB-123] <short imperative title>` when ticket exists

### Description Rules

- Explain what changed and why
- Keep concise; no "Test plans" section
- Include standards alignment with `CLAUDE.md`
- Do not mention AI tooling in PR text

Template:

```markdown
## Summary

[One paragraph on what and why]

## Changes

- [Key change]
- [Key change]

## Standards Alignment

- [How this follows existing conventions]
- [Any intentional deviation and why]

## Related

- Ticket: <ESB-###>
- Related: <JIRA URL>
```

## Step 5: Confirm with User

Present draft title and description and get confirmation before creating PR.

## Step 6: Submit PR

```bash
gh pr create \
  --title "Your title here" \
  --body "Your description here" \
  --base dev
```

After creation, return the PR URL.
