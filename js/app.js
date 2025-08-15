/**
 * Food Ordering App JavaScript
 * This file handles all the functionality of the food ordering application
 */

// Product data organized by categories (in a real app, this would come from a backend API)
const productCategories = {
    "Main Dishes": [
        {
            id: 1,
            name: "Nasi Goreng Special",
            price: 45000,
            description: "Indonesian fried rice with chicken, shrimp, and vegetables, served with a fried egg on top.",
            image: "https://placehold.co/600x400/cb2f1a/ffffff?text=Nasi+Goreng"
        },
        {
            id: 2,
            name: "Ayam Bakar",
            price: 55000,
            description: "Grilled chicken marinated in sweet soy sauce and spices, served with rice and sambal.",
            image: "https://placehold.co/600x400/cb2f1a/ffffff?text=Ayam+Bakar"
        },
        {
            id: 3,
            name: "Sate Ayam",
            price: 35000,
            description: "Chicken skewers grilled to perfection, served with peanut sauce and rice cakes.",
            image: "https://placehold.co/600x400/cb2f1a/ffffff?text=Sate+Ayam"
        },
        {
            id: 4,
            name: "Gado-Gado",
            price: 30000,
            description: "Indonesian salad with vegetables, eggs, and tofu, topped with peanut sauce.",
            image: "https://placehold.co/600x400/cb2f1a/ffffff?text=Gado-Gado"
        },
        {
            id: 5,
            name: "Soto Ayam",
            price: 40000,
            description: "Chicken soup with vermicelli noodles, shredded chicken, and boiled egg.",
            image: "https://placehold.co/600x400/cb2f1a/ffffff?text=Soto+Ayam"
        },
        {
            id: 6,
            name: "Rendang",
            price: 65000,
            description: "Slow-cooked beef in coconut milk and spices, one of Indonesia's most famous dishes.",
            image: "https://placehold.co/600x400/cb2f1a/ffffff?text=Rendang"
        }
    ],
    "Drinks": [
        {
            id: 7,
            name: "Es Teh Manis",
            price: 8000,
            description: "Traditional Indonesian sweet iced tea, refreshing and perfect for hot weather.",
            image: "https://placehold.co/600x400/2196F3/ffffff?text=Es+Teh+Manis"
        },
        {
            id: 8,
            name: "Es Jeruk",
            price: 12000,
            description: "Fresh orange juice with ice, sweet and tangy citrus refreshment.",
            image: "https://placehold.co/600x400/FF9800/ffffff?text=Es+Jeruk"
        },
        {
            id: 9,
            name: "Es Kelapa Muda",
            price: 15000,
            description: "Young coconut water with tender coconut meat, naturally refreshing.",
            image: "https://placehold.co/600x400/4CAF50/ffffff?text=Es+Kelapa"
        },
        {
            id: 10,
            name: "Kopi Tubruk",
            price: 10000,
            description: "Traditional Indonesian black coffee, strong and aromatic.",
            image: "https://placehold.co/600x400/795548/ffffff?text=Kopi+Tubruk"
        },
        {
            id: 11,
            name: "Es Cendol",
            price: 18000,
            description: "Traditional drink with green rice flour jelly, coconut milk, and palm sugar.",
            image: "https://placehold.co/600x400/8BC34A/ffffff?text=Es+Cendol"
        },
        {
            id: 12,
            name: "Jus Alpukat",
            price: 20000,
            description: "Creamy avocado juice with milk and chocolate syrup, rich and nutritious.",
            image: "https://placehold.co/600x400/689F38/ffffff?text=Jus+Alpukat"
        }
    ],
    "Desserts": [
        {
            id: 13,
            name: "Es Krim Goreng",
            price: 25000,
            description: "Fried ice cream with crispy coating, served warm outside and cold inside.",
            image: "https://placehold.co/600x400/E91E63/ffffff?text=Es+Krim+Goreng"
        },
        {
            id: 14,
            name: "Pisang Goreng",
            price: 15000,
            description: "Deep-fried banana fritters with crispy batter, served with palm sugar syrup.",
            image: "https://placehold.co/600x400/FFC107/ffffff?text=Pisang+Goreng"
        },
        {
            id: 15,
            name: "Klepon",
            price: 12000,
            description: "Traditional green rice balls filled with palm sugar and coated with grated coconut.",
            image: "https://placehold.co/600x400/4CAF50/ffffff?text=Klepon"
        },
        {
            id: 16,
            name: "Dadar Gulung",
            price: 18000,
            description: "Green pancake rolls filled with sweet grated coconut and palm sugar.",
            image: "https://placehold.co/600x400/8BC34A/ffffff?text=Dadar+Gulung"
        },
        {
            id: 17,
            name: "Es Campur",
            price: 22000,
            description: "Mixed ice dessert with various jellies, fruits, and sweet syrup.",
            image: "https://placehold.co/600x400/9C27B0/ffffff?text=Es+Campur"
        },
        {
            id: 18,
            name: "Puding Roti",
            price: 20000,
            description: "Bread pudding with caramel sauce, soft and sweet comfort dessert.",
            image: "https://placehold.co/600x400/FF5722/ffffff?text=Puding+Roti"
        }
    ]
};

// Flatten all products for easy access by ID
const products = Object.values(productCategories).flat();

// Shopping cart array
let cart = [];

// DOM Elements
const productListEl = document.getElementById('product-list');
const productModalEl = document.getElementById('product-modal');
const productDetailsEl = document.getElementById('product-details');
const thankYouModalEl = document.getElementById('thank-you-modal');
const cartIconEl = document.querySelector('.cart-icon');
const cartCountEl = document.getElementById('cart-count');
const productCatalogEl = document.getElementById('product-catalog');
const shoppingCartEl = document.getElementById('shopping-cart');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const continueShoppingBtn = document.getElementById('continue-shopping');
const checkoutBtn = document.getElementById('checkout-button');
const checkoutFormEl = document.getElementById('checkout-form');
const orderSummaryEl = document.getElementById('order-summary');
const orderTotalEl = document.getElementById('order-total');
const backToCartBtn = document.getElementById('back-to-cart');
const placeOrderBtn = document.getElementById('place-order');
const orderFormEl = document.getElementById('order-form');
const categoryFilterBtns = document.querySelectorAll('.category-filter');

// Bootstrap modal instances
let bootstrapModal;
let thankYouModal;

// Current category filter
let currentFilter = 'all';

// Format price to IDR
function formatPrice(price) {
    return `Rp ${price.toLocaleString('id-ID')}`;
}

// Initialize the app
function init() {
    renderProducts();
    setupEventListeners();
    // Initialize Bootstrap modals
    bootstrapModal = new bootstrap.Modal(productModalEl);
    thankYouModal = new bootstrap.Modal(thankYouModalEl);
}

// Render product catalog organized by categories
function renderProducts() {
    productListEl.innerHTML = '';
    
    // Category filter mapping
    const categoryFilterMap = {
        'all': null,
        'main-dishes': 'Main Dishes',
        'drinks': 'Drinks',
        'desserts': 'Desserts'
    };
    
    // Filter categories based on current filter
    const filteredCategories = currentFilter === 'all' 
        ? Object.entries(productCategories)
        : Object.entries(productCategories).filter(([categoryName]) => 
            categoryName === categoryFilterMap[currentFilter]
        );
    
    filteredCategories.forEach(([categoryName, categoryProducts]) => {
        // Create category section
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section mb-5';
        
        // Category header
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'row mb-4';
        categoryHeader.innerHTML = `
            <div class="col-12">
                <h3 class="category-title text-center mb-0">
                    <i class="fas ${getCategoryIcon(categoryName)}"></i>
                    ${categoryName}
                </h3>
                <hr class="category-divider">
            </div>
        `;
        categorySection.appendChild(categoryHeader);
        
        // Products row
        const productsRow = document.createElement('div');
        productsRow.className = 'row';
        
        categoryProducts.forEach(product => {
            const productCol = document.createElement('div');
            productCol.className = 'col-lg-4 col-md-6 mb-4';
            
            productCol.innerHTML = `
                <div class="product-card" data-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <h4 class="product-title">${product.name}</h4>
                    <p class="product-price">${formatPrice(product.price)}</p>
                    <button class="btn btn-primary view-details">View Details</button>
                </div>
            `;
            
            productsRow.appendChild(productCol);
        });
        
        categorySection.appendChild(productsRow);
        productListEl.appendChild(categorySection);
    });
}

// Get category icon based on category name
function getCategoryIcon(categoryName) {
    const icons = {
        'Main Dishes': 'fa-utensils',
        'Drinks': 'fa-glass-water',
        'Desserts': 'fa-ice-cream'
    };
    return icons[categoryName] || 'fa-utensils';
}

// Setup event listeners
function setupEventListeners() {
    // Product details
    productListEl.addEventListener('click', handleProductClick);
    
    // Cart icon click
    cartIconEl.addEventListener('click', showCart);
    
    // Continue shopping button
    continueShoppingBtn.addEventListener('click', showProductCatalog);
    
    // Checkout button
    checkoutBtn.addEventListener('click', showCheckoutForm);
    
    // Back to cart button
    backToCartBtn.addEventListener('click', showCart);
    
    // Place order button
    orderFormEl.addEventListener('submit', handleOrderSubmit);
    
    // Category filter buttons
    categoryFilterBtns.forEach(btn => {
        btn.addEventListener('click', handleCategoryFilter);
    });
    
    // Sticky header scroll effect
    window.addEventListener('scroll', handleHeaderScroll);
}

// Handle header scroll effect
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Handle category filter
function handleCategoryFilter(e) {
    const selectedCategory = e.target.dataset.category;
    
    // Update active button
    categoryFilterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Update current filter
    currentFilter = selectedCategory;
    
    // Re-render products with filter
    renderProducts();
}

// Handle product click
function handleProductClick(e) {
    const productCard = e.target.closest('.product-card');
    
    if (!productCard) return;
    
    const productId = parseInt(productCard.dataset.id);
    const product = products.find(p => p.id === productId);
    
    if (e.target.classList.contains('view-details')) {
        showProductDetails(product);
    }
}

// Show product details in modal
function showProductDetails(product) {
    productDetailsEl.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="${product.image}" alt="${product.name}" class="img-fluid rounded">
            </div>
            <div class="col-md-6">
                <h3>${product.name}</h3>
                <p class="product-price h4 text-primary">${formatPrice(product.price)}</p>
                <p>${product.description}</p>
                <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;
    
    bootstrapModal.show();
    
    // Add event listener to Add to Cart button
    const addToCartBtn = productDetailsEl.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => {
        addToCart(product);
        bootstrapModal.hide();
    });
}

// Add product to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartCount();
    updateCartUI();
}

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountEl.textContent = totalItems;
}

// Update cart UI
function updateCartUI() {
    cartItemsEl.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p>Your cart is empty.</p>';
        updateCartTotal();
        return;
    }
    
    cart.forEach(item => {
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item d-flex align-items-center p-3 border-bottom';
        
        cartItemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image rounded me-3" style="width: 80px; height: 80px; object-fit: cover;">
            <div class="cart-item-details flex-grow-1">
                <h5 class="cart-item-title mb-1">${item.name}</h5>
                <p class="cart-item-price mb-0 text-primary">${formatPrice(item.price)}</p>
            </div>
            <div class="cart-item-quantity d-flex align-items-center me-3">
                <button class="btn btn-outline-secondary btn-sm quantity-btn decrease" data-id="${item.id}">-</button>
                <input type="number" class="form-control form-control-sm mx-2 quantity-input" value="${item.quantity}" min="1" data-id="${item.id}" style="width: 60px;">
                <button class="btn btn-outline-secondary btn-sm quantity-btn increase" data-id="${item.id}">+</button>
            </div>
            <button class="btn btn-outline-danger btn-sm remove-item" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItemsEl.appendChild(cartItemEl);
    });
    
    // Add event listeners to quantity buttons and remove buttons
    const decreaseBtns = document.querySelectorAll('.decrease');
    const increaseBtns = document.querySelectorAll('.increase');
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const removeItemBtns = document.querySelectorAll('.remove-item');
    
    decreaseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            updateItemQuantity(parseInt(btn.dataset.id), 'decrease');
        });
    });
    
    increaseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            updateItemQuantity(parseInt(btn.dataset.id), 'increase');
        });
    });
    
    quantityInputs.forEach(input => {
        input.addEventListener('change', () => {
            updateItemQuantity(parseInt(input.dataset.id), 'set', parseInt(input.value));
        });
    });
    
    removeItemBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            removeItem(parseInt(btn.dataset.id));
        });
    });
    
    updateCartTotal();
}

// Update item quantity
function updateItemQuantity(id, action, value = null) {
    const item = cart.find(item => item.id === id);
    
    if (!item) return;
    
    if (action === 'increase') {
        item.quantity += 1;
    } else if (action === 'decrease') {
        if (item.quantity > 1) {
            item.quantity -= 1;
        }
    } else if (action === 'set' && value !== null) {
        if (value > 0) {
            item.quantity = value;
        }
    }
    
    updateCartCount();
    updateCartUI();
}

// Remove item from cart
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartCount();
    updateCartUI();
}

// Update cart total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalEl.textContent = formatPrice(total);
    orderTotalEl.textContent = formatPrice(total);
}

// Show cart
function showCart() {
    productCatalogEl.classList.add('d-none');
    checkoutFormEl.classList.add('d-none');
    shoppingCartEl.classList.remove('d-none');
    updateCartUI();
}

// Show product catalog
function showProductCatalog() {
    shoppingCartEl.classList.add('d-none');
    checkoutFormEl.classList.add('d-none');
    productCatalogEl.classList.remove('d-none');
}

// Show checkout form
function showCheckoutForm() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items to your cart before checkout.');
        return;
    }
    
    shoppingCartEl.classList.add('d-none');
    productCatalogEl.classList.add('d-none');
    checkoutFormEl.classList.remove('d-none');
    
    updateOrderSummary();
}

// Update order summary
function updateOrderSummary() {
    orderSummaryEl.innerHTML = '';
    
    cart.forEach(item => {
        const orderItemEl = document.createElement('div');
        orderItemEl.className = 'order-item d-flex justify-content-between align-items-center py-2 border-bottom';
        
        orderItemEl.innerHTML = `
            <div>
                <strong>${item.name}</strong> x ${item.quantity}
            </div>
            <div class="text-primary fw-bold">
                ${formatPrice(item.price * item.quantity)}
            </div>
        `;
        
        orderSummaryEl.appendChild(orderItemEl);
    });
}

// Handle order submission
function handleOrderSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const notes = document.getElementById('notes').value;
    
    if (!name || !address || !phone) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Create WhatsApp message
    const message = createWhatsAppMessage(name, address, phone, notes);
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/62895332782122?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Show thank you modal
    thankYouModal.show();
    
    // Reset cart and form
    cart = [];
    updateCartCount();
    orderFormEl.reset();
    showProductCatalog();
}

// Create WhatsApp message
function createWhatsAppMessage(name, address, phone, notes) {
    let message = `*New Order*\n\n`;
    message += `*Customer Details*\n`;
    message += `Name: ${name}\n`;
    message += `Address: ${address}\n`;
    message += `Phone: ${phone}\n\n`;
    
    message += `*Order Items*\n`;
    
    cart.forEach(item => {
        message += `${item.name} x ${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    message += `\n*Total: ${formatPrice(total)}*`;
    
    // Add notes if provided
    if (notes && notes.trim()) {
        message += `\n\n*Order Notes*\n${notes.trim()}`;
    }
    
    return message;
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
