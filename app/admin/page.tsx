"use client";

import { useState } from "react";
import { blogPosts } from "@/lib/blog-data";
import { categories } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Eye, Save, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  categories: string[];
  banner: string;
  content: Array<{
    variant: string;
    content: string | string[];
    alt?: string;
    href?: string;
  }>;
}

interface ContentItem {
  variant: string;
  content: string | string[];
  alt?: string;
  href?: string;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    slug: "",
    banner: "",
    categories: [] as string[],
    content: [] as ContentItem[],
  });

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      slug: "",
      banner: "",
      categories: [],
      content: [],
    });
    setEditingPost(null);
    setIsCreating(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const startCreating = () => {
    resetForm();
    setIsCreating(true);
  };

  const startEditing = (post: BlogPost) => {
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      slug: post.slug,
      banner: post.banner,
      categories: post.categories,
      content: post.content,
    });
    setEditingPost(post);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (!formData.title || !formData.excerpt) {
      alert("Please fill in all required fields");
      return;
    }

    const newPost: BlogPost = {
      id: editingPost?.id || Math.max(...posts.map((p) => p.id)) + 1,
      slug: formData.slug,
      title: formData.title,
      excerpt: formData.excerpt,
      publishedAt:
        editingPost?.publishedAt || new Date().toISOString().split("T")[0],
      categories: formData.categories,
      banner: formData.banner,
      content: formData.content,
    };

    if (editingPost) {
      setPosts((prev) =>
        prev.map((p) => (p.id === editingPost.id ? newPost : p))
      );
    } else {
      setPosts((prev) => [...prev, newPost]);
    }

    resetForm();
    alert(
      editingPost ? "Post updated successfully!" : "Post created successfully!"
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      alert("Post deleted successfully!");
    }
  };

  const addContentItem = (variant: string) => {
    const newItem: ContentItem = {
      variant,
      content: variant === "ul" || variant === "ol" ? [] : "",
    };
    setFormData((prev) => ({
      ...prev,
      content: [...prev.content, newItem],
    }));
  };

  const updateContentItem = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeContentItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
  };

  const handleCategoryToggle = (categorySlug: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(categorySlug)
        ? prev.categories.filter((c) => c !== categorySlug)
        : [...prev.categories, categorySlug],
    }));
  };

  const renderContentEditor = (item: ContentItem, index: number) => {
    switch (item.variant) {
      case "ul":
      case "ol":
        return (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>
                {item.variant === "ul" ? "Bullet List" : "Numbered List"}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeContentItem(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              placeholder="Enter list items (one per line)"
              value={Array.isArray(item.content) ? item.content.join("\n") : ""}
              onChange={(e) =>
                updateContentItem(
                  index,
                  "content",
                  e.target.value.split("\n").filter((line) => line.trim())
                )
              }
              className="min-h-[100px]"
            />
          </div>
        );
      case "img":
        return (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Image</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeContentItem(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder="Image URL"
              value={item.content as string}
              onChange={(e) =>
                updateContentItem(index, "content", e.target.value)
              }
            />
            <Input
              placeholder="Alt text (optional)"
              value={item.alt || ""}
              onChange={(e) => updateContentItem(index, "alt", e.target.value)}
            />
          </div>
        );
      case "a":
        return (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Link</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeContentItem(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder="Link text"
              value={item.content as string}
              onChange={(e) =>
                updateContentItem(index, "content", e.target.value)
              }
            />
            <Input
              placeholder="URL"
              value={item.href || ""}
              onChange={(e) => updateContentItem(index, "href", e.target.value)}
            />
          </div>
        );
      default:
        return (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>
                {item.variant === "h1" && "Heading 1"}
                {item.variant === "h2" && "Heading 2"}
                {item.variant === "h3" && "Heading 3"}
                {item.variant === "p" && "Paragraph"}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeContentItem(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              placeholder={`Enter ${item.variant} content`}
              value={item.content as string}
              onChange={(e) =>
                updateContentItem(index, "content", e.target.value)
              }
              className={item.variant === "p" ? "min-h-[100px]" : ""}
            />
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 dark">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Blog Admin</h1>
            <p className="text-gray-400">Manage your blog posts and content</p>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </Button>
            </Link>
            <Button onClick={startCreating}>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">Manage Posts</TabsTrigger>
            <TabsTrigger value="editor">
              {isCreating
                ? "Create Post"
                : editingPost
                ? "Edit Post"
                : "Post Editor"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <div className="grid gap-4">
              {posts.map((post) => (
                <Card key={post.id} className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-white">
                          {post.title}
                        </CardTitle>
                        <CardDescription>{post.excerpt}</CardDescription>
                        <div className="flex flex-wrap gap-1">
                          {post.categories.map((category) => (
                            <Badge
                              key={category}
                              variant="outline"
                              className="text-xs"
                            >
                              {categories.find((c) => c.slug === category)
                                ?.name || category}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-400">
                          Published:{" "}
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPreviewPost(post)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{previewPost?.title}</DialogTitle>
                              <DialogDescription>
                                Preview of blog post
                              </DialogDescription>
                            </DialogHeader>
                            <div className="prose prose-invert max-w-none">
                              {previewPost?.content.map((item, index) => {
                                switch (item.variant) {
                                  case "h1":
                                    return (
                                      <h1
                                        key={index}
                                        className="text-2xl font-bold text-white"
                                      >
                                        {item.content}
                                      </h1>
                                    );
                                  case "h2":
                                    return (
                                      <h2
                                        key={index}
                                        className="text-xl font-semibold text-white"
                                      >
                                        {item.content}
                                      </h2>
                                    );
                                  case "h3":
                                    return (
                                      <h3
                                        key={index}
                                        className="text-lg font-medium text-white"
                                      >
                                        {item.content}
                                      </h3>
                                    );
                                  case "p":
                                    return (
                                      <p key={index} className="text-gray-300">
                                        {item.content}
                                      </p>
                                    );
                                  case "img":
                                    return (
                                      <img
                                        key={index}
                                        src={
                                          (item.content as string) ||
                                          "/placeholder.svg"
                                        }
                                        alt={item.alt}
                                        className="rounded-lg"
                                      />
                                    );
                                  case "ul":
                                    return (
                                      <ul
                                        key={index}
                                        className="list-disc list-inside text-gray-300"
                                      >
                                        {(item.content as string[]).map(
                                          (li, i) => (
                                            <li key={i}>{li}</li>
                                          )
                                        )}
                                      </ul>
                                    );
                                  case "ol":
                                    return (
                                      <ol
                                        key={index}
                                        className="list-decimal list-inside text-gray-300"
                                      >
                                        {(item.content as string[]).map(
                                          (li, i) => (
                                            <li key={i}>{li}</li>
                                          )
                                        )}
                                      </ol>
                                    );
                                  case "a":
                                    return (
                                      <a
                                        key={index}
                                        href={item.href}
                                        className="text-yellow-400 hover:text-yellow-300"
                                      >
                                        {item.content}
                                      </a>
                                    );
                                  default:
                                    return null;
                                }
                              })}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditing(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            {isCreating || editingPost ? (
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-white">
                    {editingPost ? "Edit Post" : "Create New Post"}
                  </CardTitle>
                  <CardDescription>
                    {editingPost
                      ? "Update your blog post"
                      : "Create a new blog post"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Enter post title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            slug: e.target.value,
                          }))
                        }
                        placeholder="post-slug"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt *</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          excerpt: e.target.value,
                        }))
                      }
                      placeholder="Brief description of the post"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="banner">Banner Image URL</Label>
                    <Input
                      id="banner"
                      value={formData.banner}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          banner: e.target.value,
                        }))
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* Categories */}
                  <div className="space-y-2">
                    <Label>Categories</Label>
                    <div className="flex flex-wrap gap-2">
                      {categories
                        .filter((c) => c.slug !== "all")
                        .map((category) => (
                          <div
                            key={category.slug}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={category.slug}
                              checked={formData.categories.includes(
                                category.slug
                              )}
                              onCheckedChange={() =>
                                handleCategoryToggle(category.slug)
                              }
                            />
                            <Label htmlFor={category.slug} className="text-sm">
                              {category.name}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Content Editor */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Content</Label>
                      <div className="flex gap-2">
                        <Select onValueChange={addContentItem}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Add content" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="h1">Heading 1</SelectItem>
                            <SelectItem value="h2">Heading 2</SelectItem>
                            <SelectItem value="h3">Heading 3</SelectItem>
                            <SelectItem value="p">Paragraph</SelectItem>
                            <SelectItem value="img">Image</SelectItem>
                            <SelectItem value="ul">Bullet List</SelectItem>
                            <SelectItem value="ol">Numbered List</SelectItem>
                            <SelectItem value="a">Link</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {formData.content.map((item, index) =>
                        renderContentEditor(item, index)
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      {editingPost ? "Update Post" : "Create Post"}
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <h3 className="text-lg font-medium text-white mb-2">
                    No Post Selected
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Select a post to edit or create a new one
                  </p>
                  <Button onClick={startCreating}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Post
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
