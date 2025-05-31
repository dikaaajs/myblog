"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { blogPosts } from "@/lib/blog-data";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const filteredPosts = blogPosts
    .filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredPosts.length > 0) {
      router.push(`/blog/${filteredPosts[0].slug}`);
      setSearchQuery("");
      setShowResults(false);
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-2">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Blog Logo"
            width={120}
            height={40}
            className="h-8 w-auto hidden sm:block"
            priority
          />
          <Image
            src="/logo-sm.png"
            alt="Blog Logo Small"
            width={40}
            height={40}
            className="h-8 w-auto sm:hidden"
            priority
          />
        </Link>

        <div className="relative w-full max-w-sm ml-auto">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blog titles..."
              className="pl-8 bg-background border-muted-foreground/20"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(e.target.value.length > 0);
              }}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              onFocus={() => setShowResults(searchQuery.length > 0)}
            />
          </form>

          {showResults && searchQuery.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-background border rounded-md shadow-lg z-50">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="block px-4 py-2 hover:bg-accent text-sm"
                    onClick={() => {
                      setSearchQuery("");
                      setShowResults(false);
                    }}
                  >
                    {post.title}
                  </Link>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  No results found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
