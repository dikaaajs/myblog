// app/sitemap.xml/route.ts
import { blogPosts } from "@/lib/blog-data";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://acme.com";
  const routes = [
    "", // homepage
    ...blogPosts.map((post) => `blog/${post.slug}`),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(
      (route) => `
    <url>
      <loc>${baseUrl}/${route}</loc>
    </url>`
    )
    .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
