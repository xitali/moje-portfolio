// Czekamy na załadowanie całej strony
document.addEventListener('DOMContentLoaded', function() {
    // Ukrywamy preloader po załadowaniu strony
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            preloader.classList.add('hidden');
        });
    }

    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
            const expanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
            hamburger.setAttribute('aria-expanded', !expanded);
            // Blokuj przewijanie strony, gdy menu jest otwarte
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });
        
        // Zamknij menu po kliknięciu linku
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto'; // Przywraca przewijanie
            });
        });

        // Zamknij menu po kliknięciu poza nim
        document.addEventListener('click', (e) => {
            const isClickInsideNav = navLinks.contains(e.target) || hamburger.contains(e.target);
            if (!isClickInsideNav && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto'; // Przywraca przewijanie
            }
        });
    }

    // Obsługa trybu ciemnego
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Sprawdzamy, czy użytkownik wcześniej wybrał tryb ciemny
    const darkMode = localStorage.getItem('darkMode');
    
    // Jeśli tak, aktywujemy go
    if(darkMode === 'enabled'){
        body.classList.add('dark');
        const icon = themeToggle?.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Przełączamy klasę dark na elemencie body
            body.classList.toggle('dark');
            
            // Zmieniamy ikonę
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-moon');
                icon.classList.toggle('fa-sun');
            }
            
            // Zapisujemy preferencję użytkownika
            if(body.classList.contains('dark')){
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }
    
    // Obsługa filtrów w portfolio
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if(filterButtons.length && projectCards.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Usuwamy klasę active ze wszystkich przycisków
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Dodajemy klasę active do klikniętego przycisku
                button.classList.add('active');
                
                // Pobieramy filtr z atrybutu data-filter
                const filter = button.getAttribute('data-filter');
                
                // Filtrujemy projekty
                projectCards.forEach(card => {
                    if(filter === 'all') {
                        card.style.display = 'block';
                    } else {
                        const category = card.getAttribute('data-category');
                        if(category === filter) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
    }
    
    // Obsługa formularza kontaktowego
    const contactForm = document.getElementById('contact-form');
    
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Pobieramy dane z formularza
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Tutaj możesz dodać kod wysyłający dane do serwera
            // Na razie tylko wyświetlamy komunikat
            alert(`Dziękujemy ${name}! Twoja wiadomość została wysłana. Skontaktujemy się z Tobą wkrótce.`);
            
            // Czyszczenie formularza
            contactForm.reset();
        });
    }
    
    // Inicjalizacja animacji GSAP (jeśli biblioteka jest dostępna)
    function animateElements(selector, options = {}) {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.log('GSAP nie został załadowany. Używane są animacje CSS.');
            return;
        }

        // Sprawdzamy prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            // Jeśli użytkownik preferuje zredukowane animacje, ustawiamy elementy na widoczne
            document.querySelectorAll(selector).forEach(element => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            });
            return;
        }

        gsap.from(selector, {
            duration: options.duration || 1,
            opacity: 0,
            y: options.y || 30,
            stagger: options.stagger || 0,
            ease: options.ease || 'power2.out',
            delay: options.delay || 0,
            scrollTrigger: options.scrollTrigger || null
        });
    }

    // Animacje dla sekcji hero
    animateElements('.animate-text', { stagger: 0.3, ease: 'power3.out' });
    animateElements('.animate-btn', { y: 20, stagger: 0.2, delay: 0.5 });

    // Animacje dla elementów przy przewijaniu
    gsap.utils.toArray('.animate-box').forEach(box => {
        animateElements(box, {
            y: 50,
            scrollTrigger: {
                trigger: box,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Animacje dla portfolio
    if (document.querySelector('.projects-grid')) {
        animateElements('.project-card', {
            y: 30,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.projects-grid',
                start: 'top 80%'
            }
        });
    }

    // Animacje dla formularza kontaktowego
    if (document.querySelector('.contact-form')) {
        animateElements('.contact-form', {
            y: 30,
            scrollTrigger: {
                trigger: '.contact-form',
                start: 'top 80%'
            }
        });
    }

    // Animacje dla informacji kontaktowych
    if (document.querySelector('.contact-info')) {
        animateElements('.contact-info', {
            y: 30,
            scrollTrigger: {
                trigger: '.contact-info',
                start: 'top 80%'
            }
        });
    }
});

// Animacja zmiany kolorów tła przy przewijaniu (opcjonalna)
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    if(hero) {
        const scrollPosition = window.pageYOffset;
        const heroHeight = hero.offsetHeight;
        const scrollPercentage = scrollPosition / heroHeight;
        
        // Zmieniamy kolory tła w zależności od pozycji przewijania
        if(scrollPercentage <= 1) {
            const hue1 = 195 - scrollPercentage * 20; // Startowy kolor niebieski (195)
            const hue2 = 210 + scrollPercentage * 20; // Końcowy kolor fioletowy (210+)
            hero.style.background = `linear-gradient(135deg, hsl(${hue1}, 100%, 50%), hsl(${hue2}, 70%, 50%))`;
        }
    }
});

// Płynne przewijanie do sekcji po kliknięciu linków
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});