document.addEventListener('DOMContentLoaded', function() {
    // --- Active Navigation Link on Scroll ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav a');

    function activateNavLink() {
        let current = '';
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        sections.forEach(section => {
            // Giảm offset để kích hoạt sớm hơn một chút
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', activateNavLink);
    activateNavLink(); // Call on load to set initial active link

    // --- Smooth Scrolling for Navigation Links ---
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
            // Update active class immediately on click
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // --- New: Animate Elements on Scroll (Intersection Observer) ---
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 // Kích hoạt khi 20% của phần tử hiển thị trong viewport
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // Kích hoạt animation cho đường kẻ tiêu đề
                const heading = entry.target.querySelector('.section-heading');
                if (heading) {
                    heading.classList.add('animate-line');
                    // Lưu chiều rộng cuối cùng của đường kẻ để dùng trong CSS variable
                    // Adjusted to correctly find the text element inside the heading
                    const h2TextElement = heading.querySelector('h2');
                    const initialLineWidth = h2TextElement ? h2TextElement.offsetWidth : 0;
                    // Ensure calculation accounts for margin-left of the ::after pseudo-element (20px)
                    heading.style.setProperty('--final-line-width', `calc(100% - ${initialLineWidth}px - 20px)`);
                }
                observer.unobserve(entry.target); // Ngừng quan sát sau khi đã hiển thị
            }
        });
    }, observerOptions);

    animateOnScrollElements.forEach(element => {
        observer.observe(element);
    });

    // Handle initial load visibility for elements already in view
    // This will trigger the animation for sections already visible on page load
    const initialCheckObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                const heading = entry.target.querySelector('.section-heading');
                if (heading) {
                    heading.classList.add('animate-line');
                    const h2TextElement = heading.querySelector('h2');
                    const initialLineWidth = h2TextElement ? h2TextElement.offsetWidth : 0;
                    heading.style.setProperty('--final-line-width', `calc(100% - ${initialLineWidth}px - 20px)`);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); // Lower threshold for initial check

    // Observe all sections for initial check
    sections.forEach(section => {
        initialCheckObserver.observe(section);
    });
});