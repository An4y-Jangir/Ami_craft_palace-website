import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, X, ExternalLink } from 'lucide-react';

export default function ProductDetails({ product, onClose }) {
  const [isLoved, setIsLoved] = useState(false);

  if (!product) return null;

  const buttonVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <div className="relative glass-panel p-6 md:p-10 rounded-3xl text-left h-full flex flex-col justify-between border-white/10 select-none overflow-y-auto">
      {/* Close button for Modal contexts */}
      {onClose && (
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-cream/70 hover:text-cream transition-colors z-20"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Decorative top ambient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-rosegold/5 blur-3xl pointer-events-none rounded-full" />
      
      <div>
        {/* Rating and Quick Stats */}
        <div className="flex items-center justify-between mb-4 mt-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-warmgold text-warmgold" />
            ))}
            <span className="text-xs text-lightgray ml-2 font-sans">(48 reviews)</span>
          </div>
          <span className="text-xs font-semibold tracking-wider text-sage uppercase font-sans">
            Available on Amazon
          </span>
        </div>

        {/* Title and Price */}
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream tracking-wide mb-2 leading-tight">
          {product.title}
        </h2>
        <div className="flex items-baseline gap-4 mb-6">
          <span className="font-serif text-2xl md:text-3xl text-gold-gradient font-semibold">
            {product.price}
          </span>
        </div>

        {/* Product Details Description & Specifications */}
        <div className="mb-8 font-sans space-y-6">
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-rosegold mb-2">The Piece Story</h4>
            <p className="text-sm text-cream/90 leading-relaxed font-light">{product.longDescription}</p>
          </div>

          <div className="border-t border-white/5 pt-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-rosegold mb-3">Specifications</h4>
            <ul className="space-y-2 text-sm text-lightgray font-light">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-warmgold" />
                <strong className="text-cream/90 font-medium">Materials:</strong> {product.details.materials}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-warmgold" />
                <strong className="text-cream/90 font-medium">Dimensions:</strong> {product.details.dimensions}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons: View on Amazon */}
      <motion.div 
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        className="flex gap-4 items-center mt-auto font-sans"
      >
        <a
          href={product.amazonUrl || "https://amazon.com"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gradient-to-r from-rosegold to-warmgold hover:from-warmgold hover:to-rosegold text-charcoal font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 shadow-xl hover:shadow-rosegold/10 transition-all duration-300 group text-center"
        >
          <span>View on Amazon</span>
          <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </a>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsLoved(!isLoved)}
          className={`p-4 rounded-2xl border transition-all duration-300 ${
            isLoved 
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
              : 'border-white/10 text-lightgray hover:text-cream hover:border-white/20'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-5 h-5 ${isLoved ? 'fill-rose-500' : ''}`} />
        </motion.button>
      </motion.div>
    </div>
  );
}
