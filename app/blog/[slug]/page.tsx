"use client";

import { useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/blog-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BlogBanner } from "@/components/blog-banner";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

function renderContent(item: any, index: number) {
  const { variant, content, href, alt } = item;
  switch (variant) {
    case "h1":
      return (
        <h1
          key={index}
          className="text-4xl font-bold tracking-tight mb-6 text-white"
        >
          {content}
        </h1>
      );
    case "h2":
      return (
        <h2 key={index} className="text-2xl font-semibold mt-8 mb-4 text-white">
          {content}
        </h2>
      );
    case "h3":
      return (
        <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-white">
          {content}
        </h3>
      );
    case "p":
      return (
        <p key={index} className="text-gray-300 leading-7 mb-4">
          {content}
        </p>
      );
    case "img":
      return (
        <div key={index} className="my-8">
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
        <div key={index} className="mb-4">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-yellow-500 text-background rounded-md hover:bg-yellow-600 transition-colors"
          >
            {content}
          </a>
        </div>
      );
    case "ul":
      return (
        <ul
          key={index}
          className="list-disc list-inside space-y-2 mb-6 text-gray-300"
        >
          {content.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol
          key={index}
          className="list-decimal list-inside space-y-2 mb-6 text-gray-300"
        >
          {content.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );
    default:
      return null;
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post: any = blogPosts.find((p: any) => p.slug === params.slug);
  const router = useRouter();

  useEffect(() => {
    if (!post) {
      notFound();
    }
  }, [post]);

  if (!post) {
    return null;
  }

  return (
    <div>
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
              .map((item: any, index: any) => renderContent(item, index))}
          </article>
        </div>
      </div>
    </div>
  );
}
