import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const contentDir = path.join(process.cwd(), "content", "blog");

const blogFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  thumbnail: z.string(),
  photoCredit: z.object({
    name: z.string(),
    profileUrl: z.string(),
  }),
});

export type BlogPost = z.infer<typeof blogFrontmatterSchema> & {
  slug: string;
  content: string;
};

export class Blog {
  static async getAllPosts(): Promise<BlogPost[]> {
    const slugs = await Blog.getAllSlugs();
    const posts = await Promise.all(
      slugs.map((slug) => Blog.getPostBySlug(slug)),
    );
    return posts
      .filter((post) => post !== null)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  static async getAllSlugs(): Promise<string[]> {
    const files = await fs.readdir(contentDir);
    return files
      .filter((file) => file.endsWith(".md"))
      .map((file) => file.replace(/\.md$/, ""));
  }

  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const raw = await fs.readFile(path.join(contentDir, `${slug}.md`), "utf-8").catch(() => null);
    if (raw === null) return null;

    const { data, content } = matter(raw);
    const frontmatter = blogFrontmatterSchema.parse(data);

    return { ...frontmatter, slug, content };
  }
}
