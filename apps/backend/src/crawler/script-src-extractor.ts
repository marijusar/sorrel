const SCRIPT_SRC_RE = /<script\b[^>]*\bsrc=["']([^"']+)["']/gi;

export class ScriptSrcExtractor {
  static extract(html: string): string[] {
    const srcs: string[] = [];
    for (const match of html.matchAll(SCRIPT_SRC_RE)) {
      if (match[1]) srcs.push(match[1]);
    }
    return srcs;
  }
}
