// ===================================
// ⚙️ CONFIGURACIÓN DE FILTROS
// ===================================
const filterConfig = {
    plano: [
        { value: 'all', label: 'Todos' },
        { value: 'rostro', label: 'Rostro' },
        { value: 'medio', label: 'Plano Medio' },
        { value: 'americano', label: 'Plano Americano' },
        { value: 'completo', label: 'Cuerpo Completo' }
    ],
    look: [
        { value: 'all', label: 'Todos' },
        { value: 'casual', label: 'Casual' },
       // { value: 'corporativo', label: 'Corporativo' },
        { value: 'formal', label: 'Formal' },
        { value: 'deportivo', label: 'Deportivo' },
      //  { value: 'exterior', label: 'Exterior' },
        { value: 'estudio', label: 'Estudio' },
    //    { value: 'artístico', label: 'Artístico' },
      //  { value: 'vintage', label: 'Vintage' }
    ]
};

// ===================================
// 📸 DATOS DE IMÁGENES
// ===================================
const galleryData = [
    {
        id: 1,
        src: "images/Casual/Plano_Americano_Clasico.JPG",
        alt: "Plano Americano Clásico|15 sept 2026",
        plano: ["americano"],
        look: ["casual", "estudio"]
    },
    {
        id: 2,
        src: "images/Deportivo/Plano_Medio_Deportista.JPG",
        alt: "Plano medio|15 sept 2026",
        plano: ["medio"],
        look: ["Estudio", "Deportivo"]
    },
    {
        id: 3,
        src: "images/Casual/Plano_medio_casul.jpg",
        alt: "Plano medio casual|15 sept 2026",
        plano: ["americano"],
        look: ["casual", "estudio"]
    }
    /* ,
    {
        id: 4,
        src: "images/gallery-04.jpg",
        alt: "Cuerpo completo exterior",
        plano: ["completo"],
        look: ["deportivo", "exterior"]
    },
    {
        id: 5,
        src: "images/gallery-05.jpg",
        alt: "Retrato formal",
        plano: ["rostro"],
        look: ["formal", "estudio"]
    },
    {
        id: 6,
        src: "images/gallery-06.jpg",
        alt: "Plano medio estudio",
        plano: ["medio"],
        look: ["estudio", "casual"]
    } */
];

// ===================================
// VARIABLES GLOBALES
// ===================================
let activePlanoFilter = 'all';
let activeLookFilter = 'all';
let currentImageIndex = 0;
let visibleImages = [];

// ===================================
// NAVEGACIÓN MÓVIL
// ===================================
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// ===================================
// 🔘 GENERAR BOTONES DE FILTRO DINÁMICAMENTE
// ===================================
function renderFilterButtons() {
    // Generar botones de PLANO
    const planoContainer = document.getElementById('plano-filters');
    planoContainer.innerHTML = '';
    
    filterConfig.plano.forEach((filter, index) => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn' + (index === 0 ? ' active' : '');
        btn.dataset.filter = filter.value;
        btn.textContent = filter.label;
        
        btn.addEventListener('click', () => {
            planoContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activePlanoFilter = filter.value;
            renderGallery();
        });
        
        planoContainer.appendChild(btn);
    });
    
    // Generar botones de LOOK
    const lookContainer = document.getElementById('look-filters');
    lookContainer.innerHTML = '';
    
    filterConfig.look.forEach((filter, index) => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn' + (index === 0 ? ' active' : '');
        btn.dataset.look = filter.value;
        btn.textContent = filter.label;
        
        btn.addEventListener('click', () => {
            lookContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeLookFilter = filter.value;
            renderGallery();
        });
        
        lookContainer.appendChild(btn);
    });
}

// ===================================
// 🖼️ RENDERIZAR GALERÍA
// ===================================
function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    grid.innerHTML = '';
    
    const filteredImages = galleryData.filter(img => {
        const matchesPlano = activePlanoFilter === 'all' || img.plano.includes(activePlanoFilter);
        const matchesLook = activeLookFilter === 'all' || img.look.includes(activeLookFilter);
        return matchesPlano && matchesLook;
    });
    
    if (filteredImages.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #7f8c8d; grid-column: 1/-1; padding: 40px;">No hay imágenes que coincidan con los filtros seleccionados.</p>';
        return;
    }
    
    filteredImages.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.index = index;
        
        item.innerHTML = `
            <img src="${img.src}" alt="${img.alt}" loading="lazy">
            <div class="gallery-overlay">
                <span>Ver Imagen</span>
            </div>
        `;
        
        item.addEventListener('click', () => {
            visibleImages = filteredImages;
            currentImageIndex = index;
            openLightbox();
        });
        
        grid.appendChild(item);
    });
}

// ===================================
// 🔍 LIGHTBOX
// ===================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

function openLightbox() {
    const img = visibleImages[currentImageIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
    openLightbox();
});

lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
    openLightbox();
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') {
        currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
        openLightbox();
    } else if (e.key === 'ArrowRight') {
        currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
        openLightbox();
    }
});

// ===================================
// ✨ ANIMACIONES AL SCROLL
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// ===================================
// 🔄 SMOOTH SCROLL
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});

// ===================================
// 📅 AÑO ACTUAL EN FOOTER
// ===================================
document.getElementById('current-year').textContent = new Date().getFullYear();

// ===================================
// 🚀 INICIALIZACIÓN
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    renderFilterButtons();
    renderGallery();
    
    const animatedElements = document.querySelectorAll(
        '.section-title, .about-grid, .gallery-grid, .experience-card, .data-card, .contact-buttons'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

console.log('Portfolio de Daniel Pérez cargado correctamente 🎬');