// DAPIN RAMBANG - Enhanced Modern Fintech JS
// Optimized for all devices with smooth animations + NEW FEATURES

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
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
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
        
        // Save to localStorage for persistence
        saveCalculatorState(amount, days);
        
        // Update comparison table
        updateComparisonTable();
    };
    
    // Slider and input sync
    if (amountSlider && amountInput) {
        amountSlider.addEventListener('input', function() {
            amountInput.value = this.value;
            updateCalculator();
        });
        
        amountInput.addEventListener('input', function() {
            let value = parseInt(this.value);
            
            if (value < parseInt(this.min)) value = parseInt(this.min);
            if (value > parseInt(this.max)) value = parseInt(this.max);
            
            this.value = value;
            amountSlider.value = value;
            updateCalculator();
        });
        
        amountInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            
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
    
    // ===== CALCULATOR STATE PERSISTENCE =====
    const saveCalculatorState = (amount, days) => {
        const state = { amount, days, timestamp: Date.now() };
        localStorage.setItem('dapinCalculatorState', JSON.stringify(state));
    };
    
    const loadCalculatorState = () => {
        const saved = localStorage.getItem('dapinCalculatorState');
        if (saved) {
            const state = JSON.parse(saved);
            // Only load if less than 24 hours old
            if (Date.now() - state.timestamp < 24 * 60 * 60 * 1000) {
                amountInput.value = state.amount;
                amountSlider.value = state.amount;
                durationBtns.forEach(btn => {
                    btn.classList.remove('active');
                    if (parseInt(btn.dataset.days) === state.days) {
                        btn.classList.add('active');
                    }
                });
                updateCalculator();
            }
        }
    };
    
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
            trackEvent('modal_opened', 'form_pengajuan');
        });
    }
    
    // Close modal functions
    const closeModalFunc = () => {
        formModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    
    if (closeModal) closeModal.addEventListener('click', closeModalFunc);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModalFunc);
    
    formModal.addEventListener('click', function(e) {
        if (e.target === this) closeModalFunc();
    });
    
    // ===== FORM AUTO-SAVE (Draft) =====
    const formFields = ['nama', 'whatsapp', 'email', 'pekerjaan', 'kota'];
    
    const saveFormDraft = () => {
        const draft = {};
        formFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) draft[field] = element.value;
        });
        localStorage.setItem('dapinFormDraft', JSON.stringify(draft));
    };
    
    const loadFormDraft = () => {
        const saved = localStorage.getItem('dapinFormDraft');
        if (saved) {
            const draft = JSON.parse(saved);
            formFields.forEach(field => {
                const element = document.getElementById(field);
                if (element && draft[field]) {
                    element.value = draft[field];
                }
            });
        }
    };
    
    // Auto-save on input
    formFields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.addEventListener('input', debounce(saveFormDraft, 500));
        }
    });
    
    // ===== FORM SUBMISSION =====
    if (pengajuanForm) {
        pengajuanForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nama = document.getElementById('nama').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const email = document.getElementById('email').value;
            const pekerjaan = document.getElementById('pekerjaan').value;
            const kota = document.getElementById('kota').value;
            const jumlah = document.getElementById('formJumlah').textContent;
            const durasi = document.getElementById('formDurasi').textContent;
            
            // Validate WhatsApp number
            const whatsappRegex = /^[0-9]{10,13}$/;
            if (!whatsappRegex.test(whatsapp.replace(/[^0-9]/g, ''))) {
                showNotification('Nomor WhatsApp tidak valid! Pastikan format 628xxxxxxx', 'error');
                return;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Email tidak valid!', 'error');
                return;
            }
            
            const message = `Halo DAPIN RAMBANG! Saya mau mengajukan pinjaman:

👤 Nama: ${nama}
📱 WhatsApp: ${whatsapp}
📧 Email: ${email}
💼 Pekerjaan: ${pekerjaan}
📍 Kota: ${kota}

💰 Jumlah Pinjaman: ${jumlah}
⏳ Durasi: ${durasi}

Saya sudah membaca dan setuju dengan syarat dan ketentuan.`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappNumber = '6283800552220';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            const submitBtn = document.getElementById('submitFormBtn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                
                pengajuanForm.reset();
                localStorage.removeItem('dapinFormDraft');
                closeModalFunc();
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                showNotification('Pengajuan berhasil! Silakan lanjutkan di WhatsApp.', 'success');
                
                trackEvent('form_submitted', 'pengajuan_pinjaman', {
                    amount: jumlah,
                    duration: durasi
                });
                
            }, 1000);
        });
    }
    
    // ===== QUICK AMOUNT PRESETS =====
    const createQuickPresets = () => {
        const presetContainer = document.createElement('div');
        presetContainer.className = 'quick-presets';
        presetContainer.innerHTML = `
            <div class="preset-label">Quick Select:</div>
            <button class="preset-btn" data-amount="500000">500K</button>
            <button class="preset-btn" data-amount="1000000">1JT</button>
            <button class="preset-btn" data-amount="2000000">2JT</button>
            <button class="preset-btn" data-amount="5000000">5JT</button>
        `;
        
        const inputWrapper = document.querySelector('.input-wrapper');
        if (inputWrapper) {
            inputWrapper.parentNode.insertBefore(presetContainer, inputWrapper.nextSibling);
            
            document.querySelectorAll('.preset-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const amount = parseInt(this.dataset.amount);
                    amountInput.value = amount;
                    amountSlider.value = amount;
                    updateCalculator();
                    
                    this.classList.add('active');
                    setTimeout(() => this.classList.remove('active'), 300);
                });
            });
        }
    };
    
    // ===== COMPARISON TABLE =====
    const createComparisonTable = () => {
        const comparisonSection = document.createElement('div');
        comparisonSection.className = 'comparison-table-wrapper scroll-fade';
        comparisonSection.innerHTML = `
            <h3 style="text-align: center; margin-bottom: 1.5rem;">Bandingkan Durasi Pinjaman</h3>
            <div class="comparison-table">
                <div class="comparison-row header">
                    <div>Durasi</div>
                    <div>Bunga</div>
                    <div>Total Bayar</div>
                    <div>Per Hari</div>
                </div>
            </div>
        `;
        
        const calcBox = document.querySelector('.calc-box');
        if (calcBox) {
            calcBox.appendChild(comparisonSection);
            updateComparisonTable();
        }
    };
    
    const updateComparisonTable = () => {
        const amount = parseInt(amountInput.value);
        const durations = [7, 14, 21, 30];
        const table = document.querySelector('.comparison-table');
        
        if (!table) return;
        
        const rows = table.querySelectorAll('.comparison-row:not(.header)');
        rows.forEach(row => row.remove());
        
        durations.forEach(days => {
            const interest = calculateInterest(amount, days);
            const total = amount + interest;
            const perDay = Math.round(total / days);
            
            const row = document.createElement('div');
            row.className = 'comparison-row';
            row.innerHTML = `
                <div>${days} Hari</div>
                <div>${formatCurrency(interest)}</div>
                <div><strong>${formatCurrency(total)}</strong></div>
                <div>${formatCurrency(perDay)}/hari</div>
            `;
            table.appendChild(row);
        });
    };
    
    // ===== SCROLL ANIMATIONS =====
    const scrollElements = document.querySelectorAll('.scroll-fade');
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
    
    checkScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (!targetElement) return;
            
            const headerHeight = document.querySelector('#header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            history.pushState(null, null, href);
        });
    });
    
    // ===== INPUT VALIDATION =====
    const whatsappInput = document.getElementById('whatsapp');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            
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
            
            if (!isNaN(value)) {
                let start = 0;
                const end = value;
                const duration = 1500;
                const stepTime = Math.abs(Math.floor(duration / end));
                
                const timer = setInterval(() => {
                    start += 1;
                    stat.textContent = isPercentage ? `${start}%` : start;
                    
                    if (start >= end) {
                        stat.textContent = originalText;
                        clearInterval(timer);
                    }
                }, stepTime);
            }
        });
    };
    
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
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }
    
    // ===== ANALYTICS TRACKING =====
    const trackEvent = (eventName, category, data = {}) => {
        const event = {
            name: eventName,
            category: category,
            data: data,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        
        const events = JSON.parse(localStorage.getItem('dapinEvents') || '[]');
        events.push(event);
        if (events.length > 50) events.shift();
        localStorage.setItem('dapinEvents', JSON.stringify(events));
        
        console.log('Event tracked:', event);
    };
    
    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('kalkulator').scrollIntoView({ behavior: 'smooth' });
        }
        
        if (e.key === 'Escape' && formModal.style.display === 'flex') {
            closeModalFunc();
        }
    });
    
    // ===== TOUCH OPTIMIZATIONS =====
    document.addEventListener('touchstart', function() {}, { passive: true });
    
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
    
    // ===== MOBILE DEVICE DETECTION & OPTIMIZATION =====
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    
    // Disable heavy animations on low-end devices
    if (isMobile || isLowEndDevice) {
        document.documentElement.style.setProperty('--transition', 'all 0.2s ease');
        
        // Reduce scroll fade elements for better performance
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion || isLowEndDevice) {
            scrollElements.forEach(el => el.classList.add('visible')); // Show all immediately
        }
    }
    
    // ===== LAZY LOAD IMAGES =====
    const lazyLoadImages = () => {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    };
    
    // ===== VIEWPORT HEIGHT FIX FOR MOBILE =====
    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', debounce(setVH, 100));
    
    // ===== SMOOTH SCROLL POLYFILL FOR OLDER DEVICES =====
    if (!('scrollBehavior' in document.documentElement.style)) {
        const smoothScrollPolyfill = (target, duration = 300) => {
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            let startTime = null;
            
            const animation = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            };
            
            const ease = (t, b, c, d) => {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            };
            
            requestAnimationFrame(animation);
        };
    }
    
    // ===== UTILITY: DEBOUNCE =====
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // ===== UTILITY: THROTTLE FOR SCROLL =====
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // ===== INITIALIZE =====
    loadCalculatorState();
    loadFormDraft();
    createQuickPresets();
    createComparisonTable();
    updateCalculator();
    lazyLoadImages();
    
    trackEvent('page_view', 'landing_page', {
        isMobile: isMobile,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight
    });
    
    // ===== PERFORMANCE HINTS =====
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === '2g' || connection.saveData) {
            // Disable animations on slow connections
            document.documentElement.style.setProperty('--transition', 'none');
            console.log('Slow connection detected - animations disabled');
        }
    }
});

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', function() {
    setTimeout(() => {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Page loaded in:', perfData.loadEventEnd - perfData.startTime, 'ms');
            }
        }
    }, 0);
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// ===== RESIZE OPTIMIZATION =====
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        const mobileMenu = document.querySelector('.nav-links');
        if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            const mobileBtn = document.getElementById('mobileMenu');
            if (mobileBtn) {
                mobileBtn.querySelector('i').classList.add('fa-bars');
                mobileBtn.querySelector('i').classList.remove('fa-times');
            }
        }
    }, 250);
});