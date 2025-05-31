"use client"

import { useState, useMemo } from "react"
import { blogPosts } from "@/lib/blog-data"
import { categories } from "@/lib/categories"
import { CategoryFilter } from "@/components/category-filter"
import { BlogCard } from "@/components/blog-card"
import { BlogSlideshow } from "@/components/blog-slideshow"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "all") {
      return blogPosts
    }
    return blogPosts.filter((post) => post.categories.includes(selectedCategory))
  }, [selectedCategory])

  const postCounts = useMemo(() => {
    const counts: Record<string, number> = {}

    // Count all posts
    counts.all = blogPosts.length

    // Count posts by category
    categories.forEach((category) => {
      if (category.slug !== "all") {
        counts[category.slug] = blogPosts.filter((post) => post.categories.includes(category.slug)).length
      }
    })

    return counts
  }, [])

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">Tech Blog</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover the latest in technology, reviews, and buying guides
          </p>
        </header>

        <BlogSlideshow />

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          postCounts={postCounts}
        />

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No posts found in this category.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
