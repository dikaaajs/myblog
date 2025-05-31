"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { blogPosts } from "@/lib/blog-data"
import { categories } from "@/lib/categories"

function getRandomPosts(count: number) {
  const shuffled = [...blogPosts].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function getCategoryName(slug: string) {
  const category = categories.find((cat) => cat.slug === slug)
  return category?.name || slug
}

export function BlogSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slides, setSlides] = useState(getRandomPosts(3))

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentIndex])

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-xl mb-12 group">
      {slides.map((post, index) => {
        const isActive = index === currentIndex

        return (
          <div
            key={post.id}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />

            <Image
              src={
                (post.content.find((item) => item.variant === "img")?.content as string) ||
                "/placeholder.svg?height=500&width=1000"
              }
              alt={post.title}
              fill
              className="object-cover"
              priority
            />

            <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10">
              <div className="flex flex-wrap gap-2 mb-3">
                {post.categories.map((category) => (
                  <Badge
                    key={category}
                    variant="outline"
                    className="bg-background/20 backdrop-blur-sm border-yellow-400/30 text-yellow-400"
                  >
                    {getCategoryName(category)}
                  </Badge>
                ))}
              </div>

              <h2 className="text-2xl md:text-4xl font-bold mb-2 text-white">{post.title}</h2>

              <p className="text-sm md:text-base text-gray-200 mb-4 max-w-2xl line-clamp-2">{post.excerpt}</p>

              <Link href={`/blog/${post.slug}`}>
                <Button variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-background">
                  Read Article
                </Button>
              </Link>
            </div>
          </div>
        )
      })}

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-background/20 backdrop-blur-sm border-yellow-400/30 text-white hover:bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-background/20 backdrop-blur-sm border-yellow-400/30 text-white hover:bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-yellow-400" : "bg-white/50"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
