// Initialize AOS
AOS.init({ once: true, duration: 1000 });

// ================== MOBILE MENU ==================
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
if(menuBtn){
    menuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
    });
}


// ================== FOOTER SUBSCRIBE FORM ==================
const footerForm = document.querySelector("footer form");
if (footerForm) {
  footerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = footerForm.querySelector("input[type='email']");
    const email = emailInput.value.trim();
    if (email === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase())) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    showToast("Thank you for subscribing!", "success");
    emailInput.value = "";
  });
}

// ================== CONTACT POPUP & EMAILJS ==================
const openPopupBtn = document.getElementById('open-contact-popup-btn');
const popupOverlay = document.getElementById('contact-popup-overlay');
const popupContent = document.getElementById('contact-popup-content');
const closePopupBtn = document.getElementById('close-popup-btn');
const contactForm = document.getElementById('contact-form');
const toast = document.getElementById('toast-notification');

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = 'fixed bottom-8 right-8 text-white py-3 px-6 rounded-full shadow-lg transform translate-y-0 opacity-100 transition-all duration-500'; // Reset and show
    toast.classList.add(type === 'success' ? 'bg-green-500' : 'bg-red-500');

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
    }, 4000);
}

const openPopup = () => {
    popupOverlay.classList.remove('hidden');
    setTimeout(() => {
        popupOverlay.classList.remove('opacity-0');
        popupContent.classList.remove('scale-95');
    }, 10);
};

const closePopup = () => {
    popupOverlay.classList.add('opacity-0');
    popupContent.classList.add('scale-95');
    setTimeout(() => {
        popupOverlay.classList.add('hidden');
    }, 300);
};
if(openPopupBtn){
    openPopupBtn.addEventListener('click', openPopup);
    closePopupBtn.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });
}


// Initialize EmailJS with your Public Key
// Go to emailjs.com, create an account, and get your keys.
(function() {
    emailjs.init({
      publicKey: "phxHnFhUaO4lREHGC", // Replace with your public key
    });
})();

if(contactForm){
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Replace with your Service ID and Template ID from EmailJS
        const serviceID = 'service_xzi71tp';
        const templateID = 'template_ymacoo9';

        emailjs.sendForm(serviceID, templateID, this)
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
}


// ================== PRIVACY POLICY & TERMS OF SERVICE MODALS ==================
const privacyPolicyModal = document.getElementById('privacy-policy-modal');
const termsOfServiceModal = document.getElementById('terms-of-service-modal');

const openPrivacyPolicyBtn = document.getElementById('open-privacy-policy-btn');
const openTermsOfServiceBtn = document.getElementById('open-terms-of-service-btn');

const closeBtns = document.querySelectorAll('.modal-close-btn');

// Function to open a modal
function openModal(modal) {
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Function to close a modal
function closeModal(modal) {
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Event Listeners for opening modals
if(openPrivacyPolicyBtn){
    openPrivacyPolicyBtn.addEventListener('click', () => openModal(privacyPolicyModal));
}
if(openTermsOfServiceBtn){
    openTermsOfServiceBtn.addEventListener('click', () => openModal(termsOfServiceModal));
}


// Event Listeners for closing modals using the 'X' button
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        closeModal(privacyPolicyModal);
        closeModal(termsOfServiceModal);
    });
});

// Event Listener to close modals when clicking on the overlay
[privacyPolicyModal, termsOfServiceModal].forEach(modal => {
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    }
});

// ================== LIGHTBOX FOR CREATIONS PAGE ==================
const mosaicItems = document.querySelectorAll('.mosaic-item');
const lightbox = document.getElementById('lightbox-modal');

if (mosaicItems.length > 0 && lightbox) {
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    let currentIndex = 0;

    function showLightbox(index) {
        const item = mosaicItems[index];
        const imgSrc = item.querySelector('img').src;
        lightboxImage.src = imgSrc;
        lightbox.classList.remove('hidden');
        currentIndex = index;
    }

    function hideLightbox() {
        lightbox.classList.add('hidden');
    }

    mosaicItems.forEach((item, index) => {
        item.addEventListener('click', () => showLightbox(index));
    });

    lightboxClose.addEventListener('click', hideLightbox);
    lightboxPrev.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + mosaicItems.length) % mosaicItems.length;
        showLightbox(currentIndex);
    });
    lightboxNext.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % mosaicItems.length;
        showLightbox(currentIndex);
    });
    
    lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox) {
            hideLightbox();
        }
    });
}

// ================== GALLERY SLIDER (Mobile Only) ==================
document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.querySelector('.gallery-grid');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  const slides = document.querySelectorAll('.gallery-item');
  
  let currentIndex = 0;
  const totalSlides = slides.length;

  function updateSlider() {
    // Sirf mobile par kaam kare
    if (window.innerWidth <= 768) {
      galleryGrid.style.transform = `translateX(-${currentIndex * 100}%)`;
    } else {
      // Desktop par default state par reset karein
      galleryGrid.style.transform = 'translateX(0)';
    }
  }

  function showNextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
  }

  function showPrevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
  }

  // Event listeners ko sirf tabhi jodein jab elements maujood ho
  if (galleryGrid && prevBtn && nextBtn && slides.length > 0) {
    prevBtn.addEventListener('click', showPrevSlide);
    nextBtn.addEventListener('click', showNextSlide);

    // Jab screen ka size badle, to slider ko reset karein
    window.addEventListener('resize', updateSlider);
    
    // Initial check
    updateSlider();
  }
});