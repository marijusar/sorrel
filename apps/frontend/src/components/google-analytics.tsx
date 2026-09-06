import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";

const GA_ID = "G-44T5ZYZNX7";

export function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production") return null;
  return <NextGoogleAnalytics gaId={GA_ID} />;
}
