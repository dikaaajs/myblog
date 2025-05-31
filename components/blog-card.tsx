import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/lib/categories";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  banner: string;
  excerpt: string;
  publishedAt: string;
  categories: string[];
  content: Array<{
    variant: string;
    content: string | string[];
    alt?: string;
  }>;
}

interface BlogCardProps {
  post: BlogPost;
}

function getFirstHeading(
  content: Array<{ variant: string; content: string | string[] }>
) {
  const heading = content.find(
    (item) => item.variant === "h2" || item.variant === "h3"
  );
  return (heading?.content as string) || "";
}

function getContentPreview(
  content: Array<{ variant: string; content: string | string[] }>
) {
  const paragraph = content.find((item) => item.variant === "p");
  const text = (paragraph?.content as string) || "";
  return text.length > 120 ? text.substring(0, 120) + "..." : text;
}

function getCategoryNames(categoryIds: string[]) {
  return categoryIds.map((id) => {
    const category = categories.find((cat) => cat.slug === id);
    return category?.name || id;
  });
}

function getImageUrl(
  content: Array<{ variant: string; content: string | string[]; alt?: string }>
) {
  const image = content.find((item) => item.variant === "img");
  return (image?.content as string) || "/placeholder.svg?height=200&width=400";
}

export function BlogCard({ post }: BlogCardProps) {
  const firstHeading = getFirstHeading(post.content);
  const contentPreview = getContentPreview(post.content);
  const categoryNames = getCategoryNames(post.categories);
  const imageUrl = getImageUrl(post.content);

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group border-gray-800 bg-gray-900/50">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <img
            src={post.banner || "/placeholder.svg"}
            alt={post.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
        </div>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap gap-1 mb-2">
            {categoryNames.map((categoryName, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs border-yellow-400/30 text-yellow-400"
              >
                {categoryName}
              </Badge>
            ))}
          </div>
          <CardTitle className="line-clamp-2 group-hover:text-yellow-400 transition-colors text-white">
            {post.title}
          </CardTitle>
          {firstHeading && (
            <CardDescription className="font-medium text-gray-300">
              {firstHeading}
            </CardDescription>
          )}
          <CardDescription className="text-sm text-gray-400">
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 line-clamp-3 text-sm leading-relaxed">
            {contentPreview}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
