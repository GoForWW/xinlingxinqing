import Image from 'next/image'
import Link from 'next/link'

// Placeholder data for blog posts
const featuredPosts = [
  {
    title: 'The Psychology of Digital Social Anxiety',
    excerpt: 'Understanding how constant connectivity affects our sense of self and belonging in the modern world.',
    category: 'Mental Health',
    date: 'March 2026',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80',
  },
  {
    title: 'Building Emotional Resilience in Difficult Times',
    excerpt: 'Practical strategies for developing mental fortitude when life feels overwhelming.',
    category: 'Psychology',
    date: 'March 2026',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
  },
  {
    title: 'The Science of Healthy Relationships',
    excerpt: 'What attachment theory teaches us about creating lasting connections with others.',
    category: 'Relationships',
    date: 'February 2026',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80',
  },
]

const categories = [
  {
    name: 'Psychology',
    description: 'Understanding the mind and behavior',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="24" cy="20" r="12" />
        <path d="M24 32v12M16 44h16" />
        <path d="M18 18c0-3 2.5-5 6-5s6 2 6 5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Relationships',
    description: 'Connection, communication, intimacy',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="16" cy="20" r="8" />
        <circle cx="32" cy="20" r="8" />
        <path d="M8 40c0-4 4-7 8-7h4M40 40c0-4-4-7-8-7h-4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Mental Health',
    description: 'Wellbeing, stress, self-care',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M24 44c10-8 16-15 16-22a16 16 0 10-32 0c0 7 6 14 16 22z" strokeLinejoin="round" />
        <circle cx="18" cy="22" r="2" fill="currentColor" />
        <circle cx="30" cy="22" r="2" fill="currentColor" />
        <path d="M18 30c2 2 4 3 6 3s4-1 6-3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Productivity',
    description: 'Focus, habits, growth',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 8v8h8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 12h8v8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M36 8v8h8M40 12h-8v8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="32" r="12" />
        <path d="M24 26v8l4 4" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-md border-b border-earth-200/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-serif text-xl text-sage-700 hover:text-sage-800 transition-colors">
              心靈心情
            </Link>
            <div className="flex items-center gap-8 text-sm">
              <Link href="#about" className="text-earth-600 hover:text-sage-600 transition-colors">
                About
              </Link>
              <Link href="#categories" className="text-earth-600 hover:text-sage-600 transition-colors">
                Categories
              </Link>
              <Link href="#newsletter" className="text-earth-600 hover:text-sage-600 transition-colors">
                Subscribe
              </Link>
              <button className="btn-secondary text-sm py-2 px-4">
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage-100 rounded-full text-sage-700 text-sm font-medium">
                <span className="w-2 h-2 bg-sage-500 rounded-full animate-pulse" />
                Exploring the depths of human experience
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-earth-900 leading-[1.1] tracking-tight">
                The art of understanding
                <span className="text-sage-600"> yourself</span>
              </h1>
              <p className="text-lg text-earth-600 leading-relaxed max-w-lg">
                A thoughtful exploration of psychology, relationships, mental health, 
                and productivity. Written for those seeking deeper understanding 
                and meaningful growth.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="btn-primary">
                  Start Reading
                </button>
                <button className="btn-secondary">
                  About the Blog
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-earth-900/10">
                <Image
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
                  alt="Serene mountain landscape at dawn"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-earth-900/20 to-transparent" />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-amber-200/50 rounded-full blur-2xl" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-sage-200/50 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 bg-earth-100/50">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-serif text-earth-900">
            About 心靈心情
          </h2>
          <p className="text-lg text-earth-600 leading-relaxed">
            心靈心情 explores the intersection of psychological research and everyday life. 
            We believe that understanding how your mind works is the first step toward 
            living a more fulfilling, authentic life.
          </p>
          <p className="text-lg text-earth-600 leading-relaxed">
            Our writing draws from cognitive psychology, attachment theory, neuroscience, 
            and behavioral research — translated into practical insights you can apply today.
          </p>
          <div className="pt-8 flex justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-serif text-sage-600">50+</div>
              <div className="text-sm text-earth-500 mt-1">Articles Published</div>
            </div>
            <div className="w-px bg-earth-300" />
            <div>
              <div className="text-3xl font-serif text-sage-600">4</div>
              <div className="text-sm text-earth-500 mt-1">Core Categories</div>
            </div>
            <div className="w-px bg-earth-300" />
            <div>
              <div className="text-3xl font-serif text-sage-600">Weekly</div>
              <div className="text-sm text-earth-500 mt-1">New Content</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif text-earth-900">
              What We Explore
            </h2>
            <p className="text-lg text-earth-600 max-w-2xl mx-auto">
              Four interconnected areas of focus, each offering a different lens 
              through which to understand yourself and the world around you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.name}
                className="group p-8 bg-white rounded-3xl border border-earth-200/50 
                         card-hover cursor-pointer"
              >
                <div className="text-sage-500 mb-6 group-hover:text-sage-600 transition-colors">
                  {category.icon}
                </div>
                <h3 className="text-xl font-serif text-earth-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-earth-500 text-sm leading-relaxed">
                  {category.description}
                </p>
                <div className="mt-6 flex items-center gap-2 text-sage-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-32 px-6 bg-sage-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-serif text-earth-900">
                Recent Reflections
              </h2>
              <p className="text-lg text-earth-600 max-w-xl">
                Thoughtfully crafted pieces exploring the nuances of human psychology and behavior.
              </p>
            </div>
            <Link href="/archive" className="hidden md:flex items-center gap-2 text-sage-600 font-medium hover:text-sage-700 transition-colors">
              View all articles
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPosts.map((post, index) => (
              <article
                key={post.title}
                className="group bg-white rounded-3xl overflow-hidden border border-earth-200/50 card-hover"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-sage-700">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="text-xs text-earth-400 font-medium uppercase tracking-wider">
                    {post.date}
                  </div>
                  <h3 className="text-lg font-serif text-earth-900 leading-snug group-hover:text-sage-700 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-earth-500 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <button className="text-sage-600 text-sm font-medium flex items-center gap-2 hover:text-sage-700 transition-colors">
                    Read more
                    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 6h8M6 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-12 text-center md:hidden">
            <Link href="/archive" className="btn-secondary">
              View all articles
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-sage-600 rounded-[2.5rem] p-12 md:p-20 overflow-hidden">
            {/* Background texture */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-sage-200 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>
            <div className="relative text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage-500/30 rounded-full text-cream text-sm">
                Free weekly insights
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-cream">
                Join the Inner Journey
              </h2>
              <p className="text-sage-100 text-lg max-w-xl mx-auto leading-relaxed">
                Get thoughtful explorations of psychology, relationships, and mental wellbeing 
                delivered to your inbox every week. No spam, just substance.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-4">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 
                           rounded-full text-cream placeholder-cream/60
                           focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-earth-900 
                           font-medium rounded-full transition-all duration-300
                           hover:-translate-y-0.5 active:translate-y-0"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-sage-300 text-xs">
                Join 2,400+ readers. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-earth-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-serif text-xl text-sage-700">心靈心情</h3>
              <p className="text-earth-500 text-sm leading-relaxed max-w-sm">
                Exploring psychology, relationships, mental health, and productivity 
                for those seeking deeper understanding and meaningful growth.
              </p>
              <div className="flex gap-4 pt-4">
                <a href="#" className="text-earth-400 hover:text-sage-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-earth-400 hover:text-sage-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-earth-800">Categories</h4>
              <ul className="space-y-3 text-sm text-earth-500">
                <li><a href="#" className="hover:text-sage-600 transition-colors">Psychology</a></li>
                <li><a href="#" className="hover:text-sage-600 transition-colors">Relationships</a></li>
                <li><a href="#" className="hover:text-sage-600 transition-colors">Mental Health</a></li>
                <li><a href="#" className="hover:text-sage-600 transition-colors">Productivity</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-earth-800">Connect</h4>
              <ul className="space-y-3 text-sm text-earth-500">
                <li><a href="#" className="hover:text-sage-600 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-sage-600 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-sage-600 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-sage-600 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-earth-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-earth-400 text-sm">
              © 2026 心靈心情. All rights reserved.
            </p>
            <p className="text-earth-400 text-sm">
              Built with care for those on the path of self-discovery.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
