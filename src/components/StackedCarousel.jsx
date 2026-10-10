import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { RotateCw, Sparkles } from 'lucide-react';

export default function StackedCarousel({ products, onActiveChange, onViewDetails }) {
  // Order of card indices. Top card is the first element in this array.
  const [order, setOrder] = useState(products.map((_, i) => i));
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastClickedIndex, setLastClickedIndex] = useState(null);
  const [lastEnteringIndex, setLastEnteringIndex] = useState(null);
  const [cursorClass, setCursorClass] = useState('cursor-pointer');
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Track screen size for dynamic mobile stacking gaps
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

  // Keyboard navigation support: Arrow keys or space/enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'Spacebar' || e.key === ' ') {
        e.preventDefault();
        rotateNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        rotatePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [order, isAnimating]);

  // Handle cycling logic (Forward)
  const rotateNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Animate transition
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
    }, 500); // 500ms total animation chain
  };

  // Handle cycling logic (Backward)
  const rotatePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const prevIndex = order[order.length - 1];
    setLastEnteringIndex(prevIndex);

    // Bring bottom card to top of the stack immediately
    setOrder(prevOrder => {
      const next = [...prevOrder];
      const bottom = next.pop();
      return [bottom, ...next];
    });

    // Clear entering flag quickly so it slides in from side position
    setTimeout(() => {
      setLastEnteringIndex(null);
    }, 40);

    // Lock animation triggers for duration
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const handleCardClick = (e) => {
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

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (clickX < width / 2) {
      setCursorClass('cursor-w-resize');
    } else {
      setCursorClass('cursor-e-resize');
    }
  };

  // Stack parameters for drawing
  const getCardStyle = (stackIndex, isTopExiting, isEntering) => {
    const gap = isMobile ? 12 : 25; // 10-15px gap on mobile, 25px on desktop
    const offsetRotate = isMobile ? 1.5 : 2.5;

    // If reduced motion is requested, do not apply scale/rotation transitions
    if (shouldReduceMotion) {
      if (isTopExiting || isEntering) {
        return {
          zIndex: 0,
          opacity: 0,
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1
        };
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
        scale: 0.95,
        opacity: 0,
        x: isMobile ? 50 : 80,
        y: gap / 2,
        rotate: 8,
      };
    }

    if (isEntering) {
      return {
        zIndex: 60, // Above normal top card index (50) to slide over cleanly
        scale: 0.95,
        opacity: 0,
        x: isMobile ? -50 : -80,
        y: gap / 2,
        rotate: -8,
      };
    }

    // Stack indexes: 0 (top), 1, 2, 3, 4 (bottom)
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
          scale: 0.97,
          opacity: 0.95,
          x: 0,
          y: gap,
          rotate: offsetRotate,
        };
      case 2:
        return {
          zIndex: 30,
          scale: 0.94,
          opacity: 0.85,
          x: 0,
          y: gap * 2,
          rotate: -offsetRotate * 1.4,
        };
      case 3:
        return {
          zIndex: 20,
          scale: 0.91,
          opacity: 0.75,
          x: 0,
          y: gap * 3,
          rotate: offsetRotate * 1.6,
        };
      default:
        return {
          zIndex: 10,
          scale: 0.88,
          opacity: 0.50,
          x: 0,
          y: gap * 4,
          rotate: -offsetRotate * 2,
        };
    }
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Click/Keyboard instructions banner */}
      <div className="flex flex-col items-center gap-1 mb-4 text-[10px] font-semibold tracking-[0.25em] text-rosegold uppercase opacity-80">
        <div className="flex items-center gap-2">
          <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Click Left/Right or Use Arrow Keys</span>
        </div>
        
        {/* Animated Product Counter */}
        <span className="text-[11px] font-serif tracking-[0.1em] text-cream/70 lowercase mt-1 italic">
          viewing <strong className="text-warmgold not-italic font-bold font-sans">{(order[0] + 1)}</strong> of <strong className="text-warmgold not-italic font-bold font-sans">{products.length}</strong> items
        </span>
      </div>

      {/* Main Stack Container - Custom sizes for responsive layouts */}
      <div 
        className={`relative w-[calc(100vw-32px)] md:w-[350px] lg:w-[400px] h-[380px] md:h-[450px] lg:h-[500px] ${cursorClass}`}
        onClick={handleCardClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setCursorClass('cursor-pointer')}
        style={{ willChange: 'transform' }} // GPU optimization hint
      >
        {products.map((product, idx) => {
          const stackIndex = order.indexOf(idx);
          const isTopExiting = lastClickedIndex === idx;
          const isEntering = lastEnteringIndex === idx;
          const style = getCardStyle(stackIndex, isTopExiting, isEntering);

          return (
            <motion.div
              key={product.id}
              className="absolute inset-0 rounded-3xl overflow-hidden glass-panel"
              animate={style}
              transition={isEntering ? { duration: 0 } : {
                duration: shouldReduceMotion ? 0.2 : 0.5,
                ease: [0.25, 0.46, 0.45, 0.94] // smooth ease
              }}
              style={{
                transformOrigin: "center center",
                pointerEvents: stackIndex === 0 ? "auto" : "none",
                willChange: 'transform, opacity', // GPU will-change optimization
                transformStyle: 'preserve-3d', // GPU acceleration
              }}
            >
              {/* Product Image - Optimized with lazy loading */}
              <img 
                src={product.image} 
                alt={product.title}
                loading={stackIndex > 1 ? "lazy" : "eager"}
                className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 hover:scale-105"
              />

              {/* Dark luxury gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent pointer-events-none" />

              {/* Card Label Tag */}
              <div className="absolute top-4 left-4 glass-panel px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest text-warmgold border border-warmgold/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {product.badge}
              </div>

              {/* Card Content Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end text-left">
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-cream mb-2 tracking-wide">
                  {product.title}
                </h3>
                <p className="text-xs md:text-sm text-lightgray line-clamp-2 font-sans font-light">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-lg text-warmgold font-medium">
                      {product.price}
                    </span>
                    {product.mrp && (
                      <span className="text-[11px] text-lightgray/50 line-through">
                        {product.mrp}
                      </span>
                    )}
                    {product.discount && (
                      <span className="text-[9px] font-bold text-rose-300 bg-rose-500/15 border border-rose-500/20 px-1.5 py-0.5 rounded-full">
                        {product.discount}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onViewDetails) onViewDetails(product);
                    }}
                    aria-label={`View detailed story for ${product.title}`}
                    className="text-[10px] font-bold uppercase tracking-widest text-rosegold hover:underline pointer-events-auto cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Dots Indicator */}
      <div className="flex gap-2.5 mt-20">
        {products.map((_, idx) => {
          const isActive = order[0] === idx;
          return (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                if (isAnimating) return;
                // Move selected index to the top of the stack
                setOrder(prevOrder => {
                  const newOrder = [...prevOrder];
                  const currentPos = newOrder.indexOf(idx);
                  if (currentPos !== -1) {
                    const sliced = newOrder.splice(currentPos, 1);
                    return [sliced[0], ...newOrder];
                  }
                  return prevOrder;
                });
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                isActive ? 'w-8 bg-rosegold' : 'w-2.5 bg-white/25 hover:bg-white/45'
              }`}
              aria-label={`Go to product ${idx + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
