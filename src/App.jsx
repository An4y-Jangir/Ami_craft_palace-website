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
  MapPin,
  Menu,
  X,
  LayoutGrid,
  Layers,
  ExternalLink,
  MessageCircle,
  ShoppingBag,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImageUrl, handleImageError } from './utils/imageUtils';

import initialProducts from './data/products.json';

// Sequential Fade-In Loading Animation Variants
const pageVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const blockVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

export default function App() {
  const [products, setProducts] = useState(initialProducts);
  const [activeProduct, setActiveProduct] = useState(initialProducts[0] || null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("deck"); // 'deck' or 'grid'
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Category counts and filter
  const categories = ["All", ...new Set(products.map(p => p.category))];
  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(p => p.category === selectedCategory);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 30);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when modal or mobile menu is open
  useEffect(() => {
    if (isDetailsOpen || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDetailsOpen, isMobileMenuOpen]);

  // Triggered from StackedCarousel or Grid View
  const handleOpenDetails = (product) => {
    setActiveProduct(product);
    setIsDetailsOpen(true);
  };

  const amazonStoreUrl = "https://www.amazon.in/storefront?me=A1PO2AXUX4A8XF&ref_=ssf_share";
  const whatsappUrl = "https://wa.me/918369830898?text=Hello%20AMI%20Craft%20Palace%2C%20I%20am%20interested%20in%20your%20handcrafted%20collections";

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="min-h-screen luxury-bg-glow text-cream flex flex-col justify-between selection:bg-rosegold/30 selection:text-cream relative overflow-x-hidden"
    >
      {/* Dynamic structured data for SEO */}
      {activeProduct && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": activeProduct.title,
            "description": activeProduct.description,
            "image": getOptimizedImageUrl(activeProduct.image),
            "offers": {
              "@type": "Offer",
              "price": activeProduct.price.replace(/[^0-9.]/g, ''),
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock"
            }
          })}
        </script>
      )}

      {/* Subtle Floating Dust Particles (Visual Effect) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-rosegold/15 filter blur-[1px] animate-pulse"
            style={{
              width: `${(i % 3) * 2 + 2}px`,
              height: `${(i % 3) * 2 + 2}px`,
              top: `${(i * 18 + 10)}%`,
              left: `${(i * 22 + 5)}%`,
              animationDuration: `${i * 3 + 6}s`,
              opacity: 0.15,
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
      <div className="relative z-20 bg-black/75 py-2 px-3 text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-center border-b border-white/5 text-warmgold font-sans leading-tight">
        <span>Handcrafted Artworks & Heritage Curations • Sold Directly on Amazon India</span>
      </div>

      {/* Main Luxury Header */}
      <header className="relative z-30 sticky top-0 bg-charcoal/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 md:px-12 py-3.5 flex items-center justify-between">
        <a href="#" className="font-serif text-base sm:text-lg md:text-xl font-bold tracking-wider text-cream flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="w-2 h-2 rounded-full bg-rosegold animate-ping" />
          <span>AMI CRAFT PALACE</span>
        </a>

        {/* Desktop Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-lightgray font-sans">
          <a href="#curations" className="hover:text-rosegold transition-colors">The Curations</a>
          <a href="#heritage" className="hover:text-rosegold transition-colors">Our Philosophy</a>
          <a 
            href={amazonStoreUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-1.5 rounded-full bg-warmgold/15 border border-warmgold/30 text-warmgold hover:bg-warmgold hover:text-charcoal transition-all duration-300 flex items-center gap-1.5 shadow-md"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Amazon Store</span>
          </a>
        </nav>

        {/* Mobile Header Action Buttons */}
        <div className="flex md:hidden items-center gap-2">
          <a 
            href={amazonStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Amazon Storefront"
            className="px-3 py-1.5 rounded-full bg-warmgold/15 border border-warmgold/30 text-warmgold text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-transform"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Store</span>
          </a>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-cream transition-colors border border-white/10 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-rosegold" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer / Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-20 md:hidden bg-charcoal/98 border-b border-white/10 px-6 py-6 font-sans backdrop-blur-xl"
          >
            <nav className="flex flex-col gap-4 text-sm font-semibold tracking-wider text-lightgray uppercase">
              <a 
                href="#curations" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-white/5 hover:text-rosegold flex items-center justify-between"
              >
                <span>The Curations</span>
                <ArrowUpRight className="w-4 h-4 text-warmgold" />
              </a>
              <a 
                href="#heritage" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-white/5 hover:text-rosegold flex items-center justify-between"
              >
                <span>Palace Philosophy</span>
                <ArrowUpRight className="w-4 h-4 text-warmgold" />
              </a>
              <a 
                href={amazonStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-white/5 text-warmgold hover:text-cream flex items-center justify-between font-bold"
              >
                <span>Official Amazon Storefront</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 text-emerald-400 hover:text-emerald-300 flex items-center justify-between font-bold"
              >
                <span>Direct WhatsApp Inquiry</span>
                <MessageCircle className="w-4 h-4" />
              </a>
            </nav>
            
            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-lightgray/70 space-y-1.5">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sage" />
                <span>+91 8369830898</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sage" />
                <span>jangir.amita@gmail.com</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Snappy Animated Logo */}
      <motion.section variants={blockVariants} className="relative z-10 container mx-auto px-4 max-w-7xl pt-2 sm:pt-4">
        <AnimatedLogo />

        {/* Scroll down indicator - cleanly positioned */}
        <AnimatePresence>
          {!hasScrolled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2 mb-4 hidden sm:flex flex-col items-center gap-1 text-cream/40 text-[9px] uppercase tracking-[0.25em] font-sans"
            >
              <div className="w-4 h-7 rounded-full border border-cream/20 flex justify-center p-1 relative">
                <motion.span
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                  className="w-1 h-1.5 rounded-full bg-rosegold block"
                />
              </div>
              <span>Explore Curations</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Category Filter Bar & View Toggle */}
      <motion.div
        variants={blockVariants}
        className="relative z-10 container mx-auto px-4 max-w-7xl mt-4 sm:mt-6 mb-8 font-sans"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Smooth Horizontal Scroll Chip Bar on Mobile */}
          <div className="w-full sm:w-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 -mx-1">
            {categories.map(cat => {
              const count = cat === "All" ? products.length : products.filter(p => p.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 cursor-pointer shrink-0 border ${
                    isSelected
                      ? 'bg-rosegold border-rosegold text-charcoal shadow-lg shadow-rosegold/15'
                      : 'bg-white/5 border-white/10 text-lightgray hover:text-cream hover:bg-white/10'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-black/20 text-charcoal font-black' : 'bg-white/10 text-cream/60'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle: 3D Deck vs 2-Column Catalog Grid */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10 shrink-0">
            <button
              onClick={() => setViewMode('deck')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                viewMode === 'deck'
                  ? 'bg-rosegold text-charcoal shadow-md'
                  : 'text-lightgray hover:text-cream'
              }`}
              aria-label="Switch to 3D Deck View"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Deck</span>
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-rosegold text-charcoal shadow-md'
                  : 'text-lightgray hover:text-cream'
              }`}
              aria-label="Switch to Catalog Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid ({filteredProducts.length})</span>
            </button>
          </div>

        </div>
      </motion.div>

      {/* Main Curations Feature: 3D Card Stack OR Curated Grid */}
      <motion.section
        variants={blockVariants}
        id="curations"
        className="relative z-10 container mx-auto px-4 sm:px-6 md:px-12 py-4 sm:py-8 max-w-7xl flex flex-col items-center"
      >
        {viewMode === 'deck' ? (
          <div className="w-full flex flex-col items-center">
            <StackedCarousel
              products={filteredProducts}
              onActiveChange={setActiveProduct}
              onViewDetails={handleOpenDetails}
            />

            {/* Quick Explore Button below Stack */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsDetailsOpen(true)}
              className="mt-8 sm:mt-10 px-6 py-3 rounded-full border border-white/15 hover:border-rosegold text-xs uppercase font-bold tracking-[0.2em] bg-white/5 text-cream flex items-center gap-2 transition-all duration-300 font-sans shadow-lg cursor-pointer"
            >
              <Eye className="w-4 h-4 text-warmgold" />
              <span>Inspect Full Specifications</span>
            </motion.button>
          </div>
        ) : (
          /* Mobile-Optimized 2-Column Luxury Grid View */
          <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleOpenDetails(product)}
                  className="glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-rosegold/50 transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-lg bg-charcoal/80"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden bg-black/40">
                    <img
                      src={getOptimizedImageUrl(product.image)}
                      alt={product.title}
                      loading="lazy"
                      onError={handleImageError}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Badge */}
                    <div className="absolute top-2 left-2 glass-panel px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-widest text-warmgold border border-warmgold/20 flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-2.5 h-2.5 text-rosegold" />
                      <span>{product.badge || "Artisan"}</span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3 sm:p-4 text-left flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-serif text-sm sm:text-base font-semibold text-cream line-clamp-2 mb-1.5 leading-snug group-hover:text-rosegold transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-[11px] text-lightgray font-light line-clamp-1 mb-2 font-sans">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-1 mt-auto">
                      <div className="flex flex-col">
                        <span className="font-serif text-base sm:text-lg text-gold-gradient font-bold leading-none">
                          {product.price}
                        </span>
                        {product.mrp && (
                          <span className="text-[10px] text-lightgray/50 line-through font-sans mt-0.5">
                            {product.mrp}
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-bold text-rosegold uppercase tracking-wider font-sans group-hover:underline">
                        Details →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.section>

      {/* Palace Heritage & Value Props Section */}
      <motion.section
        variants={blockVariants}
        id="heritage"
        className="relative z-10 container mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-20 max-w-7xl border-t border-white/10 mt-12"
      >
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-rosegold font-sans">
            Uncompromising Standards
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-cream mt-2 tracking-wide">
            The Palace Philosophy
          </h2>
          <p className="text-xs sm:text-sm text-lightgray mt-3 sm:mt-4 leading-relaxed font-light font-sans px-2">
            AMI Craft Palace curates exquisite, hand-crafted objects for living spaces. Every piece represents a lineage of craftsmanship, dedicated to the preservation of organic Indian heritage art.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
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
              <div key={index} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 text-left bg-charcoal/60">
                <div className="p-3 bg-white/5 rounded-xl w-fit mb-5 text-warmgold border border-white/5 shadow-inner">
                  <Icon className="w-5 h-5 text-rosegold" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-cream mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-lightgray leading-relaxed font-light font-sans">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Floating Quick WhatsApp Action Button (Mobile-friendly) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Inquiry"
        className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-40 p-3.5 sm:p-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl shadow-emerald-900/50 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border border-emerald-400/30 group"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="hidden sm:inline-block max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-sans text-xs font-bold ml-0 group-hover:ml-2">
          Chat With Palace
        </span>
      </a>

      {/* Elegant, Comprehensive Footer */}
      <motion.footer
        variants={blockVariants}
        className="relative z-10 bg-black/75 border-t border-white/10 py-12 sm:py-16 px-6 md:px-12 mt-12 text-xs md:text-sm font-sans"
      >
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 text-left mb-12">

            {/* Column 1: Brand Story */}
            <div className="space-y-3.5">
              <h4 className="font-serif text-base sm:text-lg font-bold tracking-wider text-cream">AMI CRAFT PALACE</h4>
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
                <li><a href={amazonStoreUrl} target="_blank" rel="noopener noreferrer" className="hover:text-cream transition-colors">Amazon Storefront</a></li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div className="space-y-3">
              <h5 className="text-[10px] uppercase font-bold tracking-widest text-rosegold">Palace Contacts</h5>
              <ul className="space-y-2.5 text-xs text-lightgray/70">
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-sage shrink-0 mt-0.5" />
                  <span>Space Residence, Mira Road, Thane, Maharashtra, IN</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-sage shrink-0" />
                  <a href="tel:+918369830898" className="hover:text-cream transition-colors">+91 8369830898</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-sage shrink-0" />
                  <a href="mailto:jangir.amita@gmail.com" className="hover:text-cream transition-colors">jangir.amita@gmail.com</a>
                </li>
              </ul>
            </div>

            {/* Column 4: Socials */}
            <div className="space-y-3.5">
              <h5 className="text-[10px] uppercase font-bold tracking-widest text-rosegold">Connect With Us</h5>
              <div className="flex gap-3">
                <a href="https://www.instagram.com/amj_ideas" target="_blank" rel="noopener noreferrer" aria-label="Instagram Page" className="p-2.5 rounded-lg bg-white/5 text-lightgray hover:text-rosegold transition-colors border border-white/5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Support" className="p-2.5 rounded-lg bg-white/5 text-lightgray hover:text-rosegold transition-colors border border-white/5">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 2c-5.516 0-9.984 4.469-9.984 9.984 0 1.766.453 3.484 1.328 5.016l-1.406 5.125 5.25-1.375c1.484.813 3.156 1.25 4.813 1.25 5.516 0 9.984-4.469 9.984-9.984 0-2.656-1.031-5.156-2.906-7.031-1.875-1.875-4.375-2.922-7.078-2.922zm0 1.516c2.25 0 4.359.875 5.953 2.469s2.469 3.703 2.469 5.953c0 4.656-3.797 8.453-8.453 8.453-1.484 0-2.938-.391-4.203-1.125l-.313-.188-3.125.813.828-3.031-.203-.328c-.813-1.297-1.25-2.813-1.25-4.375 0-4.656 3.797-8.453 8.453-8.453zm-3.625 3.328c-.141 0-.391.047-.594.266-.203.219-.781.766-.781 1.859s.797 2.156.906 2.313c.109.156 1.563 2.375 3.781 3.328.531.234.938.375 1.266.484.531.172 1.016.141 1.391.094.422-.063 1.297-.531 1.484-1.047.188-.516.188-.953.125-1.047-.063-.094-.219-.141-.469-.266-.25-.125-1.484-.734-1.719-.813-.234-.078-.406-.125-.578.125-.172.25-.672.828-.828 1-.156.172-.313.203-.563.078-.25-.125-1.063-.391-2.031-1.25-.75-.672-1.25-1.5-1.391-1.75-.141-.25-.016-.391.109-.516.109-.109.25-.297.375-.438.125-.141.172-.25.25-.422.078-.172.047-.328-.016-.453-.063-.125-.578-1.391-.797-1.922-.219-.516-.438-.453-.594-.453z" />
                  </svg>
                </a>
              </div>
              <p className="text-[10px] text-lightgray/50 font-light">New handcrafted listings synchronized regularly from Amazon.</p>
            </div>

          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
            <p className="text-[10px] text-lightgray/40 font-light">© 2026 AMI Craft Palace. Crafted for fine homes worldwide.</p>
            <div className="flex gap-6 text-[10px] text-lightgray/55 uppercase font-bold tracking-widest">
              <a href="#" className="hover:text-cream transition-colors">Privacy</a>
              <a href="#" className="hover:text-cream transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Description Modal Overlay (Desktop Dialog / Mobile Bottom Sheet) */}
      <AnimatePresence>
        {isDetailsOpen && activeProduct && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 lg:p-12">
            {/* Backdrop with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsDetailsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Body: Bottom Sheet on Mobile, Centered Card on Desktop */}
            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative z-10 w-full md:w-[90%] lg:w-[75%] h-[92vh] md:h-[85vh] lg:h-[80vh] bg-charcoal rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/15"
            >
              {/* Mobile Drag Indicator Handle */}
              <div className="md:hidden absolute top-2 inset-x-0 flex justify-center z-30 pointer-events-none">
                <div className="w-12 h-1 bg-white/30 rounded-full" />
              </div>

              {/* Product Image Column: object-contain on mobile so no craft details are cut off! */}
              <div className="w-full md:w-1/2 h-[34vh] md:h-full relative overflow-hidden bg-black/60 flex items-center justify-center p-4 md:p-0">
                <img
                  src={getOptimizedImageUrl(activeProduct.image)}
                  alt={activeProduct.title}
                  onError={handleImageError}
                  className="w-full h-full object-contain md:object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent md:hidden pointer-events-none" />
              </div>

              {/* Specs & Details Column */}
              <div className="w-full md:w-1/2 h-[58vh] md:h-full flex flex-col">
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
