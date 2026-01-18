// DAPIN RAMBANG - Modern Fintech JS
// Optimized for all devices with enhanced animations

document.addEventListener('DOMContentLoaded', function() {
    // ===== MOBILE MENU TOGGLE =====
    const mobileMenuBtn = document.getElementById('mobileMenu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }
    
    // Close mobile menu when clicking links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            }
        });
    });
    
    // ===== CALCULATOR FUNCTIONALITY =====
    const amountSlider = document.getElementById('amountSlider');
    const amountInput = document.getElementById('amountInput');
    const amountDisplay = document.getElementById('amountDisplay');
    const loanAmount = document.getElementById('loanAmount');
    const loanDuration = document.getElementById('loanDuration');
    const weekCount = document.getElementById('weekCount');
    const interestAmount = document.getElementById('interestAmount');
    const totalAmount = document.getElementById('totalAmount');
    const durationBtns = document.querySelectorAll('.duration-btn');
    
    // Format currency helper
    const formatCurrency = (amount) => {
        return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };
    
    // Calculate interest based on weeks
    const calculateInterest = (amount, days) => {
        const weeks = Math.ceil(days / 7);
        const interestPerWeek = 50000;
        return interestPerWeek * weeks;
    };
    
    // Update calculator display
    const updateCalculator = () => {
        const amount = parseInt(amountInput.value);
        const activeBtn = document.querySelector('.duration-btn.active');
        const days = parseInt(activeBtn.dataset.days);
        const weeks = Math.ceil(days / 7);
        
        // Format amounts
        const formattedAmount = formatCurrency(amount);
        const interest = calculateInterest(amount, days);
        const total = amount + interest;
        
        // Update displays
        amountDisplay.textContent = formattedAmount;
        loanAmount.textContent = formattedAmount;
        loanDuration.textContent = days + ' Hari';
        weekCount.textContent = weeks;
        interestAmount.textContent = formatCurrency(interest);
        totalAmount.textContent = formatCurrency(total);
        
        // Update form displays
        document.getElementById('formJumlah').textContent = formattedAmount;
        document.getElementById('formDurasi').textContent = days + ' Hari';
    };
    
    // Slider and input sync
    if (amountSlider && amountInput) {
        amountSlider.addEventListener('input', function() {
            amountInput.value = this.value;
            updateCalculator();
        });
        
        amountInput.addEventListener('input', function() {
            let value = parseInt(this.value);
            
            // Validate range
            if (value < parseInt(this.min)) value = parseInt(this.min);
            if (value > parseInt(this.max)) value = parseInt(this.max);
            
            this.value = value;
            amountSlider.value = value;
            updateCalculator();
        });
        
        amountInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            
            // Round to nearest 100k
            value = Math.round(value / 100000) * 100000;
            
            if (value < parseInt(this.min)) value = parseInt(this.min);
            if (value > parseInt(this.max)) value = parseInt(this.max);
            
            this.value = value;
            amountSlider.value = value;
            updateCalculator();
        });
    }
    
    // Duration button handling
    durationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            durationBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateCalculator();
        });
    });
    
    // ===== MODAL FUNCTIONALITY =====
    const openFormBtn = document.getElementById('openFormBtn');
    const formModal = document.getElementById('formModal');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const pengajuanForm = document.getElementById('pengajuanForm');
    
    // Open modal
    if (openFormBtn) {
        openFormBtn.addEventListener('click', function(e) {
            e.preventDefault();
            formModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close modal functions
    const closeModalFunc = () => {
        formModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    
    if (closeModal) closeModal.addEventListener('click', closeModalFunc);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModalFunc);
    
    // Close modal on outside click
    if (formModal) {
        formModal.addEventListener('click', function(e) {
            if (e.target === this) closeModalFunc();
        });
    }
    
    // ===== FORM SUBMISSION =====
    if (pengajuanForm) {
        pengajuanForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const nama = document.getElementById('nama').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const email = document.getElementById('email').value;
            const pekerjaan = document.getElementById('pekerjaan').value;
            const kota = document.getElementById('kota').value;
            const jumlah = document.getElementById('formJumlah').textContent;
            const durasi = document.getElementById('formDurasi').textContent;
            
            // Validate WhatsApp number
            const whatsappRegex = /^[0-9]{10,13}$/;
            const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');
            
            if (!whatsappRegex.test(cleanWhatsapp)) {
                showNotification('Nomor WhatsApp tidak valid! Pastikan format 628xxxxxxx', 'error');
                return;
            }
            
            // Prepare WhatsApp message
            const message = `Halo DAPIN RAMBANG! Saya mau mengajukan pinjaman:

👤 Nama: ${nama}
📱 WhatsApp: ${whatsapp}
📧 Email: ${email}
💼 Pekerjaan: ${pekerjaan}
📍 Kota: ${kota}

💰 Jumlah Pinjaman: ${jumlah}
⏳ Durasi: ${durasi}

Saya sudah membaca dan setuju dengan syarat dan ketentuan.`;

            // Encode message for URL
            const encodedMessage = encodeURIComponent(message);
            
            // Create WhatsApp URL
            const whatsappNumber = '6283800552220';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // Show loading state
            const submitBtn = document.getElementById('submitFormBtn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            submitBtn.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                // Open WhatsApp
                window.open(whatsappUrl, '_blank');
                
                // Reset form and close modal
                pengajuanForm.reset();
                closeModalFunc();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                showNotification('Pengajuan berhasil! Silakan lanjutkan di WhatsApp.', 'success');
                
            }, 1000);
        });
    }
    
    // ===== ENHANCED SCROLL ANIMATIONS =====
    const enhancedScrollAnimations = () => {
        const elements = document.querySelectorAll('.feature-card, .article-card, .owner-card, .calc-wrapper');
        
        elements.forEach((element, index) => {
            element.classList.add('scroll-fade-up');
            element.style.setProperty('--animation-delay', `${index * 0.1}s`);
        });
        
        // Add staggered animation classes to section headers
        const headers = document.querySelectorAll('.section-header');
        headers.forEach((header, index) => {
            header.classList.add('scroll-fade-up');
            header.style.setProperty('--animation-delay', `${index * 0.2}s`);
        });
    };
    
    // Apply enhanced animations
    enhancedScrollAnimations();
    
    // ===== SCROLL ANIMATIONS HANDLER =====
    const scrollElements = document.querySelectorAll('.scroll-fade-up');
    
    // Performance optimized scroll handler
    let ticking = false;
    
    const checkScroll = () => {
        scrollElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
        
        ticking = false;
    };
    
    const handleScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(checkScroll);
            ticking = true;
        }
    };
    
    // Initial check on load
    setTimeout(checkScroll, 100);
    
    // Listen to scroll events with throttle
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // ===== RIPPLE EFFECT FOR BUTTONS =====
    // Add ripple effect to buttons
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Get click position relative to button
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            // Position the ripple at click location
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            // Add ripple to button
            this.appendChild(ripple);
            
            // Remove ripple after animation completes
            setTimeout(() => {
                if (ripple.parentNode === this) {
                    this.removeChild(ripple);
                }
            }, 600);
        });
    });
    
    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (!targetElement) return;
            
            // Calculate header offset
            const headerHeight = document.querySelector('#header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            // Smooth scroll
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
    
    // ===== INPUT VALIDATION =====
    const whatsappInput = document.getElementById('whatsapp');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', function() {
            // Remove non-numeric characters
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Auto-add 62 prefix if starts with 0
            if (this.value.startsWith('0')) {
                this.value = '62' + this.value.substring(1);
            }
        });
    }
    
    // ===== NUMBER ANIMATION FOR STATS =====
    const animateNumbers = () => {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const originalText = stat.textContent;
            const isPercentage = originalText.includes('%');
            const value = parseInt(originalText.replace(/[^0-9]/g, ''));
            
            // Only animate if it's a number
            if (!isNaN(value)) {
                let start = 0;
                const end = value;
                const duration = 1500;
                const increment = Math.ceil(end / 50);
                
                const timer = setInterval(() => {
                    start += increment;
                    if (start > end) start = end;
                    
                    stat.textContent = isPercentage ? `${start}%` : start.toString();
                    
                    if (start >= end) {
                        stat.textContent = originalText;
                        clearInterval(timer);
                    }
                }, duration / 50);
            }
        });
    };
    
    // Trigger number animation when stats are visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Set icon based on type
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }
    
    // ===== TOUCH OPTIMIZATIONS =====
    // Add touch-specific optimizations
    document.addEventListener('touchstart', function() {}, { passive: true });
    
    // Touch feedback for mobile buttons
    document.querySelectorAll('.btn, .duration-btn').forEach(btn => {
        btn.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        btn.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        });
    });
    
    // ===== INITIALIZE CALCULATOR =====
    updateCalculator();
    
    // ===== ADD DYNAMIC STYLES FOR ANIMATIONS =====
    addDynamicStyles();
});

// ===== DYNAMIC STYLES FUNCTION =====
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Ripple Effect Styles */
        .btn-primary {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.7);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(20);
                opacity: 0;
            }
        }
        
        /* Notification Styles */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 9999;
            transform: translateX(120%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-left: 4px solid #4361EE;
            max-width: 350px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-left-color: #4ADE80;
        }
        
        .notification-success i {
            color: #4ADE80;
        }
        
        .notification-error {
            border-left-color: #EF4444;
        }
        
        .notification-error i {
            color: #EF4444;
        }
        
        .notification i {
            font-size: 1.2rem;
            color: #4361EE;
        }
        
        /* Scroll Fade Animations */
        .scroll-fade-up {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            transition-delay: var(--animation-delay, 0s);
        }
        
        .scroll-fade-up.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Touch Feedback */
        .touch-active {
            transform: scale(0.95) !important;
            transition: transform 0.1s !important;
        }
        
        /* Mobile Optimizations */
        @media (max-width: 768px) {
            .notification {
                left: 20px;
                right: 20px;
                max-width: none;
            }
            
            .ripple {
                animation-duration: 0.4s;
            }
        }
        
        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
            .scroll-fade-up,
            .ripple,
            .notification {
                transition: none !important;
                animation: none !important;
            }
            
            .scroll-fade-up {
                opacity: 1;
                transform: none;
            }
        }
        
        /* Performance Optimizations */
        .will-change {
            will-change: transform, opacity;
        }
    `;
    document.head.appendChild(style);
}

// ===== LOADING ANIMATIONS =====
// Add loading class to body for initial animations
document.body.classList.add('loading');

window.addEventListener('load', function() {
    setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
    }, 100);
});

// ===== RESIZE HANDLER =====
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Close mobile menu on resize to desktop
        const mobileMenu = document.querySelector('.nav-links');
        const mobileBtn = document.getElementById('mobileMenu');
        
        if (window.innerWidth > 768 && mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            if (mobileBtn) {
                mobileBtn.querySelector('i').classList.add('fa-bars');
                mobileBtn.querySelector('i').classList.remove('fa-times');
            }
        }
    }, 250);
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', function() {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            console.log('Page load time:', Math.round(perfData.loadEventEnd - perfData.startTime), 'ms');
        }
    });
}