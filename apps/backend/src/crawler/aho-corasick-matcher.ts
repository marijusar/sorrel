import { AhoCorasick } from "@naoya_tatetsu/aho-corasick-ts";
import { AstLiteralExtractor } from "./ast-literal-extractor.ts";
import { ScriptSrcExtractor } from "./script-src-extractor.ts";
import { WappalyzerPattern } from "./wappalyzer-pattern.ts";
import type { TechnologyFingerprints } from "./technology-fingerprints.ts";
import type { DetectedTechnology, TechnologyDetector } from "./technology-matcher.ts";

type Signal = "html" | "scriptSrc";

interface Candidate {
  readonly name: string;
  readonly category: string | null;
  readonly signal: Signal;
  readonly pattern: string;
}

// Same two Wappalyzer signal types as TechnologyMatcher (html + scriptSrc),
// pre-screened with one Aho-Corasick pass instead of running every vendored
// regex against the page. A pattern AstLiteralExtractor can reduce to a
// guaranteed literal only gets its real regex run when that literal actually
// occurs; an opaque pattern (no guaranteed literal) always runs the regex
// directly, same as TechnologyMatcher.
//
// The vendored patterns never change at runtime, so the hint index (and the
// automaton built from it) is built once here, in the constructor, and
// reused for every match() call — not rebuilt per page.
export class AhoCorasickMatcher implements TechnologyDetector {
  private readonly searcher: AhoCorasick;
  private readonly owners: Candidate[];
  private readonly alwaysCheck: Candidate[];

  constructor(fingerprints: TechnologyFingerprints) {
    const literals: string[] = [];
    const owners: Candidate[] = [];
    const alwaysCheck: Candidate[] = [];

    for (const [name, tech] of fingerprints.technologies) {
      for (const [signal, patterns] of [
        ["html", tech.html],
        ["scriptSrc", tech.scriptSrc],
      ] as const) {
        for (const pattern of patterns) {
          const candidate: Candidate = { name, category: tech.category, signal, pattern };
          const stripped = WappalyzerPattern.stripMetadata(pattern);
          const hints = stripped ? AstLiteralExtractor.extractHints(stripped) : [];
          if (hints.length === 0) {
            alwaysCheck.push(candidate);
            continue;
          }
          for (const hint of hints) {
            literals.push(hint.literal);
            owners.push(candidate);
          }
        }
      }
    }

    this.searcher = new AhoCorasick(literals, { caseInsensitive: true });
    this.owners = owners;
    this.alwaysCheck = alwaysCheck;
  }

  match(html: string): DetectedTechnology[] {
    const scriptSrcs = ScriptSrcExtractor.extract(html);
    const matchedOwners = new Set(this.searcher.findAll(html).map((m) => this.owners[m.patternIndex]!));

    const matched = new Map<string, DetectedTechnology>();
    for (const candidate of [...matchedOwners, ...this.alwaysCheck]) {
      if (matched.has(candidate.name)) continue;

      const regex = WappalyzerPattern.toRegex(candidate.pattern);
      if (!regex) continue;

      const isMatch = candidate.signal === "html" ? regex.test(html) : scriptSrcs.some((src) => regex.test(src));
      if (isMatch) matched.set(candidate.name, { name: candidate.name, category: candidate.category });
    }

    return [...matched.values()];
  }
}
