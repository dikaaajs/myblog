import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { categories } from "@/lib/categories"

interface BlogBannerProps {
  title: string
  publishedAt: string
  blogCategories: string[]
  imageUrl?: string
}

function getCategoryName(slug: string) {
  const category = categories.find((cat) => cat.slug === slug)
  return category?.name || slug
}

export function BlogBanner({ title, publishedAt, blogCategories, imageUrl }: BlogBannerProps) {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] mb-8 overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/60 z-10" />

      <Image
        src={imageUrl || "/placeholder.svg?height=400&width=1200"}
        alt={title}
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-10">
        <div className="flex flex-wrap gap-2 mb-4">
          {blogCategories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="bg-background/20 backdrop-blur-sm border-yellow-400/30 text-yellow-400"
            >
              {getCategoryName(category)}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">{title}</h1>

        <p className="text-sm text-gray-300">
          Published on{" "}
          <span className="text-yellow-400">
            {new Date(publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </p>
      </div>
    </div>
  )
}
