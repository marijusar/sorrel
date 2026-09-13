import { AhoCorasickMatcher } from "#src/crawler/aho-corasick-matcher";
import { HttpPageFetcher } from "#src/crawler/page-fetcher";
import { Re2SetMatcher } from "#src/crawler/re2-set-matcher";
import { TechnologyFingerprints } from "#src/crawler/technology-fingerprints";
import { TechnologyMatcher } from "#src/crawler/technology-matcher";
import pino from "pino";

console.time("script");
const logger = pino();
const fetcher = new HttpPageFetcher(logger);
console.time("fetching");
const page = await fetcher.fetch("https://thebioma.com");
console.timeEnd("fetching");

if (!page) {
  throw new Error("Failed to fetch page.");
}

const { html } = page;

const fingerprints = await TechnologyFingerprints.load();
const matcher = new TechnologyMatcher(fingerprints);
const ahoMatcher = new AhoCorasickMatcher(fingerprints);
const re2Matcher = new Re2SetMatcher(fingerprints);

console.time("matching (regex)");
const detected = matcher.match(html);
console.timeEnd("matching (regex)");

console.time("matching (aho-corasick, cold)");
const detectedAho = ahoMatcher.match(html);
console.timeEnd("matching (aho-corasick, cold)");

console.time("matching (aho-corasick, warm)");
ahoMatcher.match(html);
console.timeEnd("matching (aho-corasick, warm)");

console.time("matching (re2-set, cold)");
const detectedRe2 = await re2Matcher.match(html);
console.timeEnd("matching (re2-set, cold)");

console.time("matching (re2-set, warm)");
await re2Matcher.match(html);
console.timeEnd("matching (re2-set, warm)");

console.timeEnd("script");

const names = (list: typeof detected) => new Set(list.map((t) => t.name));
const regexNames = names(detected);
const ahoNames = names(detectedAho);
const re2Names = names(detectedRe2);
const onlyInRegex = [...regexNames].filter((n) => !ahoNames.has(n));
const onlyInAho = [...ahoNames].filter((n) => !regexNames.has(n));
const onlyInRegexVsRe2 = [...regexNames].filter((n) => !re2Names.has(n));
const onlyInRe2 = [...re2Names].filter((n) => !regexNames.has(n));

console.log("regex matches:", regexNames.size, "aho matches:", ahoNames.size, "re2 matches:", re2Names.size);
if (onlyInRegex.length || onlyInAho.length) {
  console.log("AHO MISMATCH — only in regex:", onlyInRegex, "only in aho:", onlyInAho);
} else {
  console.log("aho results match exactly");
}
if (onlyInRegexVsRe2.length || onlyInRe2.length) {
  console.log("RE2 MISMATCH — only in regex:", onlyInRegexVsRe2, "only in re2:", onlyInRe2);
} else {
  console.log("re2 results match exactly");
}
