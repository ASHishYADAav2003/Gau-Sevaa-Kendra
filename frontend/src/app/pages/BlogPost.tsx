import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Calendar, User, ArrowLeft, Share2, Facebook, Link as LinkIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const allMockPosts = [
  {
    id: 1,
    slug: "monsoon-donations-help",
    title: "How Your Donations Help During Monsoon Season",
    excerpt: "Learn about the special challenges we face during the monsoon and how your contributions make a critical difference.",
    content: `
      <p>The monsoon season brings a unique set of challenges to our animal shelter. Heavy rains, strong winds, and flooding can create perilous conditions for stray and abandoned animals. It is during these times that your generous donations become more critical than ever.</p>
      
      <h2>The Challenge of the Monsoon</h2>
      <p>During the monsoon, animals are vulnerable to a variety of risks. Finding dry shelter and food becomes incredibly difficult for them. Furthermore, the damp conditions make them susceptible to diseases and infections.</p>
      
      <p>Our shelter works tirelessly to rescue these animals, but we need resources to provide them with the care they need. This includes:</p>
      <ul>
        <li><strong>Dry Shelter:</strong> Maintaining waterproof enclosures and dry bedding.</li>
        <li><strong>Medical Care:</strong> Treating infections and providing preventative medications.</li>
        <li><strong>Nutrition:</strong> Ensuring a steady supply of high-quality food.</li>
      </ul>
      
      <h2>How Your Donations Make a Difference</h2>
      <p>Every rupee you donate goes directly towards alleviating these challenges. With your support, we can reinforce our infrastructure to withstand the heavy rains and expand our rescue operations.</p>
      
      <p>Recently, thanks to a surge in community support, we were able to purchase waterproof tarpaulins for all our open enclosures, ensuring that over 500 cows stayed dry during the last heavy downpour.</p>
      
      <blockquote>"The compassion of our donors is the shelter that protects these animals from the storm." - Dr. Rajesh Kumar</blockquote>
      
      <p>Please consider making a donation today to help us prepare for the upcoming monsoon season. Together, we can ensure that no animal is left out in the rain.</p>
    `,
    author: "Dr. Rajesh Kumar",
    date: "2026-05-10",
    category: "Updates",
    image: "https://images.unsplash.com/photo-1772948260139-d5a6418e143d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
    readTime: "5 min read",
  },
  {
    id: 2,
    slug: "lakshmi-recovery-story",
    title: "Meet Lakshmi: A Story of Recovery and Hope",
    excerpt: "Follow Lakshmi's incredible journey from a severe road accident to becoming one of our most beloved residents.",
    content: `
      <p>Lakshmi was brought to our shelter after a severe accident on the highway. Her injuries were extensive, and her chances of survival seemed slim. However, her will to live and the dedication of our medical team made a miracle happen.</p>
      <h2>The Journey</h2>
      <p>It took six months of intensive care, surgeries, and daily physiotherapy for Lakshmi to get back on her feet. Today, she is a symbol of resilience for everyone at Gau Seva Kendra.</p>
      <p>Your support makes these recoveries possible. Please donate to help more animals like Lakshmi.</p>
    `,
    author: "Priya Sharma",
    date: "2026-05-05",
    category: "Success Stories",
    image: "https://images.unsplash.com/photo-1673229266917-89abfa3ebc58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
    readTime: "7 min read",
  },
  {
    id: 3,
    slug: "importance-veterinary-checkups",
    title: "The Importance of Regular Veterinary Checkups",
    excerpt: "Our chief veterinarian explains why preventive care is essential for maintaining animal health and wellbeing.",
    content: `
      <p>Preventive care is the cornerstone of animal welfare. Regular checkups can catch diseases early, preventing suffering and saving lives.</p>
      <h2>What We Look For</h2>
      <p>During a routine examination, we check for signs of malnutrition, skin infections, dental issues, and parasitic infestations. Early detection is key to effective treatment.</p>
      <p>Help us provide regular checkups for all our animals by supporting our medical fund.</p>
    `,
    author: "Dr. Rajesh Kumar",
    date: "2026-04-28",
    category: "Health & Care",
    image: "https://images.unsplash.com/photo-1725409796872-8b41e8eca929?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
    readTime: "6 min read",
  },
  {
    id: 4,
    slug: "volunteer-spotlight",
    title: "Volunteer Spotlight: Making a Difference Every Weekend",
    excerpt: "Meet our dedicated weekend volunteers who spend their time caring for animals and making the shelter a better place.",
    content: `
      <p>Our volunteers are the backbone of Gau Seva Kendra. Every weekend, dozens of dedicated individuals give their time to feed, clean, and care for our animals.</p>
      <h2>Join Our Team</h2>
      <p>Whether you have animal care experience or just a lot of love to give, we welcome you to join our volunteer program. Learn more on our Volunteer page.</p>
    `,
    author: "Sunita Verma",
    date: "2026-04-20",
    category: "Volunteers",
    image: "https://images.unsplash.com/photo-1700665537604-412e89a285c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
    readTime: "4 min read",
  }
];

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const foundPost = allMockPosts.find(p => p.slug === slug);
        
        if (foundPost) {
          setPost(foundPost);
          setRelatedPosts(allMockPosts.filter(p => p.slug !== slug).slice(0, 3));
        } else {
          setPost(null);
          setRelatedPosts([]);
        }
        
      } catch (error) {
        console.error("Failed to fetch post", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchPost();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [slug]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-[#FF6600] animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
        <Link to="/blog" className="text-[#FF6600] hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Return to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-16">
      {/* Featured Image */}
      <div className="w-full h-[40vh] md:h-[60vh] relative">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div className="absolute top-6 left-6 z-10">
          <Link to="/blog" className="inline-flex items-center text-white hover:text-orange-200 transition-colors bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Link>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-32 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8 border-b pb-8">
            <span className="inline-block px-4 py-1 bg-orange-100 text-[#FF6600] rounded-full text-sm font-bold mb-6">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#FF6600]" />
                <span className="font-medium text-gray-900">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#FF6600]" />
                <span>{new Date(post.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div 
            className="prose prose-lg prose-orange max-w-none prose-headings:font-bold prose-a:text-[#FF6600]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-gray-500" />
              <span className="font-semibold text-gray-900">Share this post:</span>
            </div>
            <div className="flex gap-3">
              <button className="p-2 bg-[#25D366] text-white rounded-full hover:bg-[#1ebd5a] transition-colors shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.115.548 4.148 1.587 5.952L.471 24l6.19-1.624c1.748.973 3.711 1.488 5.753 1.488 6.647 0 12.032-5.385 12.032-12.032C24.446 5.385 19.061 0 12.031 0zm0 21.84c-1.782 0-3.522-.477-5.05-1.38l-.36-.215-3.754.985.998-3.662-.236-.376A9.972 9.972 0 0 1 2.062 12.03c0-5.503 4.478-9.98 9.97-9.98 5.502 0 9.98 4.477 9.98 9.98s-4.478 9.98-9.981 9.98zm5.485-7.464c-.302-.152-1.782-.88-2.06-.98-.278-.102-.482-.152-.685.152-.204.303-.778.98-.953 1.182-.176.202-.352.227-.654.076-1.503-.76-2.583-1.425-3.585-2.906-.258-.383.255-.36.85-1.547.076-.153.038-.288-.038-.44-.076-.153-.685-1.652-.939-2.261-.247-.59-.499-.51-.685-.52-.176-.008-.38-.01-.583-.01-.204 0-.533.076-.811.38-.279.303-1.066 1.042-1.066 2.539 0 1.498 1.092 2.946 1.244 3.149.153.203 2.146 3.275 5.197 4.593.725.313 1.291.5 1.733.64.727.23 1.388.197 1.905.12.583-.087 1.782-.728 2.035-1.431.253-.703.253-1.305.176-1.431-.075-.126-.278-.202-.58-.354z" />
                </svg>
              </button>
              <button className="p-2 bg-[#1877F2] text-white rounded-full hover:bg-[#166fe5] transition-colors shadow-sm">
                <Facebook className="w-5 h-5" />
              </button>
              <button onClick={copyLink} className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors shadow-sm">
                <LinkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      <div className="bg-gray-50 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 font-devanagari">Related Posts</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {relatedPosts.map(rel => (
              <Link to={`/blog/${rel.slug}`} key={rel.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={rel.image} 
                    alt={rel.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-xs font-bold text-[#FF6600] uppercase tracking-wider mb-2">{rel.category}</span>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-[#FF6600] transition-colors">{rel.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
