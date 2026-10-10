import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, X, ExternalLink, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { getOptimizedImageUrl, handleImageError } from '../utils/imageUtils';

export default function ProductDetails({ product, onClose }) {
  const [isLoved, setIsLoved] = useState(false);

  if (!product) return null;

  const handleToggleWishlist = () => {
    setIsLoved(!isLoved);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(15); } catch (_) {}
    }
  };

  return (
    <div className="relative glass-panel rounded-3xl text-left h-full flex flex-col justify-between border-white/10 select-none overflow-hidden bg-charcoal/95">
      {/* Safe Floating Close Button for both Desktop and Mobile */}
      {onClose && (
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 md:top-6 md:right-6 w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/60 md:bg-white/10 hover:bg-rosegold hover:text-charcoal text-cream/90 flex items-center justify-center transition-all duration-200 z-30 border border-white/15 shadow-xl cursor-pointer"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-rosegold/10 blur-3xl pointer-events-none rounded-full" />

      {/* Scrollable Content Container */}
      <div className="p-5 md:p-8 overflow-y-auto overscroll-contain flex-1">
        {/* Rating and Availability Header (Padding right prevents close button collision) */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pr-12 md:pr-14">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3.5 h-3.5 ${
                  product.ratingScore 
                    ? (i < Math.floor(product.ratingScore) ? 'fill-warmgold text-warmgold' : 'text-warmgold/30')
                    : 'fill-warmgold text-warmgold'
                }`} 
              />
            ))}
            <span className="text-xs text-lightgray ml-1.5 font-sans">
              {product.ratingText || "(48 reviews)"}
            </span>
          </div>

          <span className="text-[10px] font-bold tracking-widest text-warmgold uppercase font-sans bg-warmgold/10 border border-warmgold/20 px-2.5 py-0.5 rounded-full">
            Amazon Direct
          </span>
        </div>

        {/* Product Title */}
        <h2 className="font-serif text-2xl sm:text-3xl md:text-3xl font-bold text-cream tracking-wide mb-2.5 leading-snug">
          {product.title}
        </h2>

        {/* Pricing & Discount Badges */}
        <div className="flex flex-wrap items-baseline gap-2.5 mb-5">
          <span className="font-serif text-2xl md:text-3xl text-gold-gradient font-bold">
            {product.price}
          </span>
          {product.mrp && (
            <span className="text-xs sm:text-sm text-lightgray/60 line-through font-sans">
              M.R.P.: {product.mrp}
            </span>
          )}
          {product.discount && (
            <span className="text-[10px] font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-full font-sans">
              {product.discount}
            </span>
          )}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-2 mb-6 py-3 px-3.5 rounded-2xl bg-white/[0.03] border border-white/5 font-sans">
          <div className="flex items-center gap-2 text-[11px] text-lightgray">
            <ShieldCheck className="w-4 h-4 text-warmgold shrink-0" />
            <span>100% Authentic Handcraft</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-lightgray">
            <Truck className="w-4 h-4 text-warmgold shrink-0" />
            <span>Amazon Prime Delivery</span>
          </div>
        </div>

        {/* Story & Specifications */}
        <div className="font-sans space-y-5 text-left">
          <div>
            <h4 className="text-[11px] uppercase font-bold tracking-widest text-rosegold mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rosegold" />
              <span>Artifact Provenance</span>
            </h4>
            <p className="text-xs sm:text-sm text-cream/90 leading-relaxed font-light">
              {product.longDescription || product.description}
            </p>
          </div>

          <div className="border-t border-white/10 pt-4">
            <h4 className="text-[11px] uppercase font-bold tracking-widest text-rosegold mb-2.5">
              Specifications & Materiality
            </h4>
            <ul className="space-y-2 text-xs text-lightgray font-light">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-warmgold mt-1.5 shrink-0" />
                <span>
                  <strong className="text-cream/90 font-medium">Materials: </strong>
                  {product.details?.materials || "Artisanal Handcrafted Materials"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-warmgold mt-1.5 shrink-0" />
                <span>
                  <strong className="text-cream/90 font-medium">Dimensions: </strong>
                  {product.details?.dimensions || "Standard"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-warmgold mt-1.5 shrink-0" />
                <span>
                  <strong className="text-cream/90 font-medium">Seller: </strong>
                  AMI CRAFT PALACE (Storefront Verified)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar - Always Accessible with One Tap */}
      <div className="p-4 md:p-6 bg-charcoal/95 border-t border-white/10 backdrop-blur-xl flex gap-3 items-center z-20 pb-safe">
        <a
          href={product.amazonUrl || "https://www.amazon.in/storefront?me=A1PO2AXUX4A8XF"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gradient-to-r from-rosegold via-warmgold to-rosegold hover:opacity-95 text-charcoal font-bold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:shadow-rosegold/20 transition-all duration-300 text-xs sm:text-sm uppercase tracking-wider font-sans text-center active:scale-[0.98]"
        >
          <span>Purchase on Amazon</span>
          <ExternalLink className="w-4 h-4 shrink-0" />
        </a>

        <button
          onClick={handleToggleWishlist}
          className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-center shrink-0 cursor-pointer active:scale-90 ${
            isLoved 
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' 
              : 'border-white/15 bg-white/5 text-lightgray hover:text-cream hover:border-white/30'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-5 h-5 ${isLoved ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>
    </div>
  );
}
