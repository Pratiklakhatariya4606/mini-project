// Product Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 129.99,
        category: "audio",
        image: "wireless.png",
        description: "Premium wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals."
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        category: "wearables",
        image: "smartwatch.png",
        description: "Advanced smartwatch with heart rate monitoring, GPS, and premium features for an active lifestyle."
    },
    {
        id: 3,
        name: "Bluetooth Speaker",
        price: 79.99,
        category: "audio",
        image: "bluetooth.png",
        description: "Portable Bluetooth speaker with exceptional sound quality and waterproof design for outdoor adventures."
    },
    {
        id: 4,
        name: "Wireless Earbuds",
        price: 89.99,
        category: "audio",
        image: "earbuds.jpg",
        description: "True wireless earbuds with superior sound quality and comfortable fit for all-day wear."
    },
    {
        id: 5,
        name: "Fitness Tracker",
        price: 49.99,
        category: "wearables",
        image: "fitness.jpg",
        description: "Affordable fitness tracker with heart rate monitor and activity tracking features."
    },
    {
        id: 6,
        name: "Phone Case",
        price: 29.99,
        category: "accessories",
        image: "cover.jpg",
        description: "Durable phone case with military-grade protection and sleek design."
    },
    {
        id: 7,
        name: "Portable Charger",
        price: 59.99,
        category: "accessories",
        image: "pcharger.jpg",
        description: "High-capacity portable charger for all your devices on the go."
    },
    {
        id: 8,
        name: "Gaming Headset",
        price: 149.99,
        category: "audio",
        image: "gaming.jpg",
        description: "Professional gaming headset with surround sound and noise-cancelling microphone."
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    loadProducts();
    updateCartCount();
    setupEventListeners();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            navigateTo(pageId);
        });
    });

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            const navMenu = document.querySelector('.nav-menu');
            navMenu.classList.toggle('active');
        });
    }
}

// Page navigation
function navigateTo(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show the selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Update active navigation link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });

    // Close mobile menu if open
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }

    // Load specific page content
    if (pageId === 'products') {
        loadProducts();
    } else if (pageId === 'cart') {
        loadCart();
    }
}

// Load products with category filtering
function loadProducts(category = 'all') {
    const productsGrid = document.querySelector('.products-page');
    if (!productsGrid) return;

    let filteredProducts = products;
    if (category !== 'all') {
        filteredProducts = products.filter(product => product.category === category);
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                <button class="view-details" onclick="showProductDetails(${product.id})">View Details</button>
            </div>
        </div>
    `).join('');

    // Update active category button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });
}

// Show product details in modal
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('productModal');
    const modalBody = document.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <div class="product-details">
            <div class="product-image-large">
                <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">
            </div>
            <div class="product-info-detail">
                <h2>${product.name}</h2>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart large" onclick="addToCart(${product.id}); closeModal()">Add to Cart</button>
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    
    // Show success message
    showNotification(`${product.name} added to cart!`);
}

// Update cart count in navigation
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Load cart items
function loadCart() {
    const cartItems = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <button onclick="navigateTo('products')">Start Shopping</button>
            </div>
        `;
        
        cartSummary.innerHTML = `
            <div class="summary-item">
                <span>Subtotal:</span>
                <span>$0.00</span>
            </div>
            <div class="summary-item">
                <span>Shipping:</span>
                <span>$0.00</span>
            </div>
            <div class="summary-item total">
                <span>Total:</span>
                <span>$0.00</span>
            </div>
            <button class="checkout-btn">Proceed to Checkout</button>
        `;
        return;
    }

    let subtotal = 0;
    
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="cart-item-total">
                    $${itemTotal.toFixed(2)}
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');

    const shipping = subtotal > 0 ? 9.99 : 0;
    const total = subtotal + shipping;

    cartSummary.innerHTML = `
        <div class="summary-item">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span>Shipping:</span>
            <span>$${shipping.toFixed(2)}</span>
        </div>
        <div class="summary-item total">
            <span>Total:</span>
            <span>$${total.toFixed(2)}</span>
        </div>
        <button class="checkout-btn" onclick="checkout()">Proceed to Checkout</button>
    `;
}

// Update item quantity in cart
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        updateCartCount();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
    showNotification('Item removed from cart');
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    // Simulate checkout process
    showNotification('Checkout completed successfully! Thank you for your purchase!', 'success');
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Reload cart to show empty state
    setTimeout(() => loadCart(), 2000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    // Category filtering
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            loadProducts(category);
        });
    });

    // Modal close
    document.querySelector('.close').addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('productModal');
        if (event.target === modal) {
            closeModal();
        }
    });

    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            this.reset();
        });
    }
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
    }
    
    .cart-item {
        display: grid;
        grid-template-columns: 80px 1fr auto auto auto;
        gap: 1rem;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .cart-item img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
    }
    
    .cart-item-controls button {
        padding: 5px 10px;
        border: 1px solid #e2e8f0;
        background: white;
        cursor: pointer;
        border-radius: 4px;
    }
    
    .remove-item {
        background: #ef4444;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
    }
    
    .view-details {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 8px;
        margin-top: 0.5rem;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
    }
    
    .product-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }
    
    .product-image-large img {
        width: 100%;
        max-height: 300px;
        object-fit: cover;
        border-radius: 12px;
    }
    
    .add-to-cart.large {
        padding: 15px 30px;
        font-size: 1.2rem;
    }
`;
document.head.appendChild(notificationStyles);

