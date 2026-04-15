# Executable Code in Skills

## Solve, don't punt

Scripts should handle errors rather than failing and leaving Claude to figure it out.

```python
# Good: handle errors explicitly
def process_file(path):
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        print(f"File {path} not found, creating default")
        with open(path, "w") as f:
            f.write("")
        return ""

# Bad: punt to Claude
def process_file(path):
    return open(path).read()
```

No magic numbers. Document why every constant has its value:

```python
# Good
REQUEST_TIMEOUT = 30  # HTTP requests typically complete within 30s
MAX_RETRIES = 3       # Most intermittent failures resolve by 2nd retry

# Bad
TIMEOUT = 47  # Why 47?
```

## Utility scripts

Pre-made scripts are more reliable than generated code, save tokens, save time, and ensure consistency.

Make clear whether Claude should **execute** or **read** each script:
- "Run `validate.py` to check the output" (execute — most common)
- "See `validate.py` for the validation algorithm" (read as reference)

Document scripts with their command, purpose, and output format:

````markdown
**analyze_form.py**: Extract form fields from PDF
```bash
python scripts/analyze_form.py input.pdf > fields.json
```
Output: `{"field_name": {"type": "text", "x": 100, "y": 200}}`
````

## Verifiable intermediate outputs

For complex, error-prone tasks, use the plan-validate-execute pattern:

1. Analyze input
2. **Create plan file** (e.g., `changes.json`)
3. **Validate plan** with a script
4. Execute only after validation passes
5. Verify output

This catches errors before they're applied. Make validation scripts verbose with specific error messages:
```
Field 'signature_date' not found. Available fields: customer_name, order_total, signature_date_signed
```

Use this pattern for: batch operations, destructive changes, complex validation, high-stakes operations.

## Dependencies

List required packages in SKILL.md. Don't assume anything is installed:

````markdown
Install required package: `pip install pypdf`

```python
from pypdf import PdfReader
reader = PdfReader("file.pdf")
```
````

## MCP tool references

Always use fully qualified names to avoid "tool not found" errors:

```markdown
Use the BigQuery:bigquery_schema tool to retrieve table schemas.
Use the GitHub:create_issue tool to create issues.
```

Format: `ServerName:tool_name`
