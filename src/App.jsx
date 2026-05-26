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
  Volume2,
  VolumeX,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRODUCTS = [
  {
    id: 'shubh-labh-hangings',
    title: "Shubh Labh Embroidered Hangings",
    badge: "Festive Collection",
    price: "₹500.00",
    image: "/images/shubh_labh_hangings.webp",
    description: "Traditional door hangings featuring Shubh Labh text plates, floral motifs, and pearl strings.",
    longDescription: "An auspicious set of two hanging door decorations featuring beautifully crafted 'Shubh' and 'Labh' plaques (representing auspiciousness and prosperity). Ornamented with soft white organza flower clusters, golden Gota Patti work, and layered faux pearl strands.",
    category: "Heritage Fabrics",
    amazonUrl: "https://amzn.in/d/0dSXpQzF",
    details: {
      materials: "Cardboard, Fabric, Metallic Foil, Net, Pearl Beads, Resin, Sequins",
      dimensions: "2D x 8.5W x 25.5H Centimeters"
    }
  },
  {
    id: 'peacock-sticks',
    title: "Peacock Motif Decor Sticks",
    badge: "Heritage Accents",
    price: "₹199.00",
    image: "/images/peacock_sticks.webp",
    description: "Delicate decorative sticks adorned with hand-styled peacock feathers and gold details.",
    longDescription: "A pair of traditional decorative sticks designed with delicate miniature peacock feather eyes. Wrapped in golden threads and finished with vibrant orange felt backings, these sticks add an authentic, regal charm to vases or festive centerpieces.",
    category: "Home Accents",
    amazonUrl: "https://www.amazon.com/s?k=traditional+indian+decor+sticks",
    details: {
      materials: "Gota thread, Felt, Peacock feathers, Rhinestones",
      dimensions: "25cm Height x 8cm Diameter"
    }
  },
  {
    id: 'evil-eye-patch',
    title: "Evil Eye Beaded Patch",
    badge: "Protection Charm",
    price: "₹200.00",
    image: "/images/evil_eye_patch.webp",
    description: "Handmade blue and gold beaded evil eye wall emblem with sequin embroidery.",
    longDescription: "An intricately detailed evil eye protection amulet, hand-stitched with micro glass beads in royal blue, turquoise, and cream. Embellished with shimmering gold sequins and decorative leaf elements to protect your home with luxury styling.",
    category: "Home Accents",
    amazonUrl: "https://amzn.in/d/0a7cx1c7",
    details: {
      materials: "Fabric Backing, Glass Beads, Metallic Thread, Sequins",
      dimensions: "11.0L x 8.0W Centimeters"
    }
  },
  {
    id: 'evil-eye-toran',
    title: "Radha Krishna Door Bandhanwar",
    badge: "Royal Toran",
    price: "₹1800.00",
    image: "/images/evil_eye_toran.webp",
    description: "Premium door hanging featuring beaded evil eye borders, flowers, and a Radha Krishna centerpiece.",
    longDescription: "A premium, horizontal door hanging (Bandhanwar/Toran) featuring protective beaded evil eye medallions at both ends. Decorated with an array of pastel organza flowers, sequence borders, and a beautiful central Radha Krishna medallion. Fits standard doors.",
    category: "Heritage Fabrics",
    amazonUrl: "https://www.amazon.com/s?k=indian+door+hanging+toran+bandhanwar",
    details: {
      materials: "Organza flowers, Glass beads, Sequence lace, Metal medallion",
      dimensions: "90cm Length (fits standard door frames)"
    }
  },
  {
    id: 'brocade-thali',
    title: "Brocade Decorative Puja Platter",
    badge: "Festive Dining",
    price: "₹399.00",
    image: "/images/brocade_thali.webp",
    description: "An elegant green brocade thali set with gold border trim, matching brass cups, and a cone.",
    longDescription: "A festive decorative platter (Thali) wrapped in luxurious dark green forest brocade with floral gold weave patterns. Styled with gold triangle Gota laces and matching pearl boundaries. Includes two small metal bowls and a Gota-wrapped cone.",
    category: "Home Accents",
    amazonUrl: "https://www.amazon.com/s?k=decorated+brocade+puja+thali+plate",
    details: {
      materials: "Forest Green Brocade fabric, Gota laces, Brass, Faux pearls",
      dimensions: "28cm Diameter"
    }
  },
  {
    id: 'ganesha-toran',
    title: "Ganesha Medallion Door Toran",
    badge: "Royal Toran",
    price: "₹2100.00",
    image: "/images/ganesha_toran.webp",
    description: "Deluxe door hanging featuring a central Ganesha medallion, light purple roses, and beaded embellishments.",
    longDescription: "A magnificent horizontal door toran featuring a diamond-shaped Ganesha icon at the center. Accented with lush lavender roses, gold sequence borders, hanging metallic bells, and elegant mint-blue lotus corner patches.",
    category: "Heritage Fabrics",
    amazonUrl: "https://amzn.in/d/07URixoK",
    details: {
      materials: "Artificial Flowers, Beads, Embroidery Thread, Fabric, Metal, Sequins",
      dimensions: "104 Length Centimetres"
    }
  },
  {
    id: 'swastik-lotus-hangings',
    title: "Lotus Swastik Wall Hangings",
    badge: "Protection Charm",
    price: "₹350.00",
    image: "/images/swastik_lotus_hangings.webp",
    description: "A pair of swastik protection symbols decorated with pink lotus illustrations and golden tassels.",
    longDescription: "An elegant pair of hanging Swastik medallions decorated with golden borders, pink lotus graphics, and soft silk tassels. Symbolizing protection and positivity, they look gorgeous hanging in entryways or temple rooms.",
    category: "Home Accents",
    amazonUrl: "https://www.amazon.com/s?k=indian+swastik+hanging+lotus",
    details: {
      materials: "MDF base, Silk tassels, Gota borders, Rhinestones",
      dimensions: "50cm Length x 10cm Width"
    }
  },
  {
    id: 'rose-shubh-labh',
    title: "Shubh Labh Rose Plaques",
    badge: "Festive Collection",
    price: "₹450.00",
    image: "/images/rose_shubh_labh.webp",
    description: "A set of Shubh Labh plaques adorned with large purple roses, gold rings, and hanging jhumkas.",
    longDescription: "A modern design of Shubh Labh hanging plaques featuring large, realistic light purple organza roses on gold tissue frames. Finished with traditional sequin-covered jhumka bells at the bottom.",
    category: "Home Accents",
    amazonUrl: "https://amzn.in/d/0gsdsxzI",
    details: {
      materials: "Delicate Pearl Beadwork, Soft Pink Fabric Flowers, and Golden Sequinned Jhumki Bells",
      dimensions: "2D x 8.5W x 25.5H Centimeters"
    }
  },
  {
    id: 'burlap-gift-pouch',
    title: "Gemstone Burlap Gift Pouch",
    badge: "Heritage Accents",
    price: "₹650.00",
    image: "/images/burlap_gift_pouch.webp",
    description: "Handmade rustic burlap bag featuring a central teardrop gemstone and pearl border.",
    longDescription: "A charming and rustic favor pouch crafted from natural jute burlap. Decorated with a central teardrop rhinestone framed by micro-pearl borders. Includes a gold drawstring closure, perfect for luxury gifting.",
    category: "Home Accents",
    amazonUrl: "https://amzn.in/d/00FElpaE",
    details: {
      materials: "Cotton Drawstring, Jute, Pearl Beads, Rhinestone",
      dimensions: "13L x 11W x 0.5H Centimeters"
    }
  },
  {
    id: 'krishna-pearl-frame',
    title: "Krishna Pearl Framed Icon",
    badge: "Heritage Accents",
    price: "₹250.00",
    image: "/images/krishna_pearl_frame.webp",
    description: "Gilded square desktop icon featuring a hand-painted Krishna face with double pearl borders.",
    longDescription: "A beautiful square decorative frame layered with dual rows of premium white faux pearls and set with circular rhinestones. Houses a hand-painted traditional portrait of Lord Krishna with a peacock feather crown.",
    category: "Home Accents",
    amazonUrl: "https://amzn.in/d/0hwvSjaY",
    details: {
      materials: "Wood, Metal with Pearl and Crystal Embilleshment, Golden Finish Frame",
      dimensions: "8.5L x 8.8W Centimeters"
    }
  },
  {
    id: 'gift-box-ribbon',
    title: "Rose Ribbon Gift Box Decoration",
    badge: "Home Accents",
    price: "₹150.00",
    image: "/images/gift_box_ribbon.webp",
    description: "Clear gift container wrapped with a broad gold mesh ribbon and a realistic pink rose centerpiece.",
    longDescription: "An elegant gift presentation solution. Features a premium clear container wrapped in structured gold mesh ribbon, centered with a lifelike deep pink rose detail. Makes any gift look exceptionally premium.",
    category: "Home Accents",
    amazonUrl: "https://www.amazon.com/s?k=gold+mesh+ribbon+gift+box+decoration",
    details: {
      materials: "Polypropylene, Gold mesh ribbon, Silk rose",
      dimensions: "22cm x 15cm x 10cm"
    }
  },
  {
    id: 'ganesha-gold-thali',
    title: "Ganesha Gold Decorative Platter",
    badge: "Home Accents",
    price: "₹299.00",
    image: "/images/ganesha_gold_thali.webp",
    description: "Golden net-texture thali with white pearl borders, a central Ganesha detail, and matching bowls.",
    longDescription: "A stunning golden platter wrapped in a fine mesh texture, finished with a classic border of faux white pearls. Includes a central Ganesha emblem, two small bowls for ritual ingredients, and white floral details.",
    category: "Home Accents",
    amazonUrl: "https://www.amazon.com/s?k=ganesha+gold+puja+thali+plate",
    details: {
      materials: "Steel platter, Gold mesh, Faux pearls, Brass bowls",
      dimensions: "26cm Diameter"
    }
  },
  {
    id: 'shimmer-platter-cover',
    title: "Shimmering Organza Platter Cover",
    badge: "Heritage Fabrics",
    price: "₹500.00",
    image: "/images/shimmer_platter_cover.webp",
    description: "Light blue shimmering organza cloth with gold fringes, perfect for wrapping presentation trays.",
    longDescription: "A luxurious light blue organza cover cloth with gold-threaded borders and fine metallic fringes. Perfect for covering shagun platters or offering gifts in a traditional, elegant manner.",
    category: "Heritage Fabrics",
    amazonUrl: "https://amzn.in/d/0gIK4LIA",
    details: {
      materials: "Organza fabric, Golden Zari thread",
      dimensions: "48L x 48W Centimeters"
    }
  },
  {
    id: 'flower-lumba-rakhi',
    title: "Aura Rose Flower Lumba Rakhi",
    badge: "Lumba Collection",
    price: "₹350.00",
    image: "/images/flower_lumba_rakhi.webp",
    description: "An exquisite pink rose flower Lumba Rakhi with golden beads, micro-pearl details, and matching pom-poms.",
    longDescription: "A beautifully styled handcrafted Lumba Rakhi designed specifically for sisters-in-law. Adorned with a large, delicate pink fabric rose, micro-pearl accents, hanging pom-poms with criss-cross golden ribbons, and a matching peacock motif thread.",
    category: "Heritage Fabrics",
    amazonUrl: "https://www.amazon.com/s?k=lumba+rakhi+for+bhabhi",
    details: {
      materials: "Organza flower, Golden beads, Pom-poms, Satin ribbons, Peacock motif charm",
      dimensions: "32cm Total Length"
    }
  },
  {
    id: 'gota-tassel-rakhi',
    title: "Exquisite Pearl & Crystal Gota Tassel Set",
    badge: "Artisan Set",
    price: "₹550.00",
    image: "/images/gota_tassel_rakhi.webp",
    description: "Exquisite handcrafted set featuring a gold flower thread and a stunning sequined bell tassel hanging.",
    longDescription: "A premium handcrafted artisan set of two: a delicate wrist tie adorned with a crystal flower centerpiece, paired with a matching hanging tassel ornament. Crafted with shimmering gold Gota, sequins, and multiple hanging strands of tiny gold beads and white pearls.",
    category: "Heritage Fabrics",
    amazonUrl: "https://www.amazon.com/s?k=gota+tassel+rakhi+set",
    details: {
      materials: "Gota Patti ribbon, Sequins, Glass crystal beads, Faux pearls",
      dimensions: "Tassel: 15cm Length; Wrist Tie: 35cm Length"
    }
  },
  {
    id: 'heart-pendant-rakhi',
    title: "Enameled Heart Pendant Rakhi",
    badge: "Modern Festive",
    price: "₹150.00",
    image: "/images/heart_pendant_rakhi.webp",
    description: "A modern design featuring a pink-enameled layered heart pendant on a gold link chain and pink thread.",
    longDescription: "A contemporary fusion design. Features a beautiful, high-gloss enameled heart pendant with concentric pink, white, and red layers, suspended from a gold-plated link chain. Finished with soft pink braided threads and small pearl accent beads, combining modern charm with festive tradition.",
    category: "Heritage Fabrics",
    amazonUrl: "https://www.amazon.com/s?k=heart+pendant+rakhi+bracelet",
    details: {
      materials: "Enameled brass pendant, Gold-plated chain, Cotton threads, Pearl beads",
      dimensions: "25cm Length"
    }
  },
  {
    id: 'peacock-lumba-rakhi',
    title: "Parrot Gota Lumba Rakhi Set",
    badge: "Lumba Collection",
    price: "₹350.00",
    image: "/images/peacock_lumba_rakhi.jpg",
    description: "A gorgeous festive set featuring a hand-painted wooden peacock motif, golden Gota circles, and hanging white pearl/bead tassels.",
    longDescription: "Celebrate Rakshabandhan with this premium handcrafted Lumba Rakhi set for brother and sister-in-law. It features a stunning Lumba Rakhi adorned with a hand-painted wooden peacock emblem, golden Gota Patti layered circles, and elegant hanging white bead and pearl tassels. It is paired with a matching wrist thread for the brother.",
    category: "Heritage Fabrics",
    amazonUrl: "https://www.amazon.com/s?k=peacock+lumba+rakhi+set",
    details: {
      materials: "Wooden peacock charm, Gota Patti ribbon, Pearl beads, Braided threads, Sequins",
      dimensions: "Lumba: 18cm Length; Wrist Tie: 32cm Length"
    }
  }
];

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
  const [activeProduct, setActiveProduct] = useState(PRODUCTS[0]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(0.4);

  // Scroll indicators state
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Filters product list by selected category
  const categories = ["All", ...new Set(PRODUCTS.map(p => p.category))];
  const filteredProducts = selectedCategory === "All"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === selectedCategory);

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

        {/* Sound Controls */}
        <div className="flex items-center gap-4">
          {/* Sound volume controller */}
          <div className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full px-3 py-1.5 transition-all duration-300 font-sans group">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="focus:outline-none text-lightgray hover:text-rosegold transition-colors"
              aria-label={soundEnabled ? "Mute interface audio feedback" : "Unmute interface audio feedback"}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-warmgold" />
              ) : (
                <VolumeX className="w-4 h-4 text-lightgray/55" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={soundEnabled ? soundVolume : 0}
              onChange={(e) => {
                setSoundEnabled(true);
                setSoundVolume(parseFloat(e.target.value));
              }}
              className="w-14 md:w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rosegold focus:outline-none"
              aria-label="Adjust card click volume levels"
            />
          </div>
        </div>
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
            soundEnabled={soundEnabled}
            soundVolume={soundVolume}
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
