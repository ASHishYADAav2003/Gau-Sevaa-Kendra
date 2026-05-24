import { useState, useEffect } from "react";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/ImageWithFallback";

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Updates", "Success Stories", "Health & Care", "Volunteers", "Transparency", "Rescue Operations"];

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockPosts = [
          {
            id: 1,
            slug: "monsoon-donations-help",
            title: "How Your Donations Help During Monsoon Season",
            excerpt: "Learn about the special challenges we face during the monsoon and how your contributions make a critical difference.",
            author: "Dr. Rajesh Kumar",
            date: "2026-05-10",
            category: "Updates",
            image: "https://images.unsplash.com/photo-1772948260139-d5a6418e143d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
            readTime: "5 min read",
          },
          {
            id: 2,
            slug: "lakshmi-recovery-story",
            title: "Meet Lakshmi: A Story of Recovery and Hope",
            excerpt: "Follow Lakshmi's incredible journey from a severe road accident to becoming one of our most beloved residents.",
            author: "Priya Sharma",
            date: "2026-05-05",
            category: "Success Stories",
            image: "https://images.unsplash.com/photo-1673229266917-89abfa3ebc58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
            readTime: "7 min read",
          },
          {
            id: 3,
            slug: "importance-veterinary-checkups",
            title: "The Importance of Regular Veterinary Checkups",
            excerpt: "Our chief veterinarian explains why preventive care is essential for maintaining animal health and wellbeing.",
            author: "Dr. Rajesh Kumar",
            date: "2026-04-28",
            category: "Health & Care",
            image: "https://images.unsplash.com/photo-1725409796872-8b41e8eca929?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
            readTime: "6 min read",
          },
          {
            id: 4,
            slug: "volunteer-spotlight",
            title: "Volunteer Spotlight: Making a Difference Every Weekend",
            excerpt: "Meet our dedicated weekend volunteers who spend their time caring for animals and making the shelter a better place.",
            author: "Sunita Verma",
            date: "2026-04-20",
            category: "Volunteers",
            image: "https://images.unsplash.com/photo-1700665537604-412e89a285c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
            readTime: "4 min read",
          },
        ];
        setPosts(mockPosts);
      } catch (error) {
        console.error("Failed to fetch blog posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = activeCategory === "All" 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#FF6600] to-[#cc5200] text-white py-16 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-white/90" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-devanagari">Our Blog / हमारा ब्लॉग</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Stories, updates, and insights from our animal welfare journey
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 bg-white border-b border-gray-200 sticky top-16 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-nowrap overflow-x-auto pb-2 gap-3 justify-start md:justify-center scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeCategory === category 
                    ? 'bg-[#1B5E20] text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="w-24 h-6 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="space-y-2 mb-6">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-full h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900">No posts found</h3>
              <p className="mt-2 text-gray-500">Check back later for new updates in this category.</p>
              {activeCategory !== "All" && (
                <button 
                  onClick={() => setActiveCategory("All")}
                  className="mt-6 text-[#FF6600] font-medium hover:underline"
                >
                  View all posts
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <article key={post.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col group">
                    <div className="h-56 overflow-hidden relative">
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-block px-3 py-1 bg-[#FF6600] text-white rounded-full text-xs font-bold shadow-md">
                          {post.category}
                        </span>
                      </div>
                      <ImageWithFallback
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#FF6600] transition-colors">{post.title}</h2>
                      <p className="text-gray-600 mb-6 line-clamp-3 text-sm flex-1">{post.excerpt}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(post.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                      
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="w-full bg-white text-[#FF6600] border border-[#FF6600] px-4 py-2.5 rounded-lg hover:bg-[#FF6600] hover:text-white transition-all font-semibold text-sm flex items-center justify-center gap-2 group/btn mt-auto"
                      >
                        Read More <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
