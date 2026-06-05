document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const welcomeGate = document.getElementById('welcome-gate');
    const mainContent = document.getElementById('main-content');
    const btnOpen = document.getElementById('btn-open');
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Target Date: August 31, 2026 at 08:00 AM
    const targetDate = new Date('2026-08-31T08:00:00').getTime();

    // Elements for Calendar Modal
    const calendarModal = document.getElementById('calendar-modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const btnCancelModal = document.getElementById('btn-cancel-modal');
    const btnAddCalendar = document.getElementById('btn-add-calendar');

    // Helper functions to show/hide modal
    function showModal() {
        if (calendarModal) {
            calendarModal.classList.add('show');
        }
    }

    function hideModal() {
        if (calendarModal) {
            calendarModal.classList.remove('show');
        }
    }

    // Modal Close Bindings (Safe check to ensure elements exist)
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', hideModal);
    if (btnCancelModal) btnCancelModal.addEventListener('click', hideModal);
    
    // Only bind modal actions if the modal actually exists, avoiding blocking other scripts
    if (btnAddCalendar && calendarModal) {
        btnAddCalendar.addEventListener('click', hideModal);
    }

    // Close modal if user clicks outside the modal card
    if (calendarModal) {
        calendarModal.addEventListener('click', (e) => {
            if (e.target === calendarModal) {
                hideModal();
            }
        });
    }

    // 1. Welcome Gate Unlock Action
    btnOpen.addEventListener('click', () => {
        // Try playing background music immediately
        playAudio();

        // Slide open the doors
        welcomeGate.classList.add('open');

        // Wait 3 seconds to let the doors open and focus the image with a WOW look, then fade overlay & reveal invitation
        setTimeout(() => {
            welcomeGate.classList.add('fade-out');
            mainContent.classList.add('reveal');

            // Start countdown and setup scroll reveals
            initCountdown();
            initScrollReveals();
            startFlowerPetals();

            // Trigger Google Calendar popup modal 1.5 seconds after page loads if it exists
            if (calendarModal) {
                setTimeout(showModal, 1500);
            }
        }, 3000);
    });

    // 2. Music Player & Toggle Controls
    let isPlaying = false;

    function playAudio() {
        bgMusic.play()
            .then(() => {
                isPlaying = true;
                musicToggle.classList.add('playing');
                musicToggle.innerHTML = '<i class="fa-solid fa-pause"></i>';
            })
            .catch(error => {
                console.log('Audio autoplay blocked or failed:', error);
            });
    }

    function pauseAudio() {
        bgMusic.pause();
        isPlaying = false;
        musicToggle.classList.remove('playing');
        musicToggle.innerHTML = '<i class="fa-solid fa-music"></i>';
    }

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    });

    // 3. Countdown Timer Logic
    let countdownInterval;

    function initCountdown() {
        updateCountdown(); // Run once immediately
        countdownInterval = setInterval(updateCountdown, 1000);
    }

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    // 4. Scroll Reveal Animations (using Intersection Observer)
    function initScrollReveals() {
        const revealElements = document.querySelectorAll('.scroll-reveal');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }

    // 5. Falling Flower Petals Animation
    function startFlowerPetals() {
        const petalsContainer = document.createElement('div');
        petalsContainer.classList.add('petals-container');
        document.body.appendChild(petalsContainer);

        const petalTypes = [
            'petal-1', // soft blush round petal
            'petal-2', // long rose petal
            'petal-3'  // small white blossom
        ];

        setInterval(() => {
            if (document.hidden) return; // Pause when tab is inactive

            const petal = document.createElement('div');
            const type = petalTypes[Math.floor(Math.random() * petalTypes.length)];
            petal.classList.add('petal', type);

            // Randomize position, size, rotation, animation duration & delay
            const left = Math.random() * 100;
            const size = Math.random() * 12 + 8; // 8px to 20px
            const duration = Math.random() * 6 + 6; // 6s to 12s
            const delay = Math.random() * 4; // 0s to 4s
            const rotate = Math.random() * 360;

            petal.style.left = `${left}vw`;
            petal.style.width = `${size}px`;
            petal.style.height = `${size}px`;
            petal.style.animationDuration = `${duration}s`;
            petal.style.animationDelay = `-${delay}s`;
            petal.style.transform = `rotate(${rotate}deg)`;

            petalsContainer.appendChild(petal);

            // Remove petal after animation completes
            setTimeout(() => {
                petal.remove();
            }, (duration) * 1000);
        }, 300);
    }
});
