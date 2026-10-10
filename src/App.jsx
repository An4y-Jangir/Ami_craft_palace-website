import React, { useState, useEffect } from 'react';
import AnimatedLogo from './components/AnimatedLogo';
import StackedCarousel from './components/StackedCarousel';
import ProductDetails from './components/ProductDetails';
import {
  Sparkles,
  Award,
  Shield,
  Heart,
  Eye,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import initialProducts from './data/products.json';

// Sequential Fade-In Loading Animation Variants
const pageVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const blockVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

export default function App() {
  const [products, setProducts] = useState(initialProducts);
  const [activeProduct, setActiveProduct] = useState(initialProducts[0] || null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Scroll indicators state
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Auto-refresh product list dynamically if new listings sync into /data/products.json
  useEffect(() => {
    fetch('/data/products.json?t=' + Date.now())
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not available');
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          setActiveProduct(prev => (prev ? data.find(p => p.id === prev.id) || data[0] : data[0]));
        }
      })
      .catch(() => {});
  }, []);

  // Filters product list by selected category
  const categories = ["All", ...new Set(products.map(p => p.category))];
  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(p => p.category === selectedCategory);

  useEffect(() => {
    const handleScroll = () => {
      // Bouncing scroll down fade
      setHasScrolled(window.scrollY > 40);

      // Top progress bar tracking
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Triggered from StackedCarousel View Details
  const handleOpenDetails = (product) => {
    setActiveProduct(product);
    setIsDetailsOpen(true);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="min-h-screen luxury-bg-glow text-cream flex flex-col justify-between selection:bg-rosegold/30 selection:text-cream relative overflow-hidden"
    >
      {/* Dynamic structured data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": activeProduct.title,
          "description": activeProduct.description,
          "image": activeProduct.image,
          "offers": {
            "@type": "Offer",
            "price": activeProduct.price.replace(/[^0-9.]/g, ''),
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          }
        })}
      </script>

      {/* Subtle Floating Dust Particles (Visual Effect) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-rosegold/15 filter blur-[1px] animate-pulse"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 8 + 8}s`,
              opacity: 0.12,
            }}
          />
        ))}
      </div>

      {/* Top scroll progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-rosegold via-warmgold to-rosegold z-50 origin-left"
        style={{ scaleX: scrollProgress }}
      />

      {/* Top Banner Message */}
      <div className="relative z-10 bg-black/55 py-2.5 text-[9px] uppercase font-bold tracking-[0.25em] text-center border-b border-white/5 text-warmgold font-sans">
        Discover Curated Handcrafted Artworks & Heritage Collections Sold Directly on Amazon
      </div>

      {/* Main Luxury Header */}
      <header className="relative z-10 sticky top-0 bg-charcoal/90 backdrop-blur-md border-b border-white/5 px-6 md:px-12 py-4 flex items-center justify-between">
        <a href="#" className="font-serif text-lg md:text-xl font-semibold tracking-wider text-cream flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="w-2 h-2 rounded-full bg-rosegold animate-ping" />
          AMI CRAFT PALACE
        </a>

        {/* Desktop Nav links */}
        <nav className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-lightgray font-sans">
          <a href="#curations" className="hover:text-rosegold transition-colors">The Curations</a>
          <a href="#heritage" className="hover:text-rosegold transition-colors">Our Philosophy</a>
        </nav>


      </header>

      {/* Hero Section with loading animations */}
      <motion.section variants={blockVariants} className="relative z-10 container mx-auto px-6 max-w-7xl">
        <AnimatedLogo />

        {/* Bouncing Mouse scroll down indicator */}
        <AnimatePresence>
          {!hasScrolled && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-cream/40 text-[9px] uppercase tracking-[0.25em] font-sans"
            >
              <div className="w-5 h-8 rounded-full border border-cream/20 flex justify-center p-1 relative">
                <motion.span
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                  className="w-1 h-2 rounded-full bg-rosegold block"
                />
              </div>
              <span>Scroll Down</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Category Filter Bar */}
      <motion.div
        variants={blockVariants}
        className="relative z-10 flex flex-wrap justify-center gap-3.5 mb-8 px-4 font-sans mt-6"
      >
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs uppercase font-bold tracking-widest border transition-all duration-300 ${selectedCategory === cat
              ? 'bg-rosegold border-rosegold text-charcoal shadow-lg shadow-rosegold/10'
              : 'bg-white/5 border-white/10 text-lightgray hover:text-cream hover:bg-white/10'
              }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Main Feature: Card Stack */}
      <motion.section
        variants={blockVariants}
        id="curations"
        className="relative z-10 container mx-auto px-6 md:px-12 py-12 max-w-7xl flex flex-col items-center"
      >
        <div className="w-full flex justify-center">
          <StackedCarousel
            products={filteredProducts}
            onActiveChange={setActiveProduct}
            onViewDetails={handleOpenDetails}
          />
        </div>

        {/* Secondary Click Trigger (Fallback Detail button) */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsDetailsOpen(true)}
          className="mt-14 px-7 py-3.5 rounded-full border border-white/15 hover:border-rosegold text-xs uppercase font-bold tracking-[0.2em] bg-white/5 text-cream flex items-center gap-2 transition-all duration-300 font-sans"
        >
          <Eye className="w-4 h-4 text-warmgold" />
          <span>Explore Artifact Details</span>
        </motion.button>
      </motion.section>

      {/* Palace Heritage & Value Props Section */}
      <motion.section
        variants={blockVariants}
        id="heritage"
        className="relative z-10 container mx-auto px-6 md:px-12 py-20 max-w-7xl border-t border-white/5"
      >
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-rosegold font-sans">Uncompromising Standards</span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-cream mt-2 tracking-wide">
            The Palace Philosophy
          </h2>
          <p className="text-sm text-lightgray mt-4 leading-relaxed font-light font-sans">
            AMI Craft Palace curates exquisite, hand-crafted objects for living spaces. Every piece represents a lineage of craftsmanship, dedicated to preservation of organic art.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Award,
              title: "Generational Mastery",
              desc: "We collaborate exclusively with master artisans who have inherited family guilds, ensuring ancient techniques remain alive."
            },
            {
              icon: Sparkles,
              title: "Ethically Sourced Materials",
              desc: "From organic cottons dyed with tree barks to recycled clays and natural soy waxes, our materials respect our earth."
            },
            {
              icon: Shield,
              title: "Authenticated Luxury",
              desc: "Every creation arrives with an authenticated hallmark verification, supporting natural home heritage projects."
            }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 text-left">
                <div className="p-3 bg-white/5 rounded-xl w-fit mb-6 text-warmgold border border-white/5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-cream mb-2.5">{item.title}</h3>
                <p className="text-xs md:text-sm text-lightgray leading-relaxed font-light font-sans">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Elegant, Comprehensive Footer with contact info & social links */}
      <motion.footer
        variants={blockVariants}
        className="relative z-10 bg-black/60 border-t border-white/5 py-16 px-6 md:px-12 mt-12 text-xs md:text-sm font-sans"
      >
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-left mb-12">

            {/* Column 1: Brand Story */}
            <div className="space-y-4">
              <h4 className="font-serif text-lg font-semibold tracking-wider text-cream">AMI CRAFT PALACE</h4>
              <p className="text-xs text-lightgray/80 leading-relaxed font-light">
                Preserving generational craftsmanship through curated, hand-carved objects for modern minimalist spaces. Each piece tells the provenance of its maker.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3">
              <h5 className="text-[10px] uppercase font-bold tracking-widest text-rosegold">Navigation</h5>
              <ul className="space-y-2 text-xs text-lightgray/70">
                <li><a href="#curations" className="hover:text-cream transition-colors">Palace Curations</a></li>
                <li><a href="#heritage" className="hover:text-cream transition-colors">Our Philosophy</a></li>
                <li><a href="https://www.amazon.in/storefront?me=A1PO2AXUX4A8XF&ref_=ssf_share" target="_blank" rel="noopener noreferrer" className="hover:text-cream transition-colors">Amazon Storefront</a></li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div className="space-y-3.5">
              <h5 className="text-[10px] uppercase font-bold tracking-widest text-rosegold">Palace Contacts</h5>
              <ul className="space-y-2.5 text-xs text-lightgray/70">
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-sage" />
                  <span>Space Residence, Mira Road, Thane, Maharashtra, IN</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-sage" />
                  <span>+91 8369830898</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-sage" />
                  <span>jangir.amita@gmail.com</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter / Socials */}
            <div className="space-y-4">
              <h5 className="text-[10px] uppercase font-bold tracking-widest text-rosegold">Connect With Us</h5>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/amj_ideas" aria-label="Instagram Page" className="p-2.5 rounded-lg bg-white/5 text-lightgray hover:text-rosegold transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="https://wa.me/message/CV3Z74LTJNYJK1" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Support" className="p-2.5 rounded-lg bg-white/5 text-lightgray hover:text-rosegold transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 2c-5.516 0-9.984 4.469-9.984 9.984 0 1.766.453 3.484 1.328 5.016l-1.406 5.125 5.25-1.375c1.484.813 3.156 1.25 4.813 1.25 5.516 0 9.984-4.469 9.984-9.984 0-2.656-1.031-5.156-2.906-7.031-1.875-1.875-4.375-2.922-7.078-2.922zm0 1.516c2.25 0 4.359.875 5.953 2.469s2.469 3.703 2.469 5.953c0 4.656-3.797 8.453-8.453 8.453-1.484 0-2.938-.391-4.203-1.125l-.313-.188-3.125.813.828-3.031-.203-.328c-.813-1.297-1.25-2.813-1.25-4.375 0-4.656 3.797-8.453 8.453-8.453zm-3.625 3.328c-.141 0-.391.047-.594.266-.203.219-.781.766-.781 1.859s.797 2.156.906 2.313c.109.156 1.563 2.375 3.781 3.328.531.234.938.375 1.266.484.531.172 1.016.141 1.391.094.422-.063 1.297-.531 1.484-1.047.188-.516.188-.953.125-1.047-.063-.094-.219-.141-.469-.266-.25-.125-1.484-.734-1.719-.813-.234-.078-.406-.125-.578.125-.172.25-.672.828-.828 1-.156.172-.313.203-.563.078-.25-.125-1.063-.391-2.031-1.25-.75-.672-1.25-1.5-1.391-1.75-.141-.25-.016-.391.109-.516.109-.109.25-.297.375-.438.125-.141.172-.25.25-.422.078-.172.047-.328-.016-.453-.063-.125-.578-1.391-.797-1.922-.219-.516-.438-.453-.594-.453z" />
                  </svg>
                </a>
              </div>
              <p className="text-[10px] text-lightgray/50">Follow our updates for new collection listings on Amazon.</p>
            </div>

          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
            <p className="text-[10px] text-lightgray/40 font-light">© 2026 AMI Craft Palace. Crafted for fine homes worldwide.</p>
            <div className="flex gap-6 text-[10px] text-lightgray/55 uppercase font-bold tracking-widest">
              <a href="#" className="hover:text-cream transition-colors">Privacy</a>
              <a href="#" className="hover:text-cream transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Description Modal Overlay (Desktop/Tablet/Mobile Responsive) */}
      <AnimatePresence>
        {isDetailsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 lg:p-12">
            {/* Backdrop with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setIsDetailsOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Body: Left Slide on Desktop, Bottom Slide on Mobile */}
            <motion.div
              initial={
                window.innerWidth < 768
                  ? { y: '100%', opacity: 1 }
                  : { x: '-100%', opacity: 0 }
              }
              animate={
                window.innerWidth < 768
                  ? { y: 0, opacity: 1 }
                  : { x: 0, opacity: 1 }
              }
              exit={
                window.innerWidth < 768
                  ? { y: '100%', opacity: 1 }
                  : { x: '-100%', opacity: 0 }
              }
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative z-10 w-full md:w-[90%] lg:w-[70%] h-full md:h-[85vh] lg:h-[80vh] bg-charcoal md:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/10"
            >
              {/* Product Image Column */}
              <div className="w-full md:w-1/2 h-[40vh] md:h-full relative overflow-hidden bg-black/45">
                <img
                  src={activeProduct.image}
                  alt={activeProduct.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent md:hidden" />
              </div>

              {/* Specs & Details Column */}
              <div className="w-full md:w-1/2 h-[60vh] md:h-full">
                <ProductDetails
                  product={activeProduct}
                  onClose={() => setIsDetailsOpen(false)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
