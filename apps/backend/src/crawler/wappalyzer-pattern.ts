// Wappalyzer pattern strings look like `<regex>\;confidence:50\;version:\1` —
// shared parsing for the regex-source part, used by every matcher that reads
// the vendored technology fingerprints.
export class WappalyzerPattern {
  static toRegex(raw: string): RegExp | null {
    const patternPart = WappalyzerPattern.stripMetadata(raw);
    if (!patternPart) return null;

    try {
      return new RegExp(patternPart, "i");
    } catch {
      return null; // malformed regex in vendored data
    }
  }

  // Strip everything after the first `\;` (metadata we're ignoring for now).
  static stripMetadata(raw: string): string | null {
    const [patternPart] = raw.split("\\;");
    return patternPart ?? null;
  }
}
