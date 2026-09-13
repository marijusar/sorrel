import { z } from "zod";
import { ScriptSrcExtractor } from "./script-src-extractor.ts";
import { WappalyzerPattern } from "./wappalyzer-pattern.ts";
import type { TechnologyFingerprints } from "./technology-fingerprints.ts";

export const detectedTechnologySchema = z.object({
  name: z.string(),
  category: z.string().nullable(),
});

export type DetectedTechnology = z.infer<typeof detectedTechnologySchema>;

export interface TechnologyDetector {
  match(html: string): DetectedTechnology[];
}

// Matches a crawled page's raw HTML against two Wappalyzer signal types:
// `html` (regex against the full HTML text) and `scriptSrc` (regex against
// each <script src> attribute). Deliberately scoped to just these two —
// headers/meta/cookies/dom are a different, much more expensive class of
// check (dom matching alone runs ~650-900ms/page against the full vendored
// technology set) and are out of scope here. Confidence/version metadata
// embedded in the vendored patterns is also ignored for now — presence is
// all we report.
export class TechnologyMatcher implements TechnologyDetector {
  constructor(private readonly fingerprints: TechnologyFingerprints) {}

  match(html: string): DetectedTechnology[] {
    const scriptSrcs = ScriptSrcExtractor.extract(html);

    const results: DetectedTechnology[] = [];
    for (const [name, tech] of this.fingerprints.technologies) {
      const isMatch =
        this.matchesAny(tech.html, [html]) || this.matchesAny(tech.scriptSrc, scriptSrcs);
      if (!isMatch) continue;

      results.push({ name, category: tech.category });
    }

    return results;
  }

  private matchesAny(patterns: string[], values: string[]): boolean {
    for (const pattern of patterns) {
      const regex = WappalyzerPattern.toRegex(pattern);
      if (!regex) continue;
      if (values.some((value) => regex.test(value))) return true;
    }

    return false;
  }
}
