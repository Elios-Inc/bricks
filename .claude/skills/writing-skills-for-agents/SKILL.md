---
name: writing-skills-for-agents
description: >
  Author, structure, and iterate on Claude Code SKILL.md files following best practices.
  Use when creating a new skill, refactoring an existing skill, reviewing skill quality,
  or when the user says "write a skill", "create a skill", "SKILL.md", "skill authoring",
  or asks how to structure skills for agents.
---

# Writing Skills for Agents

## Core Principles

### Conciseness is paramount

The context window is shared. Only add context Claude doesn't already have.

Challenge every line: "Does Claude need this explanation, or does it already know this?" Cut anything that explains general knowledge (what a PDF is, how libraries work, etc.).

### Degrees of freedom

Match specificity to the task's fragility:

| Freedom | When | Example |
|---------|------|---------|
| **High** (text instructions) | Multiple valid approaches, context-dependent | Code review guidelines |
| **Medium** (pseudocode/templates) | Preferred pattern exists, some variation OK | Report generation with configurable format |
| **Low** (exact scripts) | Fragile operations, consistency critical | Database migrations, exact CLI commands |

Default to high freedom. Only constrain where mistakes are costly.

## Frontmatter Rules

```yaml
---
name: my-skill-name        # max 64 chars, lowercase + numbers + hyphens only
                            # no XML tags, no reserved words ("anthropic", "claude")
description: >              # max 1024 chars, non-empty, no XML tags
  What it does. When to use it. Key trigger terms.
---
```

### Naming

Prefer gerund form: `writing-documentation`, `processing-pdfs`, `managing-databases`.

Avoid vague names (`helper`, `utils`, `tools`) and overly generic names (`documents`, `data`).

### Descriptions

The description is the single most critical field. Claude uses it to select from 100+ skills.

**Rules:**
- Write in third person ("Processes files" not "I help you process files")
- Include BOTH what it does AND when to trigger it
- Include specific trigger terms users might say
- Be specific, not vague

```yaml
# Good
description: >
  Extract text and tables from PDF files, fill forms, merge documents.
  Use when working with PDF files or when the user mentions PDFs, forms,
  or document extraction.

# Bad
description: Helps with documents
```

## Structure

### Keep SKILL.md under 500 lines

Only metadata (name + description) is pre-loaded at startup. SKILL.md is read on-demand when triggered. Additional files are read only when referenced.

### Progressive disclosure

SKILL.md is a table of contents pointing to detailed material. Keep core instructions inline; split reference material into sibling files loaded on demand.

### Directory conventions

Skills use two standard subdirectories. Always place supporting files in these rather than loose in the skill root:

| Directory | Purpose | Example files |
|-----------|---------|---------------|
| `references/` | Supporting knowledge, templates, examples, domain docs | `brand-voice-guide.md`, `field-taxonomy.md` |
| `commands/` | Subcommand implementations (skills with multiple entry points) | `hubspot-audit.md`, `outreach-email.md` |

```text
my-skill/
├── SKILL.md              # Core instructions (loaded when triggered)
├── references/
│   ├── api-reference.md  # Detailed reference (loaded as needed)
│   └── examples.md       # Usage examples (loaded as needed)
└── commands/             # Only if skill has distinct subcommands
    └── audit.md
```

**Keep references one level deep.** Claude may partially read files referenced from other referenced files. All reference files must link directly from SKILL.md.

```markdown
# Good - references from SKILL.md to files in references/
**Advanced features**: See [advanced.md](references/advanced.md)
**API reference**: See [reference.md](references/reference.md)

# Bad - nested references
SKILL.md → references/advanced.md → references/details.md → actual info

# Bad - loose files in skill root instead of references/
my-skill/
├── SKILL.md
├── guide.md          # Should be in references/guide.md
└── examples.md       # Should be in references/examples.md
```

For reference files over 100 lines, add a table of contents at the top so Claude can see scope even with partial reads.

### Organization patterns

**High-level guide with references** (most common):
```markdown
# My Skill
## Quick start
[Core instructions inline]

## Advanced
See [reference.md](references/reference.md) for detailed API docs
See [examples.md](references/examples.md) for common patterns
```

**Domain-specific** (multiple knowledge areas):
```text
skill/
├── SKILL.md (navigation)
└── references/
    ├── finance.md
    ├── sales.md
    └── product.md
```

**Multi-command** (distinct subcommands with shared references):
```text
skill/
├── SKILL.md (routing + shared rules)
├── commands/
│   ├── audit.md
│   └── sync.md
└── references/
    ├── field-taxonomy.md
    └── templates.md
```

**Conditional** (different workflows by task type):
```markdown
**Creating new content?** → See [creation.md](references/creation.md)
**Editing existing?** → See [editing.md](references/editing.md)
```

## Writing Instructions

### Workflows

Break complex operations into numbered steps. For multi-step workflows, provide a checklist Claude can copy and track:

````markdown
```
Progress:
- [ ] Step 1: Analyze input
- [ ] Step 2: Create plan
- [ ] Step 3: Validate plan
- [ ] Step 4: Execute
- [ ] Step 5: Verify output
```
````

### Feedback loops

Include validate-fix-repeat cycles for quality-critical tasks:

```markdown
1. Make changes
2. Run validation: `python scripts/validate.py`
3. If validation fails → fix and re-validate
4. Only proceed when validation passes
```

### Templates

Provide output templates when format matters. Use "ALWAYS use this exact structure" for strict requirements, or "sensible default, adapt as needed" for flexible guidance.

### Examples

Input/output pairs teach style more effectively than descriptions. Include 2-3 examples showing the desired output format and level of detail.

### Conditional workflows

Guide through decision points explicitly:
```markdown
1. Determine task type:
   **New content?** → Follow creation workflow
   **Editing?** → Follow editing workflow
```

## Content Rules

- **No time-sensitive info.** Don't write "before August 2025, use X." Use a "current method" section and an "old patterns" section.
- **Consistent terminology.** Pick one term per concept and use it everywhere. Don't alternate between "endpoint", "URL", "route", "path".
- **Don't offer too many options.** Provide one default approach with an escape hatch for edge cases.
- **Forward slashes only** in file paths. Unix paths work everywhere; backslashes break on Unix.

## Executable Code in Skills

See [executable-code.md](references/executable-code.md) for guidance on bundling scripts, handling errors, utility scripts, verifiable intermediate outputs, dependency management, and MCP tool references.

## Iteration Workflow

1. **Identify gaps:** Run Claude on representative tasks without the skill. Note failures.
2. **Create evaluations:** Build 3+ scenarios testing those gaps.
3. **Establish baseline:** Measure performance without the skill.
4. **Write minimal instructions:** Just enough to pass evaluations.
5. **Test with a fresh Claude instance:** Observe behavior, not just output.
6. **Iterate:** Fix what doesn't work based on observed agent behavior.

**What to watch for during testing:**
- Does Claude read files in unexpected order? (Structure may not be intuitive)
- Does Claude miss references to important files? (Links need to be more prominent)
- Does Claude re-read the same file repeatedly? (Content belongs in SKILL.md instead)
- Does Claude never access a bundled file? (File may be unnecessary)

## Checklist

Before finishing, verify:

- [ ] Description is specific with trigger terms, written in third person
- [ ] SKILL.md body under 500 lines
- [ ] Only includes context Claude doesn't already know
- [ ] References are one level deep from SKILL.md
- [ ] Supporting files in `references/` or `commands/`, not loose in skill root
- [ ] Consistent terminology throughout
- [ ] No time-sensitive information
- [ ] Workflows have clear numbered steps
- [ ] Freedom level matches task fragility
- [ ] Tested with real usage scenarios
