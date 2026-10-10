import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Scissors, Flower2, Gem, Sparkles } from 'lucide-react';

export default function AnimatedLogo() {
  const [isHovered, setIsHovered] = useState(false);

  const brandName = "AMI CRAFT PALACE";
  const letters = brandName.split("");

  // Craft icons that orbit the logo
  const orbitIcons = [
    { icon: Palette, color: 'text-amber-300', angle: 0 },
    { icon: Scissors, color: 'text-sage', angle: 72 },
    { icon: Flower2, color: 'text-rosegold', angle: 144 },
    { icon: Gem, color: 'text-warmgold', angle: 216 },
    { icon: Sparkles, color: 'text-yellow-200', angle: 288 },
  ];

  // Letters staggered animation - fast and snappy for quick mobile paint
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07, // Snappy stagger (1.1s total instead of 5s)
        delayChildren: 0.05,
      }
    }
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 12, 
      scale: 0.95 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 120, 
        damping: 14,
        duration: 0.4
      }
    }
  };

  // Underline self-drawing animation
  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        delay: 1.1 // Starts right as letters finish
      }
    }
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 px-4 overflow-hidden select-none min-h-[220px] sm:min-h-[260px] md:min-h-[300px] w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      aria-label="AMI Craft Palace - Premium Handmade Crafts Store"
    >
      {/* Subtle radial glow background */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-700 ease-in-out"
        style={{
          background: isHovered 
            ? 'radial-gradient(circle, rgba(212,149,107,0.18) 0%, rgba(15,15,15,0) 75%)'
            : 'radial-gradient(circle, rgba(212,149,107,0.06) 0%, rgba(15,15,15,0) 75%)'
        }}
      />

      {/* Orbiting Icons Container - Responsive radii */}
      <div className="absolute w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px] lg:w-[360px] lg:h-[360px] flex items-center justify-center pointer-events-none">
        {orbitIcons.map((item, index) => {
          const IconComponent = item.icon;
          const duration = isHovered ? 4.5 : 10;
          
          return (
            <motion.div
              key={index}
              className="absolute"
              animate={{
                rotate: [item.angle, item.angle + 360],
              }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: duration,
              }}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Actual Icon offset outward, counter-rotated to stay upright */}
              <motion.div 
                className={`absolute glass-panel p-2 sm:p-2.5 rounded-full shadow-lg ${item.color} backdrop-blur-md -translate-y-[95px] sm:-translate-y-[115px] md:-translate-y-[130px]`}
                animate={{
                  rotate: [-item.angle, -item.angle - 360],
                  scale: isHovered ? [1, 1.1, 1] : 1,
                  opacity: [0.85, 1, 0.85]
                }}
                transition={{
                  rotate: {
                    repeat: Infinity,
                    ease: "linear",
                    duration: duration,
                  },
                  scale: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  opacity: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5" />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Branding Typography */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -2 }}
        className="relative z-10 flex flex-col items-center cursor-pointer w-full text-center"
      >
        <h1 
          className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-[0.12em] sm:tracking-[0.16em] md:tracking-[0.18em] text-center select-none transition-all duration-300 w-full px-2"
          style={{
            textShadow: isHovered 
              ? '0 0 25px rgba(212, 149, 107, 0.45)' 
              : '0 0 12px rgba(212, 149, 107, 0.15)'
          }}
        >
          {letters.map((char, index) => (
            <motion.span 
              key={index} 
              variants={letterVariants}
              className={char === " " ? "inline-block w-2.5 sm:w-4 md:w-6" : "inline-block text-gold-gradient"}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* Decorative drawing line */}
        <div className="relative w-36 sm:w-48 md:w-64 h-[1px] mt-3 sm:mt-4 overflow-hidden">
          <motion.div
            variants={lineVariants}
            initial="hidden"
            animate="visible"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-rosegold to-transparent origin-center"
          />
          {/* Shimmer pulse effect on hover */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            />
          )}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-2.5 sm:mt-3 text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.28em] font-sans text-sage uppercase font-medium"
        >
          Handcrafted Luxury Home Decor
        </motion.p>
      </motion.div>
    </div>
  );
}
