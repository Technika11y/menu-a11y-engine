// Renders menu data into accessible HTML: semantic landmarks and headings, allergen and
// dietary info exposed as TEXT (never colour- or icon-only), and section headings wired to
// their <section> via a valid aria-labelledby idref.
function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]
  ));
}
function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "x";
}
function fmt(n) {
  return typeof n === "number" ? n.toFixed(2) : String(n);
}

export function renderMenu(menu) {
  const lines = [];
  lines.push(`<h1>${esc(menu.title || "Menu")}</h1>`);

  (menu.sections || []).forEach((section, si) => {
    const id = `sec-${si}-${slug(section.name || "section")}`;
    lines.push(`<section aria-labelledby="${id}">`);
    lines.push(`  <h2 id="${id}">${esc(section.name || "")}</h2>`);
    lines.push(`  <ul class="menu-items">`);

    (section.items || []).forEach((item) => {
      lines.push(`    <li class="menu-item">`);
      const price = item.price != null ? ` <span class="price">$${esc(fmt(item.price))}</span>` : "";
      lines.push(`      <p class="name">${esc(item.name || "")}${price}</p>`);
      if (item.description) {
        lines.push(`      <p class="desc">${esc(item.description)}</p>`);
      }
      if (Array.isArray(item.allergens)) {
        const txt = item.allergens.length
          ? `Contains: ${item.allergens.map(esc).join(", ")}`
          : "No major allergens declared";
        lines.push(`      <p class="allergens">${txt}</p>`);
      }
      if (Array.isArray(item.diet) && item.diet.length) {
        lines.push(`      <p class="diet">Dietary: ${item.diet.map(esc).join(", ")}</p>`);
      }
      lines.push(`    </li>`);
    });

    lines.push(`  </ul>`);
    lines.push(`</section>`);
  });

  return lines.join("\n") + "\n";
}
