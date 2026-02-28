if (typeof emailjs !== 'undefined') emailjs.init("QbvIcH_2A6Ogz3ACT");
const EMAILJS_SERVICE_ID = "service_g281vo5", EMAILJS_TEMPLATE_ID = "template_ktbz45d";
const services = [
    { id: 1, name: 'Dry Cleaning', price: 200, icon: 'fa-basket-shopping' },
    { id: 2, name: 'Wash & Fold', price: 100, icon: 'fa-shirt' },
    { id: 3, name: 'Ironing', price: 30, icon: 'fa-fire' },
    { id: 4, name: 'Stain Removal', price: 500, icon: 'fa-spray-can' },
    { id: 5, name: 'Leather & Suede Cleaning', price: 999, icon: 'fa-bag-shopping' },
    { id: 6, name: 'Wedding Dress Cleaning', price: 2800, icon: 'fa-tshirt' }
], cart = [];
function renderServices() {
    const servicesList = document.getElementById('servicesList');
    if (!servicesList) return;
    servicesList.innerHTML = '';
    services.forEach(service => {
        const isInCart = cart.some(item => item.id === service.id);
        const serviceItem = document.createElement('div');
        serviceItem.className = 'service-item';
        serviceItem.innerHTML = `
            <div class="service-info">
                <div class="service-icon">
                    <i class="fas ${service.icon}"></i>
                </div>
                <div class="service-details">
                    <h4>${service.name}</h4>
                    <div class="service-price">₹${service.price.toFixed(2)}</div>
                </div>
            </div>
            <button class="service-btn ${isInCart ? 'remove' : ''}" onclick="toggleService(${service.id})">
                ${isInCart ? 'Remove Item' : 'Add Item'}
            </button>
        `;
        servicesList.appendChild(serviceItem);
    });
}
function toggleService(serviceId) {
    const idx = cart.findIndex(item => item.id === serviceId);
    if (idx > -1) cart.splice(idx, 1);
    else cart.push(services.find(s => s.id === serviceId));
    renderServices(); renderCart();
}
function renderCart() {
    const cartItems = document.getElementById('cartItems'), totalAmount = document.getElementById('totalAmount');
    if (!cartItems || !totalAmount) return;
    if (!cart.length) {
        cartItems.innerHTML = '<tr><td colspan="3" class="empty-cart">No items added yet</td></tr>';
        totalAmount.textContent = '₹0.00';
        return;
    }
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, i) => {
        total += item.price;
        const row = document.createElement('tr');
        row.innerHTML = `<td>${i + 1}</td><td>${item.name}</td><td>₹${item.price.toFixed(2)}</td>`;
        cartItems.appendChild(row);
    });
    totalAmount.textContent = `₹${total.toFixed(2)}`;
}
function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm'),
        bookingMessage = document.getElementById('bookingMessage'),
        bookNowBtn = document.getElementById('bookNowBtn');
    if (!bookingForm) return;
    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!cart.length) {
            bookingMessage.textContent = 'Please add at least one service to your cart.';
            bookingMessage.className = 'booking-message error';
            bookingMessage.style.display = 'block';
            return;
        }
        const userEmail = document.getElementById("email").value,
            userName = document.getElementById("name").value,
            total = cart.reduce((sum, item) => sum + item.price, 0),
            templateParams = {
                from_name: userName,
                user_email: userEmail,
                reply_to: userEmail,
                phone: document.getElementById("phone").value,
                cart_items: cart.map(item => ({ name: item.name, price: item.price.toFixed(2) })),
                total_amount: total.toFixed(2)
            };
        console.log('Template Params:', templateParams);
        console.log('Total Amount:', total.toFixed(2));
        bookNowBtn.disabled = true;
        bookNowBtn.textContent = 'Sending...';
        bookingMessage.textContent = 'Processing your booking...';
        bookingMessage.className = 'booking-message';
        bookingMessage.style.display = 'block';
        if (typeof emailjs !== 'undefined') {
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                .then(() => {
                    bookingMessage.textContent = 'Thank you For Booking the Service We will get back to you soon!';
                    bookingMessage.className = 'booking-message success';
                    bookingForm.reset();
                    cart.length = 0;
                    renderServices();
                    renderCart();
                    bookNowBtn.textContent = 'Book now';
                    setTimeout(() => {
                        bookNowBtn.disabled = false;
                        bookingMessage.style.display = 'none';
                    }, 3000);
                })
                .catch(error => {
                    console.error('EmailJS Error:', error, {
                        status: error.status,
                        text: error.text,
                        templateParams: templateParams
                    });
                    let errorMessage = 'There was an error sending your booking. Please try again or contact us directly.';
                    if (error.text && error.text.includes('recipients address is empty'))
                        errorMessage = 'Email configuration error: Please configure the recipient email in EmailJS dashboard.';
                    else if (error.text) errorMessage = `Error: ${error.text}`;
                    bookingMessage.textContent = errorMessage;
                    bookingMessage.className = 'booking-message error';
                    bookNowBtn.textContent = 'Book now';
                    bookNowBtn.disabled = false;
                });
        } else {
            bookingMessage.textContent = 'Thank you For Booking the Service We will get back to you soon!';
            bookingMessage.className = 'booking-message success';
            bookingForm.reset();
            cart.length = 0;
            renderServices();
            renderCart();
            bookNowBtn.textContent = 'Book now';
            setTimeout(() => {
                bookNowBtn.disabled = false;
            }, 3000);
        }
    });
}

function initAchievementsCounter() {
    const stats = document.querySelectorAll('.stat-number[data-target]');
    if (!stats.length) return;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target, target = parseInt(el.getAttribute('data-target')), 
                      suffix = el.getAttribute('data-suffix') || '', duration = 2000, start = performance.now();
                const count = now => {
                    const progress = Math.min((now - start) / duration, 1);
                    el.textContent = (progress < 1 ? Math.floor(target * progress) : target) + suffix;
                    if (progress < 1) requestAnimationFrame(count);
                };
                el.textContent = '0' + suffix;
                requestAnimationFrame(count);
            }
        });
    }, { threshold: 0.5, rootMargin: '0px' });
    stats.forEach(stat => observer.observe(stat));
}

function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle'),
          navbar = document.querySelector('.navbar'),
          navLinks = document.querySelector('.nav-links');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
        navbar.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        navbar.classList.remove('active');
        navLinks.classList.remove('active');
    }));
    document.addEventListener('click', e => {
        if (!navbar.contains(e.target) && navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    renderServices();
    renderCart();
    initBookingForm();
    initAchievementsCounter();
    initMobileMenu();
});