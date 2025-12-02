/**
 * PORTFOLIO - MAIN APPLICATION
 * ==============================
 * Core functionality for portfolio website
 * - Scroll observers and fade animations
 * - Parallax effects
 * - Navigation smooth scrolling
 * - Accessibility features
 */

class Portfolio {
	constructor() {
		this.init();
	}

	init() {
		document.addEventListener('DOMContentLoaded', () => {
			this.setupScrollObserver();
			this.setupNavigation();
			this.setupParallax();
			this.setupFooter();
			this.setupAccessibility();
		});
	}

	/**
	 * Setup Intersection Observer for scroll-triggered animations
	 */
	setupScrollObserver() {
		const observerOptions = {
			threshold: 0.1,
			rootMargin: '0px 0px -50px 0px'
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
					observer.unobserve(entry.target);
				}
			});
		}, observerOptions);

		document.querySelectorAll('[data-scroll-fade]').forEach(el => {
			observer.observe(el);
		});
	}

	/**
	 * Setup parallax scrolling effects
	 */
	setupParallax() {
		const parallaxElements = document.querySelectorAll('[data-parallax]');
		
		if (parallaxElements.length === 0) return;

		window.addEventListener('scroll', () => {
			const scrollY = window.scrollY;

			parallaxElements.forEach(element => {
				const speed = parseFloat(element.dataset.parallax) || 1;
				const offset = scrollY * (1 - speed) * 0.5;
				element.style.transform = `translateY(${offset}px)`;
			});
		}, { passive: true });

		this.setupHeroParallax();
	}

	/**
	 * Setup hero section parallax on mouse movement
	 */
	setupHeroParallax() {
		const heroShapes = document.querySelectorAll('.hero__shape');
		
		window.addEventListener('mousemove', (e) => {
			const mouseX = e.clientX / window.innerWidth;
			const mouseY = e.clientY / window.innerHeight;

			heroShapes.forEach((shape, index) => {
				const speed = (index + 1) * 10;
				const x = (mouseX - 0.5) * speed;
				const y = (mouseY - 0.5) * speed;
				shape.style.transform = `translate(${x}px, ${y}px)`;
			});
		}, { passive: true });
	}

	/**
	 * Setup smooth navigation scrolling
	 */
	setupNavigation() {
		const navLinks = document.querySelectorAll('[data-scroll]');
		
		navLinks.forEach(link => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				const targetId = link.getAttribute('href');
				const targetElement = document.querySelector(targetId);

				if (targetElement) {
					const headerOffset = 80;
					const elementPosition = targetElement.getBoundingClientRect().top;
					const offsetPosition = elementPosition + window.scrollY - headerOffset;

					window.scrollTo({
						top: offsetPosition,
						behavior: 'smooth'
					});

					this.updateActiveNavLink(link);
				}
			});
		});

		window.addEventListener('scroll', () => {
			this.updateNavLinkOnScroll();
		}, { passive: true });
	}

	updateActiveNavLink(activeLink) {
		document.querySelectorAll('.navbar__link').forEach(link => {
			link.classList.remove('active');
		});
		activeLink.classList.add('active');
	}

	updateNavLinkOnScroll() {
		const scrollY = window.scrollY + 100;
		const sections = document.querySelectorAll('section[id]');

		sections.forEach(current => {
			const sectionHeight = current.offsetHeight;
			const sectionTop = current.offsetTop;
			const sectionId = current.getAttribute('id');
			const navLink = document.querySelector(`.navbar__link[href="#${sectionId}"]`);

			if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
				document.querySelectorAll('.navbar__link').forEach(link => {
					link.classList.remove('active');
				});
				if (navLink) navLink.classList.add('active');
			}
		});
	}

	/**
	 * Update footer year
	 */
	setupFooter() {
		const yearElement = document.getElementById('year');
		if (yearElement) {
			yearElement.textContent = new Date().getFullYear();
		}
	}

	/**
	 * Setup accessibility features
	 */
	setupAccessibility() {
		this.addSkipLink();
		this.setupKeyboardNavigation();
	}

	addSkipLink() {
		const skipLink = document.createElement('a');
		skipLink.textContent = 'Saltar al contenido principal';
		skipLink.href = '#about';
		skipLink.style.cssText = `
			position: absolute;
			top: -40px;
			left: 0;
			background: var(--color-accent-primary);
			color: white;
			padding: 8px 16px;
			z-index: 10000;
			text-decoration: none;
		`;
		skipLink.addEventListener('focus', () => {
			skipLink.style.top = '0';
		});
		skipLink.addEventListener('blur', () => {
			skipLink.style.top = '-40px';
		});
		document.body.insertBefore(skipLink, document.body.firstChild);
	}

	setupKeyboardNavigation() {
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				// Handle escape key if needed
			}
		});
	}
}

/**
 * CERTIFICATES & INTERACTIVE ELEMENTS
 */
class CertificatesCarousel {
	constructor() {
		this.init();
	}

	init() {
		// Handle certificate clicks
		document.querySelectorAll('.clickable-cert').forEach(cert => {
			cert.addEventListener('click', (e) => {
				e.preventDefault();
				// Certificate interaction handled - PDF links removed as files don't exist
			});

			cert.addEventListener('keypress', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
				}
			});
		});

		// Handle timeline clicks to open company websites
		document.querySelectorAll('.clickable-timeline').forEach(item => {
			item.addEventListener('click', (e) => {
				e.preventDefault();
				const companyUrl = item.dataset.company;
				if (companyUrl) {
					window.open(companyUrl, '_blank');
				}
			});

			item.addEventListener('keypress', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					const companyUrl = item.dataset.company;
					if (companyUrl) {
						window.open(companyUrl, '_blank');
					}
				}
			});
		});
	}
}

/**
 * Initialize portfolio on DOM ready
 */
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		window.portfolio = new Portfolio();
		window.certificatesCarousel = new CertificatesCarousel();
	});
} else {
	window.portfolio = new Portfolio();
	window.certificatesCarousel = new CertificatesCarousel();
}
