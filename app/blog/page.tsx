"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  User,
  ArrowRight,
  Heart,
  Users,
  BookOpen,
  MessageCircle,
  Target,
  Globe
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Questions to Ask Before Marriage",
      excerpt: "Discover the important conversations every couple should have before taking the next step in their relationship.",
      category: "Relationship Advice",
      date: "January 15, 2024",
      author: "Dr. Sarah Ahmed",
      readTime: "5 min read",
      image: "/wedding-couple-hero-1.jpg"
    },
    {
      id: 2,
      title: "Understanding Cultural Compatibility in Marriage",
      excerpt: "Learn how to navigate cultural differences and find harmony in intercultural relationships.",
      category: "Cultural Insights",
      date: "January 12, 2024",
      author: "Fatima Khan",
      readTime: "7 min read",
      image: "/wedding-couple-hero-2.jpg"
    },
    {
      id: 3,
      title: "Creating the Perfect Matrimonial Profile",
      excerpt: "Tips and tricks to make your profile stand out and attract the right matches.",
      category: "Profile Tips",
      date: "January 10, 2024",
      author: "Ahmed Ali",
      readTime: "4 min read",
      image: "/wedding-couple-hero-3.jpg"
    },
    {
      id: 4,
      title: "Financial Planning for Newlyweds",
      excerpt: "Essential financial advice for couples starting their journey together.",
      category: "Financial Advice",
      date: "January 8, 2024",
      author: "Zara Malik",
      readTime: "6 min read",
      image: "/wedding-couple-hero-4.jpg"
    },
    {
      id: 5,
      title: "The Importance of Family Involvement in Marriage",
      excerpt: "Understanding the role of families in Pakistani matrimonial traditions and modern relationships.",
      category: "Family & Traditions",
      date: "January 5, 2024",
      author: "Dr. Hassan Sheikh",
      readTime: "8 min read",
      image: "/wedding-couple-hero-1.jpg"
    },
    {
      id: 6,
      title: "Long Distance Relationships: Making It Work",
      excerpt: "Practical advice for maintaining strong connections across distances during the courtship period.",
      category: "Relationship Advice",
      date: "January 3, 2024",
      author: "Ayesha Rahman",
      readTime: "5 min read",
      image: "/wedding-couple-hero-2.jpg"
    }
  ]

  const categories = [
    { name: "All Posts", count: 24 },
    { name: "Relationship Advice", count: 8 },
    { name: "Cultural Insights", count: 6 },
    { name: "Profile Tips", count: 4 },
    { name: "Financial Advice", count: 3 },
    { name: "Family & Traditions", count: 3 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar-50 via-white to-humsafar-100">
      <Header />

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="relative overflow-hidden bg-humsafar-500 rounded-3xl mb-16 py-20 px-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <BookOpen className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Latest Articles & Tips</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Blog
              <span className="block text-white/60">
                Insights & Advice
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Expert guidance, relationship advice, and cultural insights to help you navigate your matrimonial journey with confidence.
            </p>
          </div>
        </div>

        {/* Blog Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Main Content */}
              <div className="lg:w-2/3">
                <div className="grid gap-8">
                  {blogPosts.map((post) => (
                    <Card key={post.id} className="border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                        <div className="md:w-2/3">
                          <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="bg-humsafar-100 text-humsafar-800">
                                {post.category}
                              </Badge>
                              <span className="text-sm text-gray-500">{post.readTime}</span>
                            </div>
                            <CardTitle className="text-xl md:text-2xl text-gray-900 hover:text-humsafar-600 transition-colors">
                              <Link href={`/blog/${post.id}`}>
                                {post.title}
                              </Link>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-gray-600 mb-4">
                              {post.excerpt}
                            </CardDescription>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-gray-500">
                                <User className="w-4 h-4 mr-1" />
                                <span className="mr-4">{post.author}</span>
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>{post.date}</span>
                              </div>
                              <Link href={`/blog/${post.id}`}>
                                <Button variant="ghost" size="sm" className="text-humsafar-600 hover:text-humsafar-700">
                                  Read More
                                  <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-12">
                  <div className="flex gap-2">
                    <Button variant="outline" disabled>
                      Previous
                    </Button>
                    <Button className="bg-humsafar-600 hover:bg-humsafar-700 text-white">
                      1
                    </Button>
                    <Button variant="outline">
                      2
                    </Button>
                    <Button variant="outline">
                      3
                    </Button>
                    <Button variant="outline">
                      Next
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:w-1/3">
                <div className="space-y-8">
                  {/* Categories */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-900">Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                            <Link href={`/blog/category/${category.name.toLowerCase().replace(' ', '-')}`} className="text-gray-600 hover:text-humsafar-600 transition-colors">
                              {category.name}
                            </Link>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                              {category.count}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Popular Posts */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-900">Popular Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {blogPosts.slice(0, 3).map((post) => (
                          <div key={post.id} className="flex gap-3">
                            <img 
                              src={post.image} 
                              alt={post.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <Link href={`/blog/${post.id}`} className="text-sm font-medium text-gray-900 hover:text-humsafar-600 transition-colors line-clamp-2">
                                {post.title}
                              </Link>
                              <p className="text-xs text-gray-500 mt-1">{post.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Newsletter Signup */}
                  <Card className="bg-humsafar-50 border-humsafar-200">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-900 flex items-center">
                        <MessageCircle className="w-5 h-5 mr-2 text-humsafar-600" />
                        Stay Updated
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Subscribe to our newsletter for the latest matrimonial advice and tips.
                      </p>
                      <div className="space-y-3">
                        <input 
                          type="email" 
                          placeholder="Enter your email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-humsafar-500"
                        />
                        <Button className="w-full bg-humsafar-600 hover:bg-humsafar-700 text-white">
                          Subscribe
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}