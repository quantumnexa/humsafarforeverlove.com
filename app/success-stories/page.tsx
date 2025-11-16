import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Calendar, MapPin, Quote, Star, Share2, ThumbsUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { StructuredData, generateArticleSchema, generateBreadcrumbSchema } from "@/components/seo/structured-data"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Success Stories - Real Pakistani Couples | Humsafar Forever Love',
  description: 'Read inspiring success stories of Pakistani couples who found their perfect match through Humsafar Forever Love. Real testimonials from happy married couples.',
  keywords: 'Pakistani success stories, matrimonial success, happy couples, marriage testimonials, Pakistani weddings, love stories',
  openGraph: {
    title: 'Success Stories - Real Pakistani Couples | Humsafar Forever Love',
    description: 'Read inspiring success stories of Pakistani couples who found their perfect match through Humsafar Forever Love.',
    type: 'website',
    images: [{
      url: '/wedding-couple-hero-1.jpg',
      width: 1200,
      height: 630,
      alt: 'Happy Pakistani couples success stories'
    }]
  },
  alternates: {
    canonical: 'https://humsafarforeverlove.com/success-stories'
  }
}

export default function SuccessStoriesPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://humsafarforeverlove.com' },
    { name: 'Success Stories', url: 'https://humsafarforeverlove.com/success-stories' }
  ];

  const articleSchema = generateArticleSchema({
    title: 'Success Stories - Real Pakistani Couples',
    description: 'Inspiring success stories of Pakistani couples who found their perfect match through Humsafar Forever Love matrimonial service.',
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString(),
    image: 'https://humsafarforeverlove.com/wedding-couple-hero-1.jpg'
  });
  const successStories = [
    {
      id: 1,
      couple: {
        bride: "Ayesha Khan",
        groom: "Ahmed Hassan",
        brideAge: 26,
        groomAge: 29,
        brideCity: "Karachi",
        groomCity: "Karachi",
        brideImage: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=150&h=150&fit=crop&crop=face",
        groomImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
      weddingDate: "December 15, 2023",
      story:
        "We met through Humsafar.pk in January 2023. What started as a simple conversation about our shared love for technology and travel quickly blossomed into something beautiful. Ahmed's sense of humor and Ayesha's kindness made us realize we were perfect for each other. After 8 months of getting to know each other and our families, we tied the knot in a beautiful ceremony in Karachi.",
      testimonial:
        "Humsafar.pk made our dream come true. The platform's compatibility matching helped us find each other among thousands of profiles. We're grateful for this wonderful journey!",
      likes: 234,
      featured: true,
      tags: ["Love Marriage", "Same City", "Tech Couple"],
    },
    {
      id: 2,
      couple: {
        bride: "Fatima Ali",
        groom: "Omar Sheikh",
        brideAge: 24,
        groomAge: 27,
        brideCity: "Lahore",
        groomCity: "Islamabad",
        brideImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        groomImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
      weddingDate: "October 22, 2023",
      story:
        "Distance couldn't keep us apart! Omar was in Islamabad while I was in Lahore, but Humsafar.pk's detailed profiles helped us connect on a deeper level. We spent months video calling, sharing our dreams, and planning our future together. Our families met, and everyone could see how perfect we were for each other.",
      testimonial:
        "The verification system on Humsafar.pk gave us confidence that we were talking to genuine people. It made the whole process safe and trustworthy.",
      likes: 189,
      featured: false,
      tags: ["Long Distance", "Family Approved", "Doctor Couple"],
    },
    {
      id: 3,
      couple: {
        bride: "Zara Malik",
        groom: "Hassan Raza",
        brideAge: 28,
        groomAge: 31,
        brideCity: "Faisalabad",
        groomCity: "Multan",
        brideImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        groomImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      },
      weddingDate: "September 8, 2023",
      story:
        "As working professionals, we both had specific requirements for our life partners. Humsafar.pk's advanced filters helped us find exactly what we were looking for. Hassan's dedication to his career and family values aligned perfectly with my own. Our first meeting felt like we had known each other for years!",
      testimonial:
        "The detailed profiles and preference matching on Humsafar.pk saved us so much time. We found our perfect match without having to go through hundreds of incompatible profiles.",
      likes: 156,
      featured: true,
      tags: ["Professional Match", "Career Focused", "Perfect Timing"],
    },
    {
      id: 4,
      couple: {
        bride: "Sana Ahmed",
        groom: "Ali Khan",
        brideAge: 25,
        groomAge: 28,
        brideCity: "Peshawar",
        groomCity: "Peshawar",
        brideImage: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
        groomImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      },
      weddingDate: "November 30, 2023",
      story:
        "We were both a bit skeptical about online matrimonial platforms, but our friends convinced us to try Humsafar.pk. The first conversation we had lasted for hours! We discovered we had so much in common - from our love for books to our dreams of traveling the world together. Six months later, we were engaged!",
      testimonial:
        "Humsafar.pk's user-friendly interface and genuine profiles made our search so much easier. We recommend it to all our single friends!",
      likes: 203,
      featured: false,
      tags: ["Book Lovers", "Travel Enthusiasts", "Quick Connection"],
    },
    {
      id: 5,
      couple: {
        bride: "Amna Hassan",
        groom: "Bilal Sheikh",
        brideAge: 27,
        groomAge: 30,
        brideCity: "Sialkot",
        groomCity: "Gujranwala",
        brideImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
        groomImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      },
      weddingDate: "August 18, 2023",
      story:
        "After several unsuccessful attempts at finding the right person, we had almost given up hope. Then we found each other on Humsafar.pk! What attracted us to each other was our shared values and similar family backgrounds. Our families clicked instantly, and we knew this was meant to be.",
      testimonial:
        "Sometimes the best things come when you least expect them. Humsafar.pk brought us together at the perfect time in our lives.",
      likes: 167,
      featured: false,
      tags: ["Second Chance", "Family Values", "Destiny"],
    },
    {
      id: 6,
      couple: {
        bride: "Hira Ali",
        groom: "Usman Malik",
        brideAge: 23,
        groomAge: 26,
        brideCity: "Rawalpindi",
        groomCity: "Islamabad",
        brideImage: "https://images.unsplash.com/photo-1494790108755-2616c9c0b8d3?w=150&h=150&fit=crop&crop=face",
        groomImage: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face",
      },
      weddingDate: "July 5, 2023",
      story:
        "We were both young professionals just starting our careers when we met on Humsafar.pk. What began as casual conversations about our goals and aspirations turned into deep discussions about life, faith, and our future dreams. Despite our young age, we both knew we had found something special.",
      testimonial:
        "Age is just a number when you find the right person. Humsafar.pk helped us connect with someone who truly understood and supported our dreams.",
      likes: 145,
      featured: false,
      tags: ["Young Love", "Career Starters", "Supportive Partners"],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <StructuredData data={generateBreadcrumbSchema(breadcrumbItems)} />
      <StructuredData data={articleSchema} />
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-humsafar-500 rounded-3xl mb-16 py-20 px-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Heart className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Love Stories</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Success Stories
              <span className="block text-white/60">
                Real Love, Real Happiness
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Real couples, real love stories. Discover how Humsafar.pk helped thousands of people find their perfect life partners and build beautiful relationships.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-humsafar-600 mb-2">2,500+</div>
              <p className="text-gray-600">Happy Couples</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-humsafar-600 mb-2">95%</div>
              <p className="text-gray-600">Success Rate</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-humsafar-600 mb-2">50+</div>
              <p className="text-gray-600">Cities Connected</p>
            </CardContent>
          </Card>
        </div>

        {/* Success Stories Grid */}
        <div className="space-y-8">
          {successStories.map((story) => (
            <Card
              key={story.id}
              className={`overflow-hidden ${story.featured ? "ring-2 ring-humsafar-200 bg-gradient-to-r from-humsafar50 to-white" : ""}`}
            >
              {story.featured && (
                <div className="bg-humsafar-600 text-white text-center py-2">
                  <Badge variant="secondary" className="bg-white text-humsafar-600">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured Story
                  </Badge>
                </div>
              )}

              <CardContent className="p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Couple Photos */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                      <div className="text-center">
                        <Image
                          src={story.couple.brideImage || "/placeholder.svg"}
                          alt={story.couple.bride}
                          width={200}
                          height={200}
                          className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
                        />
                        <h3 className="font-semibold text-gray-900">{story.couple.bride}</h3>
                        <p className="text-sm text-gray-600">{story.couple.brideAge} years</p>
                        <p className="text-xs text-gray-500 flex items-center justify-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {story.couple.brideCity}
                        </p>
                      </div>

                      <div className="flex flex-col items-center">
                        <Heart className="h-8 w-8 text-humsafar-600 fill-current mb-2" />
                        <span className="text-xs text-gray-500">+</span>
                      </div>

                      <div className="text-center">
                        <Image
                          src={story.couple.groomImage || "/placeholder.svg"}
                          alt={story.couple.groom}
                          width={200}
                          height={200}
                          className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
                        />
                        <h3 className="font-semibold text-gray-900">{story.couple.groom}</h3>
                        <p className="text-sm text-gray-600">{story.couple.groomAge} years</p>
                        <p className="text-xs text-gray-500 flex items-center justify-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {story.couple.groomCity}
                        </p>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                        <Calendar className="h-4 w-4 mr-2" />
                        Married on {story.weddingDate}
                      </div>

                      <div className="flex flex-wrap justify-center gap-2">
                        {story.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Story Content */}
                  <div className="lg:col-span-2">
                    <div className="mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                        {story.couple.bride} & {story.couple.groom}'s Love Story
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-6">{story.story}</p>

                      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-humsafar-600">
                        <Quote className="h-5 w-5 text-humsafar-600 mb-2" />
                        <p className="text-gray-700 italic">"{story.testimonial}"</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="text-humsafar-600 hover:text-humsafar700">
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          {story.likes} Likes
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Story
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 bg-humsafar-600 rounded-2xl p-8 sm:p-12 text-white">
          <Heart className="h-12 w-12 mx-auto mb-6 fill-current" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Write Your Own Success Story?</h2>
          <p className="text-humsafar-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy couples who found their perfect match on Humsafar.pk. Your soulmate might be just
            one click away!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-humsafar-600 hover:bg-gray-100">
              <Link href="/auth">Start Your Journey</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-humsafar-600 bg-transparent"
            >
              <Link href="/profiles">Browse Profiles</Link>
            </Button>
          </div>
        </div>

        {/* Share Your Story Section */}
        <Card className="mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Got Married Through Humsafar.pk?</h3>
            <p className="text-gray-600 mb-6">
              We'd love to hear your story! Share your journey and inspire others to find their perfect match.
            </p>
            <Button className="bg-humsafar-600 hover:bg-humsafar700">Share Your Story</Button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
