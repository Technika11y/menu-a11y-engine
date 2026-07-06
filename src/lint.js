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

  const sectionNames = new Set();

  (menu.sections || []).forEach((section, si) => {
    const spath = `section[${si}]`;

    if (!section.name) {
      findings.push(f("section-no-name", "error", spath,
        "section has no name — its <h2> would be empty and unnavigable"));
    } else {
      const key = String(section.name).trim().toLowerCase();
      if (sectionNames.has(key)) {
        findings.push(f("duplicate-section-name", "warn", spath,
          `duplicate section name "${section.name}" — produces ambiguous headings and anchors`));
      }
      sectionNames.add(key);
    }

    const items = section.items || [];
    if (items.length === 0) {
      findings.push(f("section-empty", "warn", spath,
        `section "${section.name || "?"}" has no items — an <h2> with nothing beneath it`));
    }

    const itemNames = new Set();

    items.forEach((item, ii) => {
      const ipath = `${spath}.item[${ii}]`;

      if (!item.name) {
        findings.push(f("item-no-name", "error", ipath, "item has no name"));
      } else {
        const ikey = String(item.name).trim().toLowerCase();
        if (itemNames.has(ikey)) {
          findings.push(f("duplicate-item-name", "info", ipath,
            `duplicate item "${item.name}" within this section`));
        }
        itemNames.add(ikey);
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

      if ("price" in item) {
        if (typeof item.price !== "number") {
          findings.push(f("price-not-number", "warn", ipath,
            `price "${item.price}" is not numeric — ambiguous to render and to a screen reader`));
        } else if (item.price < 0) {
          findings.push(f("price-negative", "warn", ipath,
            `price ${item.price} is negative`));
        }
      }
    });
  });

  return findings;
}

export function hasErrors(findings) {
  return findings.some((x) => x.severity === "error");
}
