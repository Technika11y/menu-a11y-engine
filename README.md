# Menu Accessibility Engine

> Turns menu data into **WCAG-compliant, allergen-aware, screen-reader-friendly** menus — and
> lints the data first, failing closed on anything that would hide an allergen.
>
> Part of the **Technika11y** suite · *Root access for everyone.* · **the keystone: a11y × food × compliance**

[![ci](https://github.com/technika11y/menu-a11y-engine/actions/workflows/ci.yml/badge.svg)](https://github.com/technika11y/menu-a11y-engine/actions/workflows/ci.yml)
![status](https://img.shields.io/badge/status-pre--alpha-orange)
![license](https://img.shields.io/badge/license-Apache--2.0-blue)

---

## Quick start

```bash
git clone https://github.com/technika11y/menu-a11y-engine && cd menu-a11y-engine
node src/index.js lint examples/menu.json
```

## Status — read this first

**Pre-alpha (`v0.1.0-alpha`). Honest state of the code:**

| Capability | State |
|---|---|
| Lint: menu/section/item names present (real headings) | ✅ works |
| Lint: allergens **must be declared** (absent field = error; empty array = OK) | ✅ works |
| Lint: unrecognized allergen token warning (Big-9 typo catch) | ✅ works |
| Lint: structure — duplicate section names, empty sections, negative prices, duplicate items | ✅ works |
| Render: semantic HTML, valid `aria-labelledby` per section | ✅ works |
| Render: allergen + dietary info as **text**, never colour/icon-only | ✅ works |
| **Fails closed** — refuses to render a menu with errors | ✅ works |
| POS adapters (Square, Toast, Clover), i18n, price locale formatting | ⚠️ not built — [roadmap](#roadmap) |

This table is the honesty contract. If a row overstates the code, that's a bug — file it.

## Why it exists

A digital menu is where accessibility and food-safety compliance become the *same* problem: a
screen-reader user needs the allergen list read out, and an allergic diner needs it to be
*complete*. Most menu tooling treats allergens as an optional badge and conveys "vegan" with a
green dot — inaccessible and unsafe at once. This engine refuses both: allergen data must be
explicit, and everything renders as text a screen reader can announce.

## Usage

```bash
# lint a menu (exit 1 on any error — drop into CI)
node src/index.js lint examples/menu.json

# render accessible HTML (refuses if lint fails)
node src/index.js render examples/menu.json > menu.html
```

The safety rule in action:

```jsonc
{ "name": "Mystery Special", "price": 12 }   // no allergens field
// ERROR item-allergens-undeclared  section[0].item[0]
//   "Mystery Special" has no allergens field — declare it, even if empty. Unknown != none.
```

## Roadmap

- [ ] POS adapters (Square / Toast / Clover) → menu model
- [ ] Locale-aware price + i18n allergen names
- [ ] `axe`-checked HTML output snapshot tests
- [ ] Pairing with the Allergen Data Validator (OPS-08) for regulated labeling
- [ ] SARIF output + the shared Technika11y CI gate

## License

[Apache-2.0](LICENSE). See [`SECURITY.md`](SECURITY.md) and [`CONTRIBUTING.md`](CONTRIBUTING.md).

---

**Part of the [Technika11y](https://github.com/technika11y) suite** · [technika11y.github.io](https://technika11y.github.io/) · security, compliance, and accessibility as one discipline.
