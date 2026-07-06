import test from "node:test";
import assert from "node:assert/strict";
import { lintMenu, hasErrors } from "../src/lint.js";
import { renderMenu } from "../src/render.js";

const menu = (over = {}) => ({
  title: "Dinner",
  sections: [{
    name: "Starters",
    items: [{ name: "Sardine Toast", price: 9.5, allergens: ["fish", "wheat"] }],
  }],
  ...over,
});

test("clean menu has no errors", () => {
  assert.equal(hasErrors(lintMenu(menu())), false);
});

test("item with no allergens field is an error (unknown != none)", () => {
  const m = menu({ sections: [{ name: "S", items: [{ name: "Mystery", price: 5 }] }] });
  assert.ok(lintMenu(m).some((f) => f.rule === "item-allergens-undeclared" && f.severity === "error"));
});

test("empty allergens array is allowed (explicitly none)", () => {
  const m = menu({ sections: [{ name: "S", items: [{ name: "Water", allergens: [] }] }] });
  assert.ok(!lintMenu(m).some((f) => f.rule === "item-allergens-undeclared"));
});

test("an unrecognized allergen token warns (typo hides a real allergen)", () => {
  const m = menu({ sections: [{ name: "S", items: [{ name: "X", allergens: ["fish", "glutenn"] }] }] });
  assert.ok(lintMenu(m).some((f) => f.rule === "allergen-unknown-token" && f.severity === "warn"));
});

test("section without a name is an error", () => {
  assert.ok(lintMenu(menu({ sections: [{ items: [] }] })).some((f) => f.rule === "section-no-name"));
});

test("menu without a title is an error", () => {
  assert.ok(lintMenu(menu({ title: "" })).some((f) => f.rule === "menu-no-title"));
});

test("render exposes allergens as text and labels each section", () => {
  const html = renderMenu(menu());
  assert.match(html, /Contains: fish, wheat/);
  assert.match(html, /<section aria-labelledby="sec-0-starters">/);
  assert.match(html, /<h2 id="sec-0-starters">Starters<\/h2>/);
});

test("duplicate section names warn (ambiguous headings/anchors)", () => {
  const m = menu({ sections: [
    { name: "Mains", items: [{ name: "A", allergens: [] }] },
    { name: "Mains", items: [{ name: "B", allergens: [] }] },
  ] });
  assert.ok(lintMenu(m).some((f) => f.rule === "duplicate-section-name" && f.severity === "warn"));
});

test("an empty section warns", () => {
  const m = menu({ sections: [{ name: "Coming Soon", items: [] }] });
  assert.ok(lintMenu(m).some((f) => f.rule === "section-empty" && f.severity === "warn"));
});

test("a negative price warns", () => {
  const m = menu({ sections: [{ name: "S", items: [{ name: "X", price: -3, allergens: [] }] }] });
  assert.ok(lintMenu(m).some((f) => f.rule === "price-negative" && f.severity === "warn"));
});

test("duplicate item names within a section are noted", () => {
  const m = menu({ sections: [{ name: "S", items: [
    { name: "Soup", allergens: [] }, { name: "Soup", allergens: [] },
  ] }] });
  assert.ok(lintMenu(m).some((f) => f.rule === "duplicate-item-name"));
});
