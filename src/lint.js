// Accessibility + allergen-safety checks over menu data. Pure functions — no I/O — so the
// rules unit-test cleanly. The suite's edge is the intersection: an ordinary JSON validator
// doesn't know that "no allergen field" is a safety defect, not a style nit.

// FDA FALCPA "Big-9" major allergens (sesame added 2023).
const BIG9 = new Set([
  "milk", "eggs", "fish", "shellfish", "tree nuts", "peanuts", "wheat", "soybeans", "sesame",
]);

function f(rule, severity, path, message) {
  return { rule, severity, path, message };
}

export function lintMenu(menu) {
  const findings = [];

  if (!menu.title) {
    findings.push(f("menu-no-title", "error", "menu",
      "menu has no title — screen-reader users land on a page with no <h1>"));
  }

  (menu.sections || []).forEach((section, si) => {
    const spath = `section[${si}]`;
    if (!section.name) {
      findings.push(f("section-no-name", "error", spath,
        "section has no name — its <h2> would be empty and unnavigable"));
    }

    (section.items || []).forEach((item, ii) => {
      const ipath = `${spath}.item[${ii}]`;

      if (!item.name) {
        findings.push(f("item-no-name", "error", ipath, "item has no name"));
      }

      // Allergen data must be EXPLICIT. An absent field means "unknown", and unknown is not
      // the same as none — that's the whole point of allergen labeling.
      if (!("allergens" in item)) {
        findings.push(f("item-allergens-undeclared", "error", ipath,
          `"${item.name || "?"}" has no allergens field — declare it, even if empty. Unknown != none.`));
      } else {
        (item.allergens || []).forEach((a) => {
          if (!BIG9.has(String(a).toLowerCase())) {
            findings.push(f("allergen-unknown-token", "warn", ipath,
              `allergen "${a}" is not a recognized major allergen (Big-9) — a typo hides a real allergen`));
          }
        });
      }

      if ("price" in item && typeof item.price !== "number") {
        findings.push(f("price-not-number", "warn", ipath,
          `price "${item.price}" is not numeric — ambiguous to render and to a screen reader`));
      }
    });
  });

  return findings;
}

export function hasErrors(findings) {
  return findings.some((x) => x.severity === "error");
}
