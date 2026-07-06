# Contributing

## Ground rules

- **Honesty contract:** the README status table must always match the code; a capability PR
  updates that table in the same change.
- **License:** contributions accepted under [Apache-2.0](LICENSE).
- **Sign-off (DCO):** commit with `git commit -s`.
- **Fail closed on safety:** any change to rendering must preserve the rule that a menu with
  errors produces **no** HTML. Never render around an allergen defect.

## Dev loop

```bash
node --test
node src/index.js lint examples/menu.json
node src/index.js render examples/menu.json
```

## Design conventions

- `lint.js` and `render.js` are **pure** (data in, data out) so both are unit-testable without a
  browser or a server. I/O lives in `index.js`.
- Every new lint rule ships with a test and a README status row.
- Prefer checks at the a11y × food-safety intersection (allergen completeness, text-not-colour
  cues, heading structure) over generic JSON validation a schema library already does.
