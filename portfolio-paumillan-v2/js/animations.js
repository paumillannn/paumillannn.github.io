/**
 * ANIMATIONS.JS - SCROLL & INTERACTION EFFECTS
 * =============================================
 * Handles scroll animations and reveal effects
 */

class AnimationController {
	constructor() {
		this.init();
	}

	init() {
		this.setupScrollAnimations();
		this.setupRevealAnimations();
		this.setupTextAnimations();
	}

	/**
	 * Setup Intersection Observer for scroll reveals
	 */
	setupScrollAnimations() {
		const observerOptions = {
			threshold: [0, 0.1, 0.5, 1],
			rootMargin: '0px 0px -50px 0px'
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const ratio = entry.intersectionRatio;
					this.applyScrollTransform(entry.target, ratio);
					entry.target.classList.add('visible');
				} else {
					entry.target.classList.remove('visible');
				}
			});
		}, observerOptions);

		document.querySelectorAll('[data-scroll-fade], .animate-on-scroll').forEach(el => {
			observer.observe(el);
		});
	}

	applyScrollTransform(element, ratio) {
		const translateY = (1 - ratio) * 30;
		const opacity = ratio;
		
		element.style.transform = `translateY(${translateY}px)`;
		element.style.opacity = opacity;
	}

	/**
	 * Setup reveal animations on scroll
	 */
	setupRevealAnimations() {
		const revealElements = document.querySelectorAll('[data-reveal]');

		const observerOptions = {
			threshold: 0.1,
			rootMargin: '0px 0px -100px 0px'
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const type = entry.target.dataset.reveal;
					entry.target.classList.add(type);
					observer.unobserve(entry.target);
				}
			});
		}, observerOptions);

		revealElements.forEach(el => {
			observer.observe(el);
		});
	}

	/**
	 * Setup text animations
	 */
	setupTextAnimations() {
		this.setupWordAnimations();
	}

	setupWordAnimations() {
		const wordElements = document.querySelectorAll('[data-word]');

		if (wordElements.length === 0) return;

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					this.animateWords(entry.target);
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.5 });

		wordElements.forEach(el => {
			observer.observe(el);
		});
	}

	animateWords(element) {
		const words = element.querySelectorAll('[data-word]');
		let delay = 0;

		words.forEach(word => {
			word.style.animation = `slideInUp 600ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms forwards`;
			delay += 100;
		});
	}
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
	window.animationController = new AnimationController();
});

	/* ====================================
	   PARTICLE SYSTEM
	   ==================================== */

	createParticles(container, count = 10) {
		if (!container) return;

		for (let i = 0; i < count; i++) {
			const particle = document.createElement('div');
			particle.className = 'particle';
			particle.style.cssText = `
				position: absolute;
				width: 4px;
				height: 4px;
				background: rgba(102, 126, 234, 0.3);
				border-radius: 50%;
				left: ${Math.random() * 100}%;
				top: ${Math.random() * 100}%;
				animation: float-particle ${2 + Math.random() * 3}s linear infinite;
				animation-delay: ${Math.random() * 2}s;
			`;
			container.appendChild(particle);
		}
	}

	/* ====================================
	   BACKGROUND ANIMATIONS
	   ==================================== */

	createGradientAnimation(element) {
		if (!element) return;

		element.classList.add('bg-gradient-animate');
		element.style.backgroundSize = '200% 200%';
	}

	/* ====================================
	   STAGGER ANIMATIONS
	   ==================================== */

	staggerChildren(container, staggerDelay = 100) {
		const children = container.querySelectorAll('[data-stagger]');
		let delay = 0;

		children.forEach(child => {
			child.style.animation = `fadeInUp 600ms ease-out ${delay}ms backwards`;
			delay += staggerDelay;
		});
	}

	/* ====================================
	   TIMING FUNCTIONS
	   ==================================== */

	// Cubic Bezier easing functions
	static easeInOutCubic(t) {
		return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
	}

	static easeOutElastic(t) {
		const c5 = (2 * Math.PI) / 4.5;
		return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c5) + 1;
	}

	static easeOutBounce(t) {
		const n1 = 7.5625;
		const d1 = 2.75;
		if (t < 1 / d1) {
			return n1 * t * t;
		} else if (t < 2 / d1) {
			return n1 * (t -= 1.5 / d1) * t + 0.75;
		} else if (t < 2.5 / d1) {
			return n1 * (t -= 2.25 / d1) * t + 0.9375;
		} else {
			return n1 * (t -= 2.625 / d1) * t + 0.984375;
		}
	}

	/* ====================================
	   ADVANCED EFFECTS
	   ==================================== */

	createGlitchEffect(element, duration = 200) {
		const glitchFrames = 20;
		const originalText = element.textContent;

		for (let i = 0; i < glitchFrames; i++) {
			setTimeout(() => {
				const randomText = this.getRandomCharacters(originalText.length);
				element.textContent = randomText;
			}, (duration / glitchFrames) * i);
		}

		setTimeout(() => {
			element.textContent = originalText;
		}, duration);
	}

	getRandomCharacters(length) {
		const chars = '!<>-_\\/[]{}—=+*^?#.,"\'~`^;:()$@';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return result;
	}

	createWaveEffect(container, elementSelector) {
		const elements = container.querySelectorAll(elementSelector);
		let delay = 0;

		elements.forEach(element => {
			element.style.animation = `wobble 1s ease-in-out ${delay}ms infinite`;
			delay += 100;
		});
	}

	/* ====================================
	   SCROLL POSITION TRACKING
	   ==================================== */

	setupScrollProgress() {
		const progressBar = document.querySelector('[data-scroll-progress]');
		if (!progressBar) return;

		window.addEventListener('scroll', () => {
			const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
			const scrolled = window.scrollY;
			const percent = (scrolled / totalHeight) * 100;
			progressBar.style.width = `${percent}%`;
		}, { passive: true });
	}
}

/* ====================================
   INITIALIZATION
   ==================================== */

document.addEventListener('DOMContentLoaded', () => {
	window.animationController = new AnimationController();
});

/* ====================================
   EXPORT FOR MODULE SYSTEMS
   ==================================== */

if (typeof module !== 'undefined' && module.exports) {
	module.exports = AnimationController;
}
