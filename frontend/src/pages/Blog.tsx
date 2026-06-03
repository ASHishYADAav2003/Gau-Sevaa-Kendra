import { Helmet } from 'react-helmet-async';
import { Calendar, ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

const BLOG_POSTS = [
  {
    id: 1,
    title: "The Sacred Significance of Gau Mata in Vedic Culture",
    excerpt: "Discover why cows hold such a revered position in ancient Indian scriptures and the spiritual benefits of serving them.",
    image: "https://images.unsplash.com/photo-1570044570183-fa496e579308?auto=format&fit=crop&q=80",
    date: "June 2, 2026",
    author: "Ravi Dev",
    category: "Culture"
  },
  {
    id: 2,
    title: "A Day at Gau Seva Kendra: Feeding and Care Routine",
    excerpt: "Take a behind-the-scenes look at how our dedicated volunteers and staff ensure the health and happiness of our rescued herd.",
    image: "https://images.unsplash.com/photo-1544605963-c7f8a370e0a5?auto=format&fit=crop&q=80",
    date: "May 28, 2026",
    author: "Priya Sharma",
    category: "Inside the Shelter"
  },
  {
    id: 3,
    title: "Understanding the Nutritional Needs of Recovering Cows",
    excerpt: "Learn about the specialized diets we prepare for cows arriving at our shelter with severe malnutrition or injuries.",
    image: "https://images.unsplash.com/photo-1544298711-2d93e15777bd?auto=format&fit=crop&q=80",
    date: "May 15, 2026",
    author: "Dr. Vikram Singh",
    category: "Veterinary Care"
  },
  {
    id: 4,
    title: "How Your Donations Transform Lives",
    excerpt: "Read inspiring stories of cows that were given a second chance at life, made possible entirely through your generous contributions.",
    image: "https://images.unsplash.com/photo-1599863484839-b223ebf03673?auto=format&fit=crop&q=80",
    date: "May 3, 2026",
    author: "Admin",
    category: "Impact"
  }
];

export default function Blog() {
  return (
    <div className="bg-brand-beige min-h-screen py-16">
      <Helmet>
        <title>Blog & Stories | Gau Seva Kendra</title>
        <meta name="description" content="Read stories of rescue, learn about Vedic culture, and stay updated on the latest news from Gau Seva Kendra." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-hindi text-brand-dark mb-4">Voices of Compassion</h1>
          <p className="text-brand-dark/70 text-lg max-w-2xl mx-auto">
            Stay updated with our latest rescues, learn about the spiritual significance of Gau Seva, and read inspiring stories from the shelter.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, i) => (
            <Reveal key={post.id} delay={i * 100} className="h-full">
              <article className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group h-full flex flex-col border border-brand-green/10">
                <div className="relative h-60 overflow-hidden">
                  <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur text-brand-green font-semibold px-3 py-1 text-xs rounded-full uppercase tracking-wider">
                    {post.category}
                  </div>
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs text-brand-dark/60 mb-3 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {post.author}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-brand-dark mb-3 font-serif line-clamp-2 group-hover:text-brand-green transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-brand-dark/70 mb-6 line-clamp-3 text-sm leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  <Link 
                    to={`/blog/${post.id}`} 
                    className="inline-flex items-center gap-2 text-brand-orange font-bold text-sm hover:text-brand-dark transition-colors mt-auto group/link"
                  >
                    Read Full Story
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
