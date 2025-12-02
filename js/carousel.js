/**
 * CAROUSEL CONTROLLER
 * ====================
 * Manages certificate carousel functionality
 * 
 * Features:
 * - Continuous scroll animation (30s cycle)
 * - PDF link handling with click events
 * - Company website links on timeline items
 * - Keyboard accessibility (Enter/Space to trigger)
 * 
 * Note: Carousel converted from interactive to continuous banner
 * Navigation buttons and indicators hidden via CSS
 */

class Carousel {
	/**
	 * Initialize carousel controller
	 * @param {HTMLElement} carouselElement - Main carousel container
	 */
	constructor(element = null) {
		this.carousel = element || document.querySelector('[data-carousel]');
		
		if (!this.carousel) return;

		this.track = this.carousel.querySelector('.carousel__track');
		this.slides = this.carousel.querySelectorAll('.carousel__slide');
		this.prevBtn = this.carousel.querySelector('.carousel__btn--prev');
		this.nextBtn = this.carousel.querySelector('.carousel__btn--next');
		this.indicatorsContainer = this.carousel.querySelector('.carousel__indicators');

		this.currentIndex = 0;
		this.slideWidth = 0;
		this.autoPlayInterval = null;
		this.isAutoPlaying = false;
		this.isDragging = false;
		this.startX = 0;
		this.currentX = 0;

		this.init();
	}

	init() {
		if (this.slides.length === 0) return;

		// Setup indicators
		this.createIndicators();

		// Setup event listeners
		this.setupEventListeners();

		// Calculate slide width
		this.updateSlideWidth();

		// Set first slide as active
		this.setActiveSlide(0);

		// Start auto-play
		this.startAutoPlay();

		// Handle window resize
		window.addEventListener('resize', () => this.updateSlideWidth(), { passive: true });

		// Handle visibility change
		document.addEventListener('visibilitychange', () => {
			if (document.hidden) {
				this.stopAutoPlay();
			} else {
				this.startAutoPlay();
			}
		});
	}

	/* ====================================
	   SLIDE NAVIGATION
	   ==================================== */

	createIndicators() {
		if (!this.indicatorsContainer) return;

		this.indicatorsContainer.innerHTML = '';
		this.indicators = [];

		this.slides.forEach((_, index) => {
			const indicator = document.createElement('button');
			indicator.className = 'carousel__indicator';
			if (index === 0) indicator.classList.add('active');
			indicator.setAttribute('aria-label', `Ir a diapositiva ${index + 1}`);
			indicator.addEventListener('click', () => this.goToSlide(index));
			this.indicatorsContainer.appendChild(indicator);
			this.indicators.push(indicator);
		});
	}

	next() {
		const nextIndex = (this.currentIndex + 1) % this.slides.length;
		this.goToSlide(nextIndex);
		this.resetAutoPlay();
	}

	prev() {
		const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
		this.goToSlide(prevIndex);
		this.resetAutoPlay();
	}

	goToSlide(index) {
		if (index < 0 || index >= this.slides.length) return;

		this.currentIndex = index;
		this.updateSlidePosition();
		this.updateActiveIndicator();
		this.updateButtonStates();
	}

	updateSlidePosition() {
		const offset = -this.currentIndex * (this.slideWidth + this.getGap());
		this.track.style.transform = `translateX(${offset}px)`;

		// Update slide active state
		this.slides.forEach((slide, index) => {
			if (index === this.currentIndex) {
				slide.classList.add('active');
			} else {
				slide.classList.remove('active');
			}
		});
	}

	updateActiveIndicator() {
		if (!this.indicators) return;

		this.indicators.forEach((indicator, index) => {
			if (index === this.currentIndex) {
				indicator.classList.add('active');
			} else {
				indicator.classList.remove('active');
			}
		});
	}

	updateButtonStates() {
		if (this.prevBtn && this.nextBtn) {
			// Enable/disable based on carousel loop or single pass
			this.prevBtn.disabled = false;
			this.nextBtn.disabled = false;
		}
	}

	/* ====================================
	   SLIDE DIMENSIONS
	   ==================================== */

	updateSlideWidth() {
		if (this.slides.length === 0) return;

		const slide = this.slides[0];
		const rect = slide.getBoundingClientRect();
		this.slideWidth = rect.width;
	}

	getGap() {
		const style = window.getComputedStyle(this.track);
		const gap = style.gap || '0';
		return parseFloat(gap);
	}

	/* ====================================
	   AUTO-PLAY
	   ==================================== */

	startAutoPlay() {
		if (this.isAutoPlaying || this.slides.length <= 1) return;

		this.isAutoPlaying = true;
		this.carousel.classList.add('auto-playing');

		this.autoPlayInterval = setInterval(() => {
			this.next();
		}, 5000); // Change slide every 5 seconds
	}

	stopAutoPlay() {
		if (this.autoPlayInterval) {
			clearInterval(this.autoPlayInterval);
			this.autoPlayInterval = null;
		}
		this.isAutoPlaying = false;
		this.carousel.classList.remove('auto-playing');
	}

	resetAutoPlay() {
		this.stopAutoPlay();
		this.startAutoPlay();
	}

	/* ====================================
	   EVENT LISTENERS
	   ==================================== */

	setupEventListeners() {
		// Button clicks
		if (this.prevBtn) {
			this.prevBtn.addEventListener('click', () => this.prev());
		}
		if (this.nextBtn) {
			this.nextBtn.addEventListener('click', () => this.next());
		}

		// Keyboard navigation
		document.addEventListener('keydown', (e) => this.handleKeyboard(e));

		// Touch events for mobile
		this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
		this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
		this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

		// Mouse drag events
		this.track.addEventListener('mousedown', (e) => this.handleMouseDown(e));
		this.track.addEventListener('mousemove', (e) => this.handleMouseMove(e));
		this.track.addEventListener('mouseup', (e) => this.handleMouseUp(e));
		this.track.addEventListener('mouseleave', (e) => this.handleMouseUp(e));

		// Pause on hover
		this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay(), { passive: true });
		this.carousel.addEventListener('mouseleave', () => this.startAutoPlay(), { passive: true });
	}

	handleKeyboard(e) {
		if (e.key === 'ArrowLeft') {
			this.prev();
		} else if (e.key === 'ArrowRight') {
			this.next();
		}
	}

	/* ====================================
	   TOUCH HANDLING
	   ==================================== */

	handleTouchStart(e) {
		this.isDragging = true;
		this.startX = e.touches[0].clientX;
		this.track.style.scrollBehavior = 'auto';
		this.stopAutoPlay();
	}

	handleTouchMove(e) {
		if (!this.isDragging) return;
		this.currentX = e.touches[0].clientX;
	}

	handleTouchEnd(e) {
		if (!this.isDragging) return;

		this.isDragging = false;
		this.track.style.scrollBehavior = 'smooth';

		const diff = this.startX - this.currentX;
		const threshold = this.slideWidth * 0.2;

		if (Math.abs(diff) > threshold) {
			if (diff > 0) {
				this.next();
			} else {
				this.prev();
			}
		}

		this.resetAutoPlay();
	}

	/* ====================================
	   MOUSE DRAG HANDLING
	   ==================================== */

	handleMouseDown(e) {
		this.isDragging = true;
		this.startX = e.clientX;
		this.track.style.cursor = 'grabbing';
		this.stopAutoPlay();
	}

	handleMouseMove(e) {
		if (!this.isDragging) return;
		this.currentX = e.clientX;
	}

	handleMouseUp(e) {
		if (!this.isDragging) return;

		this.isDragging = false;
		this.track.style.cursor = 'grab';

		const diff = this.startX - this.currentX;
		const threshold = this.slideWidth * 0.2;

		if (Math.abs(diff) > threshold) {
			if (diff > 0) {
				this.next();
			} else {
				this.prev();
			}
		}

		this.resetAutoPlay();
	}

	/* ====================================
	   UTILITY METHODS
	   ==================================== */

	destroy() {
		this.stopAutoPlay();
		if (this.prevBtn) this.prevBtn.removeEventListener('click', () => this.prev());
		if (this.nextBtn) this.nextBtn.removeEventListener('click', () => this.next());
	}

	getTotalSlides() {
		return this.slides.length;
	}

	getCurrentIndex() {
		return this.currentIndex;
	}

	setAutoPlayInterval(ms) {
		this.stopAutoPlay();
		this.autoPlayInterval = setInterval(() => {
			this.next();
		}, ms);
		this.isAutoPlaying = true;
	}
}

/* ====================================
   MULTIPLE CAROUSELS SUPPORT
   ==================================== */

document.addEventListener('DOMContentLoaded', () => {
	const carousels = document.querySelectorAll('[data-carousel]');
	window.carouselInstances = [];

	carousels.forEach((carouselElement) => {
		const carousel = new Carousel(carouselElement);
		window.carouselInstances.push(carousel);
	});

	// Global access
	window.Carousel = Carousel;
});

/* ====================================
   EXPORT FOR MODULE SYSTEMS
   ==================================== */

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Carousel;
}
