// Framer Motion Animation Variants for Production-Grade P2P Crypto Platform

// Respect user's motion preferences
export const shouldReduceMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Fade in from bottom - for section entrances
export const fadeInUp = {
    hidden: {
        opacity: 0,
        y: 40
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] // Custom easing for smooth feel
        }
    }
};

// Fade in - simple opacity
export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut'
        }
    }
};

// Scale up - for cards and features
export const scaleIn = {
    hidden: {
        opacity: 0,
        scale: 0.9
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

// Stagger children - for lists and grids
export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

// Slide in from left
export const slideInLeft = {
    hidden: {
        opacity: 0,
        x: -50
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

// Slide in from right
export const slideInRight = {
    hidden: {
        opacity: 0,
        x: 50
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

// Button hover animation
export const buttonHover = {
    rest: {
        scale: 1
    },
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.2,
            ease: 'easeInOut'
        }
    },
    tap: {
        scale: 0.98
    }
};

// Card hover animation
export const cardHover = {
    rest: {
        y: 0,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    hover: {
        y: -8,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        transition: {
            duration: 0.3,
            ease: 'easeOut'
        }
    }
};

// Floating animation - for hero elements
export const floating = {
    animate: {
        y: [0, -15, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

// Pulse animation - for CTAs
export const pulse = {
    animate: {
        scale: [1, 1.02, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

// Page transition
export const pageTransition = {
    initial: {
        opacity: 0,
        y: 20
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut'
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
            ease: 'easeIn'
        }
    }
};

// Viewport animation settings - trigger animations when element is in view
export const viewportSettings = {
    once: true, // Only animate once
    amount: 0.2, // Trigger when 20% of element is visible
    margin: '0px 0px -100px 0px' // Start animation slightly before element enters viewport
};

// Helper function to get animation variant based on reduced motion preference
export const getAnimationVariant = (variant) => {
    if (shouldReduceMotion()) {
        return fadeIn; // Use simple fade for reduced motion
    }
    return variant;
};
