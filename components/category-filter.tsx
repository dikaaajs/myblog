"use client"

import { categories } from "@/lib/categories"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  postCounts: Record<string, number>
}

export function CategoryFilter({ selectedCategory, onCategoryChange, postCounts }: CategoryFilterProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 text-white">Filter by Category</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.slug
          const count = postCounts[category.slug] || 0

          return (
            <Button
              key={category.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.slug)}
              className={`flex items-center gap-2 ${
                isSelected
                  ? "bg-yellow-500 hover:bg-yellow-600 text-background"
                  : "border-yellow-400/30 text-gray-300 hover:text-yellow-400 hover:border-yellow-400/50"
              }`}
            >
              {category.name}
              <Badge
                variant="secondary"
                className={`text-xs ${isSelected ? "bg-background/20 text-background" : "bg-background/20 text-yellow-400"}`}
              >
                {count}
              </Badge>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
