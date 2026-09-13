import { AhoCorasickMatcher } from "#src/crawler/aho-corasick-matcher";
import { HttpPageFetcher } from "#src/crawler/page-fetcher";
import { TechnologyFingerprints } from "#src/crawler/technology-fingerprints";
import pino from "pino";

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
const matcher = new AhoCorasickMatcher(fingerprints);

console.time("matching (aho-corasick)");
const detected = matcher.match(html);
console.timeEnd("matching (aho-corasick)");

console.log("detected:", detected);
