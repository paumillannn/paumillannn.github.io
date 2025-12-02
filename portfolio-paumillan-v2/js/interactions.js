/**
 * INTERACTIONS.JS - MICRO-INTERACTIONS & UI EFFECTS
 * ==================================================
 * Handles hover effects, button animations, and form interactions
 */

class InteractionController {
	constructor() {
		this.init();
	}

	init() {
		this.setupHoverEffects();
		this.setupClickEffects();
		this.setupButtonAnimations();
	}

	/**
	 * Setup hover effects on interactive elements
	 */
	setupHoverEffects() {
		const cards = document.querySelectorAll('.project-card, .timeline__content, .stat');

		cards.forEach(card => {
			card.addEventListener('mouseenter', (e) => {
				this.createRippleEffect(e, card);
				card.classList.add('hover-active');
			});

			card.addEventListener('mouseleave', () => {
				card.classList.remove('hover-active');
			});

			card.addEventListener('mousemove', (e) => {
				this.updateCardGradient(e, card);
			});
		});

		// Button hover effects
		this.setupButtonHovers();
	}

	setupButtonHovers() {
		const buttons = document.querySelectorAll('.btn, .contact__btn, .carousel__btn');

		buttons.forEach(button => {
			button.addEventListener('mouseenter', (e) => {
				this.createButtonGlow(e, button);
			});

			button.addEventListener('mouseleave', () => {
				const glow = button.querySelector('.button-glow');
				if (glow) glow.remove();
			});
		});
	}

	createRippleEffect(e, element) {
		const ripple = document.createElement('span');
		ripple.classList.add('ripple');
		
		const rect = element.getBoundingClientRect();
		const size = Math.max(rect.width, rect.height);
		const x = e.clientX - rect.left - size / 2;
		const y = e.clientY - rect.top - size / 2;

		ripple.style.cssText = `
			position: absolute;
			width: ${size}px;
			height: ${size}px;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.3);
			left: ${x}px;
			top: ${y}px;
			animation: ripple-animation 600ms ease-out forwards;
			pointer-events: none;
		`;

		if (window.getComputedStyle(element).position === 'static') {
			element.style.position = 'relative';
		}

		element.appendChild(ripple);
		setTimeout(() => ripple.remove(), 600);
	}

	createButtonGlow(e, button) {
		const rect = button.getBoundingClientRect();
		const glow = document.createElement('div');
		glow.classList.add('button-glow');
		glow.style.cssText = `
			position: absolute;
			width: 100%;
			height: 100%;
			border-radius: inherit;
			background: radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, 
				rgba(102, 126, 234, 0.3), transparent 80%);
			pointer-events: none;
			top: 0;
			left: 0;
		`;

		if (window.getComputedStyle(button).position === 'static') {
			button.style.position = 'relative';
		}

		button.appendChild(glow);
	}

	updateCardGradient(e, card) {
		const rect = card.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		card.style.background = `
			radial-gradient(circle at ${x}px ${y}px, 
				rgba(102, 126, 234, 0.1), 
				rgba(255, 255, 255, 0.02))
		`;
	}

	/**
	 * Setup click effects
	 */
	setupClickEffects() {
		document.addEventListener('click', (e) => {
			const clickable = e.target.closest('button, a[href], [data-clickable]');
			if (clickable) {
				clickable.classList.add('clicked');
				setTimeout(() => {
					clickable.classList.remove('clicked');
				}, 200);
			}
		});
	}

	/**
	 * Setup button press animations
	 */
	setupButtonAnimations() {
		const buttons = document.querySelectorAll('.btn, button');

		buttons.forEach(button => {
			button.addEventListener('mousedown', (e) => {
				this.createPressAnimation(e, button);
			});
		});
	}

	createPressAnimation(e, button) {
		const rect = button.getBoundingClientRect();
		const size = Math.max(rect.width, rect.height);
		const x = e.clientX - rect.left - size / 2;
		const y = e.clientY - rect.top - size / 2;

		const wave = document.createElement('span');
		wave.className = 'button-wave';
		wave.style.cssText = `
			position: absolute;
			width: ${size}px;
			height: ${size}px;
			background: rgba(255, 255, 255, 0.2);
			border-radius: 50%;
			left: ${x}px;
			top: ${y}px;
			animation: wave-out 400ms ease-out forwards;
			pointer-events: none;
		`;

		if (window.getComputedStyle(button).position === 'static') {
			button.style.position = 'relative';
		}

		button.appendChild(wave);
		setTimeout(() => wave.remove(), 400);
	}
}

/**
 * Add ripple and wave animations
 */
const style = document.createElement('style');
style.textContent = `
	@keyframes ripple-animation {
		from {
			opacity: 1;
			transform: scale(0);
		}
		to {
			opacity: 0;
			transform: scale(1);
		}
	}

	@keyframes wave-out {
		from {
			opacity: 1;
			transform: scale(0);
		}
		to {
			opacity: 0;
			transform: scale(1);
		}
	}

	.clicked {
		transform: scale(0.98);
	}
`;
document.head.appendChild(style);

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
	window.interactionController = new InteractionController();
});

	animateCard(card, type) {
		if (type === 'enter') {
			card.style.animation = 'scaleIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
		} else {
			card.style.animation = 'scaleIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1) reverse forwards';
		}
	}

	/* ====================================
	   COPY TO CLIPBOARD
	   ==================================== */

	setupCopyToClipboard() {
		const copyButtons = document.querySelectorAll('[data-copy]');

		copyButtons.forEach(button => {
			button.addEventListener('click', (e) => {
				e.preventDefault();
				const textToCopy = button.dataset.copy;
				this.copyToClipboard(textToCopy, button);
			});
		});

		// Also support email copy
		const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
		emailLinks.forEach(link => {
			link.addEventListener('contextmenu', (e) => {
				e.preventDefault();
				const email = link.href.replace('mailto:', '');
				this.copyToClipboard(email, link);
			});
		});
	}

	copyToClipboard(text, element) {
		// Use modern Clipboard API
		if (navigator.clipboard) {
			navigator.clipboard.writeText(text).then(() => {
				this.showCopyFeedback(element);
			}).catch(err => {
				console.error('Failed to copy:', err);
				this.fallbackCopyToClipboard(text, element);
			});
		} else {
			this.fallbackCopyToClipboard(text, element);
		}
	}

	fallbackCopyToClipboard(text, element) {
		const textarea = document.createElement('textarea');
		textarea.value = text;
		textarea.style.position = 'fixed';
		textarea.style.opacity = '0';
		document.body.appendChild(textarea);
		textarea.select();
		
		try {
			document.execCommand('copy');
			this.showCopyFeedback(element);
		} catch (err) {
			console.error('Fallback copy failed:', err);
		}
		
		document.body.removeChild(textarea);
	}

	showCopyFeedback(element) {
		const originalText = element.textContent || element.innerText;
		const originalClass = element.className;

		element.textContent = '✓ Copiado';
		element.classList.add('copied');

		setTimeout(() => {
			element.textContent = originalText;
			element.className = originalClass;
		}, 2000);
	}

	/* ====================================
	   TOOLTIP INTERACTIONS
	   ==================================== */

	createTooltip(element, text, position = 'top') {
		const tooltip = document.createElement('div');
		tooltip.className = 'tooltip';
		tooltip.textContent = text;
		tooltip.style.cssText = `
			position: absolute;
			background: rgba(0, 0, 0, 0.9);
			color: white;
			padding: 8px 12px;
			border-radius: 4px;
			font-size: 12px;
			z-index: 10000;
			white-space: nowrap;
			animation: fadeIn 300ms ease-out forwards;
			pointer-events: none;
		`;

		document.body.appendChild(tooltip);

		const rect = element.getBoundingClientRect();
		let top, left;

		switch(position) {
			case 'top':
				top = rect.top - 35;
				left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;
				break;
			case 'bottom':
				top = rect.bottom + 10;
				left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;
				break;
			case 'left':
				top = rect.top + rect.height / 2 - tooltip.offsetHeight / 2;
				left = rect.left - tooltip.offsetWidth - 10;
				break;
			case 'right':
				top = rect.top + rect.height / 2 - tooltip.offsetHeight / 2;
				left = rect.right + 10;
				break;
		}

		tooltip.style.top = `${top}px`;
		tooltip.style.left = `${left}px`;

		return tooltip;
	}

	/* ====================================
	   SCROLL LOCK
	   ==================================== */

	lockScroll() {
		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		document.body.style.overflow = 'hidden';
		document.body.style.paddingRight = `${scrollbarWidth}px`;
	}

	unlockScroll() {
		document.body.style.overflow = '';
		document.body.style.paddingRight = '';
	}

	/* ====================================
	   KEYBOARD SHORTCUTS
	   ==================================== */

	setupKeyboardShortcuts() {
		document.addEventListener('keydown', (e) => {
			// Ctrl/Cmd + K for search
			if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
				e.preventDefault();
				this.openSearch();
			}

			// Escape to close modals
			if (e.key === 'Escape') {
				this.closeModals();
			}

			// Arrow keys for carousel
			if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
				this.handleCarouselKeyboard(e);
			}
		});
	}

	openSearch() {
		// Search functionality
	}

	closeModals() {
		// Modals closed
	}

	handleCarouselKeyboard(e) {
		if (window.carouselInstances && window.carouselInstances.length > 0) {
			const carousel = window.carouselInstances[0];
			if (e.key === 'ArrowLeft') carousel.prev();
			if (e.key === 'ArrowRight') carousel.next();
		}
	}
}

/* ====================================
   RIPPLE AND WAVE ANIMATIONS
   ==================================== */

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
	@keyframes ripple-animation {
		from {
			opacity: 1;
			transform: scale(0);
		}
		to {
			opacity: 0;
			transform: scale(1);
		}
	}

	@keyframes wave-out {
		from {
			opacity: 1;
			transform: scale(0);
		}
		to {
			opacity: 0;
			transform: scale(1);
		}
	}

	@keyframes expand-glow {
		from {
			width: 0;
		}
		to {
			width: 100%;
		}
	}

	.clicked {
		transform: scale(0.98);
	}

	.copied {
		animation: pulse 300ms ease-out;
	}

	@keyframes pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.05); }
	}
`;
document.head.appendChild(style);

/* ====================================
   INITIALIZATION
   ==================================== */

document.addEventListener('DOMContentLoaded', () => {
	window.interactionController = new InteractionController();
	window.interactionController.setupKeyboardShortcuts();
});

/* ====================================
   EXPORT FOR MODULE SYSTEMS
   ==================================== */

if (typeof module !== 'undefined' && module.exports) {
	module.exports = InteractionController;
}
