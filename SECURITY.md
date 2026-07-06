# Security Policy

## Scope & intended use

Menu Accessibility Engine reads a menu data file and emits HTML. It performs no network I/O and
executes nothing from the input. Note that a defect here has a **safety** dimension: a bug that
drops allergen data is a real-world hazard, so treat allergen-handling regressions as security-
grade.

## Reporting a vulnerability

Report issues **in this tool** privately, not via public issues:

- GitHub **Report a vulnerability** (Security → Advisories) on this repo, or
- email the maintainer listed on the org profile.

Include a description, reproduction, and impact. Target: **5 business days** to acknowledge, with a
coordinated disclosure timeline agreed before any public write-up.
