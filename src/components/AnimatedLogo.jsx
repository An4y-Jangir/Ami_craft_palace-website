import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Scissors, Flower2, Gem, Sparkles } from 'lucide-react';

export default function AnimatedLogo() {
  const [isHovered, setIsHovered] = useState(false);

  const brandName = "AMI CRAFT PALACE";
  const letters = brandName.split("");

  // Craft icons that orbit the logo
  // We specify initial angles (in degrees) to distribute them around the circle
  const orbitIcons = [
    { icon: Palette, color: 'text-amber-300', angle: 0, delay: 0 },
    { icon: Scissors, color: 'text-sage', angle: 72, delay: 0.5 },
    { icon: Flower2, color: 'text-rosegold', angle: 144, delay: 1.0 },
    { icon: Gem, color: 'text-gold', angle: 216, delay: 1.5 },
    { icon: Sparkles, color: 'text-yellow-200', angle: 288, delay: 2.0 },
  ];

  // Letters staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // 300ms stagger between letters
        delayChildren: 0.1,
      }
    }
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 15, 
      scale: 0.9 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 80, 
        damping: 15,
        duration: 0.6
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
        delay: 2.2 // Stagger duration * letters length + safety
      }
    }
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-center py-16 px-4 overflow-hidden select-none min-h-[300px] w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="AMI Craft Palace - Premium Handmade Crafts Store"
    >
      {/* Subtle radial glow background */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-700 ease-in-out"
        style={{
          background: isHovered 
            ? 'radial-gradient(circle, rgba(212,149,107,0.15) 0%, rgba(15,15,15,0) 75%)'
            : 'radial-gradient(circle, rgba(212,149,107,0.05) 0%, rgba(15,15,15,0) 75%)'
        }}
      />

      {/* Orbiting Icons Container */}
      <div className="absolute w-[260px] h-[260px] md:w-[320px] md:h-[320px] lg:w-[360px] lg:h-[360px] flex items-center justify-center pointer-events-none">
        {orbitIcons.map((item, index) => {
          const IconComponent = item.icon;
          // Determine speed: normal orbit 9.5s, fast orbit (hovered) 4.5s
          const duration = isHovered ? 4.5 : 9.5;
          
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
                className={`absolute glass-panel p-2.5 rounded-full shadow-lg ${item.color} backdrop-blur-md`}
                animate={{
                  rotate: [-item.angle, -item.angle - 360],
                  scale: isHovered ? [1, 1.1, 1] : 1,
                  opacity: [0.8, 1, 0.8]
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
                style={{
                  transform: 'translateY(-130px)', // Radiating center
                }}
              >
                <IconComponent className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
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
        className="relative z-10 flex flex-col items-center cursor-pointer w-full text-center"
        animate={isHovered ? { y: -3 } : { y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <h1 
          className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-[0.18em] text-center select-none transition-all duration-300 w-full"
          style={{
            textShadow: isHovered 
              ? '0 0 25px rgba(212, 149, 107, 0.4)' 
              : '0 0 10px rgba(212, 149, 107, 0.1)'
          }}
        >
          {letters.map((char, index) => (
            <motion.span 
              key={index} 
              variants={letterVariants}
              className={char === " " ? "inline-block w-4 md:w-6" : "inline-block text-gold-gradient"}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* Decorative drawing line */}
        <div className="relative w-48 md:w-64 h-[1px] mt-4 overflow-hidden">
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-3 text-xs md:text-sm tracking-[0.3em] font-sans text-sage uppercase font-medium"
        >
          Handcrafted Luxury Home Decor
        </motion.p>
      </motion.div>
    </div>
  );
}
