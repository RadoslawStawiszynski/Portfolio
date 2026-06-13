---
name: Security Review
description: Flag hardcoded secrets, missing validation, SQL injection, sensitive data logging
---

Review this pull request for security issues.

Flag as failing if any of these are true:
- Hardcoded API keys, tokens, passwords, secrets in source files or config
- New API endpoints or routes without proper input validation / sanitization
- SQL queries built with string concatenation (instead of prepared statements / ORM)
- Sensitive data (PII, credentials, tokens) logged to stdout, console, or logs
- Use of insecure random functions (Math.random in JS/TS) or weak crypto
- New dependencies with known high/critical vulnerabilities

If none of these issues are found, pass the check with short positive summary.
