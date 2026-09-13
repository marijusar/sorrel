import { describe, expect, it } from "vitest";
import { AstLiteralExtractor } from "#src/crawler/ast-literal-extractor";

describe("AstLiteralExtractor.extractHints", () => {
  it("extracts a plain literal with no metacharacters", () => {
    expect(AstLiteralExtractor.extractHints("jquery").map((hint) => hint.literal)).toEqual(["jquery"]);
  });

  it("lowercases the extracted hint", () => {
    expect(AstLiteralExtractor.extractHints("jQuery").map((hint) => hint.literal)).toEqual(["jquery"]);
  });

  it("carries the original pattern source on each hint", () => {
    const hints = AstLiteralExtractor.extractHints("jquery-([\\d.]+)\\.min\\.js|jquery\\.js");
    expect(hints.every((hint) => hint.pattern === "jquery-([\\d.]+)\\.min\\.js|jquery\\.js")).toBe(true);
  });

  it("contributes one hint per top-level alternation branch", () => {
    // Escaped dots are plain Character nodes, so unlike the old string-based
    // extractor, the second branch merges fully into "jquery.js" instead of
    // losing the ".js" suffix.
    const hints = AstLiteralExtractor.extractHints("jquery-([\\d.]+)\\.min\\.js|jquery\\.js");
    expect(hints.map((hint) => hint.literal)).toEqual(["jquery-", "jquery.js"]);
  });

  it("treats a real nested alternation as opaque instead of picking a branch-specific fragment", () => {
    // The `|` here is inside `(?:...)`, a real Group with 2 alternatives —
    // "-native" is only guaranteed if that specific branch matched, so
    // picking it as the pattern's hint would be unsound (a page matching
    // via "-dom" wouldn't contain "-native" at all). "react" is the only
    // text guaranteed regardless of which branch matches.
    const hints = AstLiteralExtractor.extractHints("react(?:-dom|-native)\\.js");
    expect(hints.map((hint) => hint.literal)).toEqual(["react"]);
  });

  it("masks character classes instead of treating them as literal", () => {
    const hints = AstLiteralExtractor.extractHints("version-([\\d.]+)\\.js");
    expect(hints.map((hint) => hint.literal)).toEqual(["version-"]);
  });

  it("merges escaped literal characters across the whole run, including dots", () => {
    // A real Character node either way — nothing special about "." here.
    expect(AstLiteralExtractor.extractHints("cdn\\.example\\.com").map((hint) => hint.literal)).toEqual([
      "cdn.example.com",
    ]);
    expect(AstLiteralExtractor.extractHints("my\\-app\\.js").map((hint) => hint.literal)).toEqual(["my-app.js"]);
  });

  it("breaks a run on a real regex escape class", () => {
    // `\s` parses as a CharacterSet, a distinct node type from Character —
    // no risk of leaking part of it as literal text.
    const hints = AstLiteralExtractor.extractHints("Version\\s*:\\s*([\\d.]+)");
    expect(hints.map((hint) => hint.literal)).toEqual(["version"]);
  });

  it("does not treat a colon as a metacharacter split point", () => {
    const hints = AstLiteralExtractor.extractHints("generator:wordpress");
    expect(hints.map((hint) => hint.literal)).toEqual(["generator:wordpress"]);
  });

  it("drops runs shorter than the minimum literal length", () => {
    expect(AstLiteralExtractor.extractHints("aaa\\d+").map((hint) => hint.literal)).toEqual([]);
    expect(AstLiteralExtractor.extractHints("aaaa\\d+").map((hint) => hint.literal)).toEqual(["aaaa"]);
  });

  it("picks the longest surviving run within a branch", () => {
    const hints = AstLiteralExtractor.extractHints("ab\\d+longerliteral");
    expect(hints.map((hint) => hint.literal)).toEqual(["longerliteral"]);
  });

  it("returns no hints when any top-level branch has no literal run long enough", () => {
    expect(AstLiteralExtractor.extractHints("jquery|[a-f0-9]{32}").map((hint) => hint.literal)).toEqual([]);
  });

  it("returns no hints for a pattern that is entirely a character class", () => {
    expect(AstLiteralExtractor.extractHints("[a-z0-9]{32}").map((hint) => hint.literal)).toEqual([]);
  });

  it("treats an escaped pipe as one literal character, not a branch boundary", () => {
    // `\|` is a Character node (value 124), not real alternation — the
    // whole "price|total" stays one unbroken run.
    const hints = AstLiteralExtractor.extractHints("price\\|total");
    expect(hints.map((hint) => hint.literal)).toEqual(["price|total"]);
  });

  it("excludes an optional quantified character instead of assuming it's present", () => {
    // `p?` has min: 0 — only "acsbap" (not "acsbapp") is actually
    // guaranteed, so the string-based extractor's "acsbapp" was unsound.
    // "/acsb.js" (8 chars) also beats it out as the longest surviving run.
    const hints = AstLiteralExtractor.extractHints("acsbapp?\\.com/.*/acsb\\.js");
    expect(hints.map((hint) => hint.literal)).toEqual(["/acsb.js"]);
  });

  it("repeats a quantified character exactly `min` times when min === max", () => {
    const hints = AstLiteralExtractor.extractHints("x{3}abcd");
    expect(hints.map((hint) => hint.literal)).toEqual(["xxxabcd"]);
  });

  it("breaks the run after a quantified character when min !== max", () => {
    // Only 2 "x"s are guaranteed (up to 5 might appear) — the run can't
    // safely continue past that uncertainty into "abcd".
    const hints = AstLiteralExtractor.extractHints("x{2,5}abcd");
    expect(hints.map((hint) => hint.literal)).toEqual(["abcd"]);
  });
});
