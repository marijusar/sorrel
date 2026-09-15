import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { CtaSection } from "@/components/marketing/cta-section";
import { Blog } from "@/lib/blog";
import { Metadata } from "next";
import Image from "next/image";

export async function generateStaticParams() {
  const slugs = await Blog.getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await Blog.getPostBySlug(slug);
  if (!post) return {};

  return { title: `${post.title} — Sorrel`, description: post.description };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await Blog.getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="flex flex-col">
      <article className="mx-auto w-full max-w-[720px] px-6 pt-14 pb-4 sm:pt-22 sm:pb-6">
        <div className="flex flex-col gap-3">
          <span className="text-[13px] text-muted-foreground">
            {new Date(post.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <h1 className="font-heading text-[32px] leading-[1.15] font-medium tracking-tight text-balance sm:text-[42px]">
            {post.title}
          </h1>
        </div>

        <Image
          width={1200}
          height={630}
          src={post.thumbnail}
          alt=""
          className="mt-8 aspect-[1200/630] w-full rounded-[18px] object-cover ring-1 ring-foreground/[0.08]"
        />

        <div className="prose-blog mt-10">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <p className="mt-10 text-[13px] text-muted-foreground">
          Photo by{" "}
          <a
            href={`${post.photoCredit.profileUrl}?utm_source=sorrel&utm_medium=referral`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            {post.photoCredit.name}
          </a>{" "}
          on{" "}
          <a
            href="https://unsplash.com/?utm_source=sorrel&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Unsplash
          </a>
        </p>
      </article>

      <CtaSection />
    </div>
  );
}
