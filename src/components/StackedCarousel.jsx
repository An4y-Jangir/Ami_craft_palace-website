import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { RotateCw, Sparkles, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { getOptimizedImageUrl, handleImageError } from '../utils/imageUtils';

export default function StackedCarousel({ products, onActiveChange, onViewDetails }) {
  // Order of card indices. Top card is the first element in this array.
  const [order, setOrder] = useState(products.map((_, i) => i));
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastClickedIndex, setLastClickedIndex] = useState(null);
  const [lastEnteringIndex, setLastEnteringIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const dragOccurredRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  // Track screen size for dynamic mobile stacking gaps and responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset order when products list changes
  useEffect(() => {
    setOrder(products.map((_, i) => i));
  }, [products]);

  // Notify parent component about the current active (top) card
  useEffect(() => {
    if (onActiveChange && products[order[0]]) {
      onActiveChange(products[order[0]]);
    }
  }, [order, products, onActiveChange]);

  // Handle cycling logic (Forward)
  const rotateNext = useCallback(() => {
    if (isAnimating || products.length <= 1) return;
    setIsAnimating(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(10); } catch (_) {}
    }

    setLastClickedIndex(order[0]);
    
    setTimeout(() => {
      setOrder(prevOrder => {
        const next = [...prevOrder];
        const top = next.shift();
        next.push(top);
        return next;
      });
      setIsAnimating(false);
      setLastClickedIndex(null);
    }, 450);
  }, [isAnimating, order, products.length]);

  // Handle cycling logic (Backward)
  const rotatePrev = useCallback(() => {
    if (isAnimating || products.length <= 1) return;
    setIsAnimating(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(10); } catch (_) {}
    }

    const prevIndex = order[order.length - 1];
    setLastEnteringIndex(prevIndex);

    setOrder(prevOrder => {
      const next = [...prevOrder];
      const bottom = next.pop();
      return [bottom, ...next];
    });

    setTimeout(() => {
      setLastEnteringIndex(null);
    }, 40);

    setTimeout(() => {
      setIsAnimating(false);
    }, 450);
  }, [isAnimating, order, products.length]);

  // Keyboard navigation support: Arrow keys or space/enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        rotateNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        rotatePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rotateNext, rotatePrev]);

  // Card click handler (Desktop side-click or fallback)
  const handleCardClick = (e) => {
    // If a swipe drag happened, ignore the click
    if (dragOccurredRef.current) {
      dragOccurredRef.current = false;
      return;
    }
    if (isAnimating) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (clickX < width / 2) {
      rotatePrev();
    } else {
      rotateNext();
    }
  };

  // Stack parameters for drawing 3D layered deck
  const getCardStyle = (stackIndex, isTopExiting, isEntering) => {
    const gap = isMobile ? 12 : 20;
    const offsetRotate = isMobile ? 1.5 : 2.2;

    if (shouldReduceMotion) {
      if (isTopExiting || isEntering) {
        return { zIndex: 0, opacity: 0, x: 0, y: 0, rotate: 0, scale: 1 };
      }
      return {
        zIndex: stackIndex === 0 ? 50 : 10,
        opacity: stackIndex === 0 ? 1 : 0.1,
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1
      };
    }

    if (isTopExiting) {
      return {
        zIndex: 0,
        scale: 0.94,
        opacity: 0,
        x: isMobile ? 80 : 120,
        y: gap / 2,
        rotate: 10,
      };
    }

    if (isEntering) {
      return {
        zIndex: 60,
        scale: 0.94,
        opacity: 0,
        x: isMobile ? -80 : -120,
        y: gap / 2,
        rotate: -10,
      };
    }

    switch (stackIndex) {
      case 0:
        return {
          zIndex: 50,
          scale: 1,
          opacity: 1,
          x: 0,
          y: 0,
          rotate: 0,
        };
      case 1:
        return {
          zIndex: 40,
          scale: 0.96,
          opacity: 0.92,
          x: 0,
          y: gap,
          rotate: offsetRotate,
        };
      case 2:
        return {
          zIndex: 30,
          scale: 0.92,
          opacity: 0.80,
          x: 0,
          y: gap * 2,
          rotate: -offsetRotate * 1.3,
        };
      case 3:
        return {
          zIndex: 20,
          scale: 0.88,
          opacity: 0.65,
          x: 0,
          y: gap * 3,
          rotate: offsetRotate * 1.5,
        };
      default:
        return {
          zIndex: 10,
          scale: 0.84,
          opacity: 0,
          x: 0,
          y: gap * 4,
          rotate: 0,
        };
    }
  };

  const activeIndex = order[0] ?? 0;
  const currentProduct = products[activeIndex] || null;

  return (
    <div className="flex flex-col items-center select-none w-full max-w-full overflow-hidden px-2 sm:px-4">
      {/* Mobile/Desktop Contextual Instructions Banner */}
      <div className="flex flex-col items-center gap-1.5 mb-5 text-[11px] font-semibold tracking-[0.2em] text-rosegold uppercase opacity-90 text-center font-sans">
        <div className="flex items-center gap-2">
          <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
          <span>
            {isMobile ? "Swipe or Tap Arrows to Browse" : "Click Left/Right or Use Arrow Keys"}
          </span>
        </div>
        
        {/* Curated Counter Badge */}
        <span className="text-[11px] tracking-[0.1em] text-cream/70 lowercase font-serif italic">
          curation <strong className="text-warmgold not-italic font-bold font-sans">{activeIndex + 1}</strong> of <strong className="text-warmgold not-italic font-bold font-sans">{products.length}</strong>
        </span>
      </div>

      {/* Main 3D Card Stack Container with Touch Gesture Support */}
      <div 
        className="relative w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] h-[440px] sm:h-[480px] md:h-[520px] cursor-pointer touch-pan-y"
        onClick={handleCardClick}
      >
        {products.map((product, idx) => {
          const stackIndex = order.indexOf(idx);
          const isTopExiting = lastClickedIndex === idx;
          const isEntering = lastEnteringIndex === idx;

          // DOM Optimization: Only render the visible 4 cards or the animating ones
          // Eliminates rendering 31 hidden cards on mobile!
          if (stackIndex > 3 && !isTopExiting && !isEntering) {
            return null;
          }

          const style = getCardStyle(stackIndex, isTopExiting, isEntering);
          const isTopCard = stackIndex === 0;

          return (
            <motion.div
              key={product.id}
              className="absolute inset-0 rounded-3xl overflow-hidden glass-panel border border-white/15 shadow-2xl bg-charcoal/90"
              animate={style}
              transition={isEntering ? { duration: 0 } : {
                duration: shouldReduceMotion ? 0.2 : 0.45,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              // Framer Motion Native Drag/Swipe support on the top card
              drag={isTopCard ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.45}
              onDragStart={() => {
                dragOccurredRef.current = true;
              }}
              onDragEnd={(e, info) => {
                const swipeThreshold = 45;
                const velocityThreshold = 250;

                if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
                  rotateNext();
                } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
                  rotatePrev();
                }
                setTimeout(() => {
                  dragOccurredRef.current = false;
                }, 100);
              }}
              style={{
                transformOrigin: "center center",
                pointerEvents: isTopCard ? "auto" : "none",
                willChange: 'transform, opacity',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Product Image: High Resolution, Crisp and Fast */}
              <img 
                src={getOptimizedImageUrl(product.image)} 
                alt={product.title}
                loading={isTopCard ? "eager" : "lazy"}
                decoding="async"
                onError={handleImageError}
                className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 hover:scale-105"
              />

              {/* Luxury dark gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent pointer-events-none" />

              {/* Card Label Tag */}
              <div className="absolute top-4 left-4 glass-panel px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest text-warmgold border border-warmgold/30 flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3 h-3 text-rosegold" />
                <span>{product.badge || "Handcrafted"}</span>
              </div>

              {/* Card Content Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 flex flex-col justify-end text-left">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-cream mb-1.5 tracking-wide line-clamp-2 leading-snug">
                  {product.title}
                </h3>
                
                <p className="text-xs text-lightgray line-clamp-2 font-sans font-light mb-3">
                  {product.description}
                </p>

                <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-xl sm:text-2xl text-gold-gradient font-bold">
                      {product.price}
                    </span>
                    {product.mrp && (
                      <span className="text-[11px] text-lightgray/50 line-through font-sans">
                        {product.mrp}
                      </span>
                    )}
                    {product.discount && (
                      <span className="text-[9px] font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-1.5 py-0.5 rounded-full font-sans">
                        {product.discount}
                      </span>
                    )}
                  </div>

                  {/* Thumb-friendly View Details CTA with clear touch target */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onViewDetails) onViewDetails(product);
                    }}
                    aria-label={`View detailed story for ${product.title}`}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-rosegold hover:text-charcoal border border-white/15 text-[11px] font-bold uppercase tracking-wider text-rosegold hover:border-rosegold transition-all duration-300 flex items-center gap-1.5 shadow-md cursor-pointer pointer-events-auto"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Thumb-Friendly Mobile & Desktop Control Bar (Eliminates 35 overflowing dots) */}
      <div className="w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] flex items-center justify-between mt-8 sm:mt-10 px-2">
        {/* Previous Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            rotatePrev();
          }}
          disabled={isAnimating}
          aria-label="Previous artwork"
          className="w-11 h-11 rounded-full glass-panel border border-white/15 hover:border-rosegold text-cream flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-40 cursor-pointer shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 text-rosegold" />
        </button>

        {/* Center Progress Pill & Mini Track */}
        <div className="flex flex-col items-center gap-1.5 flex-1 px-4">
          <div className="flex items-center gap-2 text-xs font-sans text-lightgray">
            <span className="font-bold text-cream font-serif text-sm">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-white/30">/</span>
            <span className="text-lightgray/70">
              {String(products.length).padStart(2, '0')}
            </span>
          </div>

          {/* Micro Progress Bar */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden max-w-[140px]">
            <motion.div
              className="h-full bg-gradient-to-r from-rosegold to-warmgold rounded-full"
              initial={false}
              animate={{ 
                width: `${((activeIndex + 1) / products.length) * 100}%` 
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            rotateNext();
          }}
          disabled={isAnimating}
          aria-label="Next artwork"
          className="w-11 h-11 rounded-full glass-panel border border-white/15 hover:border-rosegold text-cream flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-40 cursor-pointer shadow-lg"
        >
          <ChevronRight className="w-5 h-5 text-rosegold" />
        </button>
      </div>

      {/* Swipe Tip Pill on Mobile */}
      <div className="mt-3 sm:hidden text-[10px] text-lightgray/50 uppercase tracking-widest font-sans flex items-center gap-1">
        <span>← Swipe Left / Right to Flip →</span>
      </div>
    </div>
  );
}
