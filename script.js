// Función para mostrar el modal con la imagen y descripción
function showImageModal(imageSrc, description) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalText = document.getElementById('modalText');
    
    modalImage.src = imageSrc;
    modalText.textContent = description;
    modal.style.display = 'block';
    
    // Agregar animación de entrada
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    // Prevenir el scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.opacity = '0';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Cerrar modal al hacer clic fuera de la imagen
window.addEventListener('click', function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Cerrar modal con la tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Efectos de carga de página
document.addEventListener('DOMContentLoaded', function() {
    // Animación de entrada para los elementos de la galería
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
    
    // Animación del héroe
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(-30px)';
        
        setTimeout(() => {
            hero.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 200);
    }
});

// Función para precargar imágenes (mejora la experiencia del usuario)
function preloadImages() {
    const images = document.querySelectorAll('.gallery-item img');
    images.forEach(img => {
        const imagePreload = new Image();
        imagePreload.src = img.src;
    });
}

// Ejecutar precarga cuando la página esté completamente cargada
window.addEventListener('load', preloadImages);

// Función para manejar errores de carga de imágenes
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const parent = this.closest('.gallery-item');
            if (parent) {
                parent.style.display = 'none';
            }
        });
    });
});

// Variables del carrusel
let currentSlide = 0;
let totalSlides = 0;
let carouselTrack = null;
let indicators = null;
let autoSlideInterval = null;

// Función para inicializar el carrusel
function initializeCarousel() {
    carouselTrack = document.getElementById('carouselTrack');
    indicators = document.querySelectorAll('.indicator');
    
    if (carouselTrack) {
        totalSlides = carouselTrack.children.length;
        updateCarousel();
        startAutoSlide();
    }
}

// Función para ir a la siguiente imagen
function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
    resetAutoSlide();
}

// Función para ir a la imagen anterior
function previousSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
    resetAutoSlide();
}

// Función para ir a una imagen específica
function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
    resetAutoSlide();
}

// Función para actualizar la posición del carrusel
function updateCarousel() {
    if (carouselTrack) {
        const translateX = -currentSlide * 100;
        carouselTrack.style.transform = `translateX(${translateX}%)`;
        
        // Actualizar indicadores
        if (indicators) {
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
        }
        
        // Actualizar clases activas para animaciones
        const slides = carouselTrack.children;
        Array.from(slides).forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
    }
}

// Función para iniciar el auto-slide
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        nextSlide();
    }, 5000); // Cambia cada 5 segundos
}

// Función para resetear el auto-slide
function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Función para pausar el auto-slide cuando el usuario interactúa
function pauseAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Función para reanudar el auto-slide
function resumeAutoSlide() {
    startAutoSlide();
}

// Soporte para gestos táctiles en móviles
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const difference = touchStartX - touchEndX;
    
    if (Math.abs(difference) > swipeThreshold) {
        if (difference > 0) {
            nextSlide(); // Swipe izquierda = siguiente
        } else {
            previousSlide(); // Swipe derecha = anterior
        }
    }
}

// Soporte para teclado
function handleKeyDown(e) {
    if (document.querySelector('.carousel-section')) {
        switch(e.key) {
            case 'ArrowLeft':
                previousSlide();
                break;
            case 'ArrowRight':
                nextSlide();
                break;
            case ' ': // Barra espaciadora
                e.preventDefault();
                nextSlide();
                break;
        }
    }
}

// Función para navegación suave entre páginas (efecto visual)
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Agregar efecto de transición suave
            document.body.style.transition = 'opacity 0.3s ease';
            document.body.style.opacity = '0.8';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 150);
        });
    });
    
    // Inicializar carrusel si existe
    initializeCarousel();
    
    // Agregar event listeners para el carrusel
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
        // Pausar auto-slide al pasar el mouse
        carouselWrapper.addEventListener('mouseenter', pauseAutoSlide);
        carouselWrapper.addEventListener('mouseleave', resumeAutoSlide);
        
        // Soporte táctil
        carouselWrapper.addEventListener('touchstart', handleTouchStart, { passive: true });
        carouselWrapper.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    // Soporte de teclado
    document.addEventListener('keydown', handleKeyDown);
});
