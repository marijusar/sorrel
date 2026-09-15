import Image from "next/image";
import Link from "next/link";
import { Panel } from "@/components/marketing/panel";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Blog } from "@/lib/blog";

export const metadata = {
  title: "Blog — Sorrel",
  description: "Notes on competitor tracking, Shopify app churn, and reaching merchants at the right moment.",
};

export default async function BlogIndexPage() {
  const posts = await Blog.getAllPosts();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:py-22">
      <div className="flex flex-col items-center gap-2.5 text-center">
        <SectionHeading>Blog</SectionHeading>
        <p className="max-w-[600px] text-base leading-6.5 text-muted-foreground sm:text-[17px] sm:leading-7">
          Notes on competitor tracking, Shopify app churn, and reaching merchants at the right moment.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Panel className="flex h-full flex-col transition-shadow hover:shadow-[0_1px_2px_rgb(0_0_0/0.04),0_20px_48px_-12px_rgb(0_0_0/0.18)]">
              <Image
                width={1200}
                height={630}
                src={post.thumbnail}
                alt=""
                className="aspect-[1200/630] w-full object-cover"
              />
              <div className="flex flex-1 flex-col gap-2 p-5">
                <span className="text-[13px] text-muted-foreground">
                  {new Date(post.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                </span>
                <h2 className="font-heading text-lg leading-6 font-medium tracking-tight text-pretty">{post.title}</h2>
                <p className="text-[14px] leading-5.5 text-muted-foreground text-pretty">{post.description}</p>
              </div>
            </Panel>
          </Link>
        ))}
      </div>
    </div>
  );
}
