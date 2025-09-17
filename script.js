document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({ once: true, duration: 1000 });

    // ================== MOBILE MENU ==================
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    if (menuBtn) {
        menuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });
    }

    if (mobileMenu) {
        mobileMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => mobileMenu.classList.add("hidden"));
        });
    }

    // ================== FOOTER SUBSCRIBE FORM ==================
    const footerForm = document.querySelector("footer form");
    if (footerForm) {
        footerForm.addEventListener("submit", e => {
            e.preventDefault();
            const emailInput = footerForm.querySelector("input[type='email']");
            const email = emailInput.value.trim();
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase())) {
                showToast("Please enter a valid email address.", "error");
                return;
            }
            showToast("Thank you for subscribing!", "success");
            emailInput.value = "";
        });
    }

    // ================== TOAST ==================
    const toast = document.createElement("div");
    toast.id = "toast-notification";
    document.body.appendChild(toast);
    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = 'fixed bottom-8 right-8 text-white py-3 px-6 rounded-full shadow-lg transform translate-y-0 opacity-100 transition-all duration-500';
        toast.classList.add(type === 'success' ? 'bg-green-500' : 'bg-red-500');
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
        }, 4000);
    }

    // ================== CONTACT POPUP ==================
    const openPopupBtn = document.getElementById('open-contact-popup-btn');
    const popupOverlay = document.getElementById('contact-popup-overlay');
    const popupContent = document.getElementById('contact-popup-content');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const contactForm = document.getElementById('contact-form');

    const openPopup = () => {
        if (!popupOverlay || !popupContent) return;
        popupOverlay.classList.remove('hidden', 'opacity-0');
        popupContent.classList.remove('scale-95');
    };
    const closePopup = () => {
        if (!popupOverlay || !popupContent) return;
        popupOverlay.classList.add('opacity-0');
        popupContent.classList.add('scale-95');
        setTimeout(() => popupOverlay.classList.add('hidden'), 300);
    };
    openPopupBtn?.addEventListener('click', openPopup);
    closePopupBtn?.addEventListener('click', closePopup);
    popupOverlay?.addEventListener('click', e => { if (e.target === popupOverlay) closePopup(); });

    // Initialize EmailJS
    emailjs.init("phxHnFhUaO4lREHGC");
    contactForm?.addEventListener('submit', function(event) {
        event.preventDefault();
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        emailjs.sendForm('service_xzi71tp', 'template_ymacoo9', this)
            .then(() => {
                closePopup();
                contactForm.reset();
                showToast('Message sent successfully!', 'success');
            }, (err) => {
                showToast('Failed to send message. Please try again.', 'error');
                console.error('EmailJS Error:', JSON.stringify(err));
            }).finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            });
    });

    // ================== FOOTER MODALS (Fixed for dynamic content) ==================
    function initFooterModals() {
        const privacyModal = document.getElementById('privacy-policy-modal');
        const termsModal = document.getElementById('terms-of-service-modal');
        const openPrivacyBtn = document.getElementById('open-privacy-policy-btn');
        const openTermsBtn = document.getElementById('open-terms-of-service-btn');
        const closeBtns = document.querySelectorAll('.modal-close-btn');

        if (!privacyModal || !termsModal || !openPrivacyBtn || !openTermsBtn) return;

        openPrivacyBtn.addEventListener('click', () => privacyModal.classList.remove('hidden'));
        openTermsBtn.addEventListener('click', () => termsModal.classList.remove('hidden'));

        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                privacyModal.classList.add('hidden');
                termsModal.classList.add('hidden');
            });
        });

        [privacyModal, termsModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.add('hidden');
            });
        });
    }

    initFooterModals(); // This line has been moved inside the DOMContentLoaded listener

    // ================== LIGHTBOX ==================
    const mosaicItems = document.querySelectorAll('.mosaic-item');
    const lightbox = document.getElementById('lightbox-modal');
    if (mosaicItems.length && lightbox) {
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');
        let currentIndex = 0;

        function showLightbox(index) {
            const img = mosaicItems[index].querySelector('img').src;
            lightboxImage.src = img;
            lightbox.classList.remove('hidden');
            currentIndex = index;
        }
        function hideLightbox() { lightbox.classList.add('hidden'); }

        mosaicItems.forEach((item, idx) => item.addEventListener('click', () => showLightbox(idx)));
        lightboxClose.addEventListener('click', hideLightbox);
        lightboxPrev.addEventListener('click', () => showLightbox((currentIndex - 1 + mosaicItems.length) % mosaicItems.length));
        lightboxNext.addEventListener('click', () => showLightbox((currentIndex + 1) % mosaicItems.length));
        lightbox.addEventListener('click', e => { if (e.target === lightbox) hideLightbox(); });
    }

    // ================== MOBILE GALLERY SLIDER ==================
    const galleryGrid = document.querySelector('.gallery-grid');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    const slides = document.querySelectorAll('.gallery-item');
    let sliderIndex = 0;

    function updateSlider() {
        if (window.innerWidth <= 768 && galleryGrid) {
            galleryGrid.style.transform = `translateX(-${sliderIndex * 100}%)`;
            if (prevBtn) prevBtn.style.display = sliderIndex === 0 ? 'none' : 'block';
            if (nextBtn) nextBtn.style.display = sliderIndex === slides.length - 1 ? 'none' : 'block';
        } else if (galleryGrid) {
            galleryGrid.style.transform = 'translateX(0)';
            sliderIndex = 0;
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
        }
    }
    prevBtn?.addEventListener('click', () => { if (sliderIndex > 0) sliderIndex--; updateSlider(); });
    nextBtn?.addEventListener('click', () => { if (sliderIndex < slides.length - 1) sliderIndex++; updateSlider(); });
    window.addEventListener('resize', updateSlider);
    updateSlider();
});
