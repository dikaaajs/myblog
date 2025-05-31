// app/blog/[slug]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/blog-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBasket } from "lucide-react";
import { BlogBanner } from "@/components/blog-banner";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.banner],
      url: `https://your-domain.com/blog/${post.slug}`,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const renderContent = (item: any, index: number) => {
    const { variant, content, href, alt } = item;
    switch (variant) {
      case "h1":
        return (
          <h1
            key={`post-${index}`}
            className="text-4xl font-bold mb-6 text-white"
          >
            {content}
          </h1>
        );
      case "h2":
        return (
          <h2
            key={`post-${index}`}
            className="text-2xl font-semibold mt-8 mb-4 text-white"
          >
            {content}
          </h2>
        );
      case "p":
        return (
          <p key={`post-${index}`} className="text-gray-300 leading-7 mb-4">
            {content}
          </p>
        );
      case "img":
        return (
          <div key={`post-${index}`} className="my-8">
            <Image
              src={content || "/placeholder.svg"}
              alt={alt || "Blog image"}
              width={700}
              height={300}
              className="rounded-lg object-cover mx-auto"
            />
          </div>
        );
      case "a":
        return (
          <Button asChild variant={"secondary"} key={`post-${index}`}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="decoration-transparent"
            >
              <ShoppingBasket />
              {content}
            </a>
          </Button>
        );
      case "ul":
        return (
          <ul key={`post-${index}`} className="list-disc pl-6 mb-4">
            {item.children &&
              item.children.map((child: any, childIdx: number) =>
                child.variant === "li" ? (
                  <li key={`post-${index}-li-${childIdx}`}>{child.content}</li>
                ) : null
              )}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              className="mb-4 text-yellow-400 hover:text-yellow-500 hover:bg-background/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        <BlogBanner
          title={post.title}
          publishedAt={post.publishedAt}
          blogCategories={post.categories}
          imageUrl={post.banner}
        />

        <article className="prose prose-invert max-w-none">
          {post.content
            .filter((item: any) => item.variant !== "h1")
            .map(renderContent)}
        </article>
      </div>
    </div>
  );
}
