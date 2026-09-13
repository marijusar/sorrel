import { RegExpParser } from "@eslint-community/regexpp";
import type { AST } from "@eslint-community/regexpp";
import { Hint } from "./hint.ts";

// Extracts literal hints from a regex. x-{3} -> xxx , ^jquery$ -> jquery
// Only extracts guaranteed hints
export class AstLiteralExtractor {
  private static readonly parser = new RegExpParser();
  private static readonly MIN_LITERAL_LENGTH = 4;

  static extractHints(source: string): Hint[] {
    let pattern: AST.Pattern;
    try {
      pattern = this.parser.parsePattern(source);
    } catch {
      return [];
    }

    const literals: string[] = [];
    for (const alt of pattern.alternatives) {
      const literal = AstLiteralExtractor.longestLiteral(alt);
      // if any branch fails, none of the others can be trusted either —
      // upstream code will then fall back to checking the regex directly.
      if (!literal) return [];
      literals.push(literal.toLowerCase());
    }

    return literals.map((literal) => Hint.build(literal, source));
  }

  private static longestLiteral(alt: AST.Alternative): string | null {
    const runs: string[] = [];
    let current = "";

    const flush = () => {
      if (current.length >= this.MIN_LITERAL_LENGTH) runs.push(current);
      current = "";
    };

    const walk = (elements: readonly AST.Element[]) => {
      for (const el of elements) {
        switch (el.type) {
          case "Character":
            current += String.fromCodePoint(el.value);
            break;

          case "Quantifier":
            // "p?" (min: 0) → not guaranteed at all, drop it.
            if (el.min === 0) {
              flush();
            } else if (el.element.type === "Character") {
              // "x{3}" → append "xxx", run stays open (min === max).
              // "x+" / "x{2,5}" → append the guaranteed "x" copies, then
              // break: how many more follow is unknown, so whatever comes
              // next in the sequence isn't guaranteed adjacent to this run.
              current += String.fromCodePoint(el.element.value).repeat(el.min);
              if (el.max !== el.min) flush();
            } else {
              // "[a-z]{2,}", "(?:foo)+" → quantified, but not a plain char.
              flush();
            }
            break;

          case "CapturingGroup":
          case "Group":
            // "(?:foo)" → one alternative, no real branching, inline it.
            if (el.alternatives.length === 1) {
              walk(el.alternatives[0].elements);
            } else {
              // "(?:foo|bar)" → real branch, can't claim either side is
              // guaranteed, treat the whole group as opaque.
              flush();
            }
            break;

          case "Assertion":
            // "^", "$", "\b", "(?=foo)", "(?!foo)" → zero-width, consumes no
            // characters, so text on either side of it stays adjacent.
            // Its own (possibly negated) content is never extracted.
            break;

          case "CharacterClass": // "[a-z0-9]"
          case "CharacterSet": // "\d", "\s", "\w", "."
          case "Backreference": // "\1"
          default:
            flush();
            break;
        }
      }
    };

    walk(alt.elements);
    flush();

    if (runs.length === 0) return null;

    return runs.reduce((longest, run) =>
      run.length > longest.length ? run : longest,
    );
  }
}
