/**
 * Food Ordering App JavaScript
 * This file handles all the functionality of the food ordering application
 * Security-enhanced version with input validation and sanitization
 */

// Security utilities
const SecurityUtils = {
    // HTML sanitization to prevent XSS attacks
    sanitizeHTML: function(str) {
        if (typeof str !== 'string') return '';
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },
    
    // Input validation patterns
    patterns: {
        name: /^[a-zA-Z\s\u00C0-\u017F]{2,50}$/,
        phone: /^(\+62|62|0)[0-9]{8,13}$/,
        quantity: /^[1-9][0-9]{0,2}$/,
        id: /^[1-9][0-9]*$/
    },
    
    // Validate input against pattern
    validateInput: function(input, type) {
        if (!input || typeof input !== 'string') return false;
        const pattern = this.patterns[type];
        return pattern ? pattern.test(input.trim()) : false;
    },
    
    // Sanitize and validate text input
    sanitizeAndValidate: function(input, type, maxLength = 1000) {
        if (!input) return { isValid: false, value: '', error: 'Input is required' };
        
        const sanitized = this.sanitizeHTML(input.toString().trim());
        
        if (sanitized.length === 0) {
            return { isValid: false, value: '', error: 'Input cannot be empty' };
        }
        
        if (sanitized.length > maxLength) {
            return { isValid: false, value: '', error: `Input too long (max ${maxLength} characters)` };
        }
        
        if (type && !this.validateInput(sanitized, type)) {
            return { isValid: false, value: '', error: `Invalid ${type} format` };
        }
        
        return { isValid: true, value: sanitized, error: null };
    },
    
    // Validate numeric input
    validateNumber: function(input, min = 0, max = Number.MAX_SAFE_INTEGER) {
        const num = parseInt(input);
        if (isNaN(num) || num < min || num > max) {
            return { isValid: false, value: 0, error: `Number must be between ${min} and ${max}` };
        }
        return { isValid: true, value: num, error: null };
    },
    
    // Rate limiting for form submissions
    rateLimiter: {
        attempts: new Map(),
        maxAttempts: 5,
        windowMs: 60000, // 1 minute
        
        isAllowed: function(key) {
            const now = Date.now();
            const attempts = this.attempts.get(key) || [];
            
            // Remove old attempts outside the window
            const validAttempts = attempts.filter(time => now - time < this.windowMs);
            
            if (validAttempts.length >= this.maxAttempts) {
                return false;
            }
            
            validAttempts.push(now);
            this.attempts.set(key, validAttempts);
            return true;
        }
    }
};

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
            image: "https://placehold.co/600x400/E91E63/ffffff?text=Es+Krim+Goreng",
            isNew: true
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
    setupFormValidation();
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
            // Validate product data
            if (!product || typeof product.id !== 'number' || !product.name || !product.price) {
                console.warn('Invalid product data:', product);
                return;
            }
            
            const productCol = document.createElement('div');
            productCol.className = 'col-lg-4 col-md-6 mb-4';
            
            // Create secure product card
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.setAttribute('data-id', product.id.toString());
            
            // Image container
            const imageContainer = document.createElement('div');
            imageContainer.className = 'position-relative';
            
            const img = document.createElement('img');
            img.src = SecurityUtils.sanitizeHTML(product.image || '');
            img.alt = SecurityUtils.sanitizeHTML(product.name);
            img.className = 'product-image';
            img.onerror = function() { this.src = 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image'; };
            imageContainer.appendChild(img);
            
            // New badge if applicable
            if (product.isNew) {
                const badge = document.createElement('span');
                badge.className = 'badge bg-success new-badge position-absolute';
                badge.textContent = 'New';
                imageContainer.appendChild(badge);
            }
            
            // Product title
            const title = document.createElement('h4');
            title.className = 'product-title';
            title.textContent = SecurityUtils.sanitizeHTML(product.name);
            
            // Product price
            const price = document.createElement('p');
            price.className = 'product-price';
            price.textContent = formatPrice(product.price);
            
            // View details button
            const button = document.createElement('button');
            button.className = 'btn btn-primary view-details';
            button.textContent = 'View Details';
            
            // Assemble product card
            productCard.appendChild(imageContainer);
            productCard.appendChild(title);
            productCard.appendChild(price);
            productCard.appendChild(button);
            
            productCol.appendChild(productCard);
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
    
    // Validate product ID
    const productIdStr = productCard.dataset.id;
    const idValidation = SecurityUtils.validateNumber(productIdStr, 1, 999999);
    
    if (!idValidation.isValid) {
        console.error('Invalid product ID:', productIdStr);
        showErrorMessage('Invalid product selected');
        return;
    }
    
    const product = products.find(p => p.id === idValidation.value);
    
    if (!product) {
        console.error('Product not found:', idValidation.value);
        showErrorMessage('Product not found');
        return;
    }
    
    if (e.target.classList.contains('view-details')) {
        showProductDetails(product);
    }
}

// Show product details in modal
function showProductDetails(product) {
    // Clear previous content
    productDetailsEl.innerHTML = '';
    
    // Create secure modal content
    const row = document.createElement('div');
    row.className = 'row';
    
    // Image column
    const imageCol = document.createElement('div');
    imageCol.className = 'col-md-6';
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'position-relative';
    
    const img = document.createElement('img');
    img.src = SecurityUtils.sanitizeHTML(product.image || '');
    img.alt = SecurityUtils.sanitizeHTML(product.name);
    img.className = 'img-fluid rounded';
    img.onerror = function() { this.src = 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image'; };
    imageContainer.appendChild(img);
    
    // New badge if applicable
    if (product.isNew) {
        const badge = document.createElement('span');
        badge.className = 'badge bg-success new-badge position-absolute';
        badge.textContent = 'New';
        imageContainer.appendChild(badge);
    }
    
    imageCol.appendChild(imageContainer);
    
    // Details column
    const detailsCol = document.createElement('div');
    detailsCol.className = 'col-md-6';
    
    // Product title
    const title = document.createElement('h3');
    title.textContent = SecurityUtils.sanitizeHTML(product.name);
    if (product.isNew) {
        const badge = document.createElement('span');
        badge.className = 'badge bg-success ms-2';
        badge.textContent = 'New';
        title.appendChild(badge);
    }
    
    // Product price
    const price = document.createElement('p');
    price.className = 'product-price h4 text-primary';
    price.textContent = formatPrice(product.price);
    
    // Product description
    const description = document.createElement('p');
    description.textContent = SecurityUtils.sanitizeHTML(product.description || '');
    
    // Add to cart button
    const addToCartBtn = document.createElement('button');
    addToCartBtn.className = 'btn btn-primary add-to-cart';
    addToCartBtn.textContent = 'Add to Cart';
    addToCartBtn.setAttribute('data-id', product.id.toString());
    
    // Assemble details column
    detailsCol.appendChild(title);
    detailsCol.appendChild(price);
    detailsCol.appendChild(description);
    detailsCol.appendChild(addToCartBtn);
    
    // Assemble row
    row.appendChild(imageCol);
    row.appendChild(detailsCol);
    productDetailsEl.appendChild(row);
    
    bootstrapModal.show();
    
    // Add event listener to Add to Cart button
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
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Your cart is empty.';
        cartItemsEl.appendChild(emptyMessage);
        updateCartTotal();
        return;
    }
    
    cart.forEach(item => {
        // Validate cart item
        if (!item || typeof item.id !== 'number' || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
            console.warn('Invalid cart item:', item);
            return;
        }
        
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item d-flex align-items-center p-3 border-bottom';
        
        // Item image
        const img = document.createElement('img');
        img.src = SecurityUtils.sanitizeHTML(item.image || '');
        img.alt = SecurityUtils.sanitizeHTML(item.name);
        img.className = 'cart-item-image rounded me-3';
        img.style.cssText = 'width: 80px; height: 80px; object-fit: cover;';
        img.onerror = function() { this.src = 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image'; };
        
        // Item details
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'cart-item-details flex-grow-1';
        
        const title = document.createElement('h5');
        title.className = 'cart-item-title mb-1';
        title.textContent = SecurityUtils.sanitizeHTML(item.name);
        
        const price = document.createElement('p');
        price.className = 'cart-item-price mb-0 text-primary';
        price.textContent = formatPrice(item.price);
        
        detailsDiv.appendChild(title);
        detailsDiv.appendChild(price);
        
        // Quantity controls
        const quantityDiv = document.createElement('div');
        quantityDiv.className = 'cart-item-quantity d-flex align-items-center me-3';
        
        const decreaseBtn = document.createElement('button');
        decreaseBtn.className = 'btn btn-outline-secondary btn-sm quantity-btn decrease';
        decreaseBtn.setAttribute('data-id', item.id.toString());
        decreaseBtn.textContent = '-';
        
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.className = 'form-control form-control-sm mx-2 quantity-input';
        quantityInput.value = item.quantity.toString();
        quantityInput.min = '1';
        quantityInput.max = '999';
        quantityInput.setAttribute('data-id', item.id.toString());
        quantityInput.style.width = '60px';
        quantityInput.setAttribute('title', 'Quantity must be between 1 and 999');
        
        const increaseBtn = document.createElement('button');
        increaseBtn.className = 'btn btn-outline-secondary btn-sm quantity-btn increase';
        increaseBtn.setAttribute('data-id', item.id.toString());
        increaseBtn.textContent = '+';
        
        quantityDiv.appendChild(decreaseBtn);
        quantityDiv.appendChild(quantityInput);
        quantityDiv.appendChild(increaseBtn);
        
        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn btn-outline-danger btn-sm remove-item';
        removeBtn.setAttribute('data-id', item.id.toString());
        
        const trashIcon = document.createElement('i');
        trashIcon.className = 'fas fa-trash';
        removeBtn.appendChild(trashIcon);
        
        // Assemble cart item
        cartItemEl.appendChild(img);
        cartItemEl.appendChild(detailsDiv);
        cartItemEl.appendChild(quantityDiv);
        cartItemEl.appendChild(removeBtn);
        
        cartItemsEl.appendChild(cartItemEl);
    });
    
    // Add event listeners to quantity buttons and remove buttons
    const decreaseBtns = document.querySelectorAll('.decrease');
    const increaseBtns = document.querySelectorAll('.increase');
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const removeItemBtns = document.querySelectorAll('.remove-item');
    
    decreaseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const idValidation = SecurityUtils.validateNumber(btn.dataset.id, 1, 999999);
            if (idValidation.isValid) {
                updateItemQuantity(idValidation.value, 'decrease');
            }
        });
    });
    
    increaseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const idValidation = SecurityUtils.validateNumber(btn.dataset.id, 1, 999999);
            if (idValidation.isValid) {
                updateItemQuantity(idValidation.value, 'increase');
            }
        });
    });
    
    quantityInputs.forEach(input => {
        input.addEventListener('change', () => {
            const idValidation = SecurityUtils.validateNumber(input.dataset.id, 1, 999999);
            const quantityValidation = SecurityUtils.validateNumber(input.value, 1, 999);
            
            if (idValidation.isValid && quantityValidation.isValid) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
                updateItemQuantity(idValidation.value, 'set', quantityValidation.value);
            } else {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                
                // Reset to current quantity if invalid
                const item = cart.find(item => item.id === idValidation.value);
                if (item) {
                    setTimeout(() => {
                        input.value = item.quantity;
                        input.classList.remove('is-invalid');
                    }, 1500);
                }
                showErrorMessage('Invalid quantity. Please enter a number between 1 and 999.');
            }
        });
        
        // Clear validation state on input
        input.addEventListener('input', () => {
            input.classList.remove('is-valid', 'is-invalid');
        });
    });
    
    removeItemBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const idValidation = SecurityUtils.validateNumber(btn.dataset.id, 1, 999999);
            if (idValidation.isValid) {
                removeItem(idValidation.value);
            }
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
        // Validate cart item
        if (!item || typeof item.id !== 'number' || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
            console.warn('Invalid cart item in order summary:', item);
            return;
        }
        
        const orderItemEl = document.createElement('div');
        orderItemEl.className = 'order-item d-flex justify-content-between align-items-center py-2 border-bottom';
        
        // Item details
        const itemDetails = document.createElement('div');
        const itemName = document.createElement('strong');
        itemName.textContent = SecurityUtils.sanitizeHTML(item.name);
        itemDetails.appendChild(itemName);
        itemDetails.appendChild(document.createTextNode(` x ${item.quantity}`));
        
        // Item total
        const itemTotal = document.createElement('div');
        itemTotal.className = 'text-primary fw-bold';
        itemTotal.textContent = formatPrice(item.price * item.quantity);
        
        orderItemEl.appendChild(itemDetails);
        orderItemEl.appendChild(itemTotal);
        orderSummaryEl.appendChild(orderItemEl);
    });
}

// Show error message
function showErrorMessage(message) {
    // Create or update error alert
    let errorAlert = document.getElementById('error-alert');
    if (!errorAlert) {
        errorAlert = document.createElement('div');
        errorAlert.id = 'error-alert';
        errorAlert.className = 'alert alert-danger alert-dismissible fade show position-fixed';
        errorAlert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
        document.body.appendChild(errorAlert);
    }
    
    errorAlert.innerHTML = `
        ${SecurityUtils.sanitizeHTML(message)}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (errorAlert && errorAlert.parentNode) {
            errorAlert.remove();
        }
    }, 5000);
}

// Handle order submission
function handleOrderSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Rate limiting check
    const clientId = 'order_submission';
    if (!SecurityUtils.rateLimiter.isAllowed(clientId)) {
        showErrorMessage('Too many order attempts. Please wait a minute before trying again.');
        return;
    }
    
    // Get form and form elements
    const form = e.target;
    const nameInput = document.getElementById('name');
    const addressInput = document.getElementById('address');
    const phoneInput = document.getElementById('phone');
    const notesInput = document.getElementById('notes');
    
    if (!nameInput || !addressInput || !phoneInput || !notesInput) {
        showErrorMessage('Form elements not found. Please refresh the page.');
        return;
    }
    
    // Reset previous validation states
    clearFormValidation(form);
    
    // Validate required fields with Bootstrap validation
    let isFormValid = true;
    const validationResults = {};
    
    // Validate name
    const nameValidation = SecurityUtils.sanitizeAndValidate(nameInput.value, 'name', 50);
    validationResults.name = nameValidation;
    if (!nameValidation.isValid) {
        setFieldInvalid(nameInput, nameValidation.error);
        isFormValid = false;
    } else {
        setFieldValid(nameInput);
    }
    
    // Validate address
    const addressValidation = SecurityUtils.sanitizeAndValidate(addressInput.value, null, 200);
    if (addressValidation.value.length < 10) {
        addressValidation.isValid = false;
        addressValidation.error = 'Address must be at least 10 characters long';
    }
    validationResults.address = addressValidation;
    if (!addressValidation.isValid) {
        setFieldInvalid(addressInput, addressValidation.error);
        isFormValid = false;
    } else {
        setFieldValid(addressInput);
    }
    
    // Validate phone
    const phoneValidation = SecurityUtils.sanitizeAndValidate(phoneInput.value, 'phone', 20);
    validationResults.phone = phoneValidation;
    if (!phoneValidation.isValid) {
        setFieldInvalid(phoneInput, phoneValidation.error);
        isFormValid = false;
    } else {
        setFieldValid(phoneInput);
    }
    
    // Validate notes (optional)
    const notesValidation = SecurityUtils.sanitizeAndValidate(notesInput.value || '', null, 500);
    validationResults.notes = notesValidation;
    if (notesInput.value && !notesValidation.isValid) {
        setFieldInvalid(notesInput, notesValidation.error);
        isFormValid = false;
    } else if (notesInput.value) {
        setFieldValid(notesInput);
    }
    
    // Add Bootstrap validation classes
    form.classList.add('was-validated');
    
    // Validate cart
    if (cart.length === 0) {
        showErrorMessage('Your cart is empty. Please add items before placing an order.');
        isFormValid = false;
    }
    
    // Validate cart items
    const invalidItems = cart.filter(item => 
        !item || typeof item.id !== 'number' || !item.name || 
        typeof item.price !== 'number' || typeof item.quantity !== 'number' ||
        item.quantity < 1 || item.quantity > 999
    );
    
    if (invalidItems.length > 0) {
        showErrorMessage('Invalid items found in cart. Please refresh and try again.');
        isFormValid = false;
    }
    
    // If form is not valid, stop here
    if (!isFormValid) {
        return;
    }
    
    try {
        // Create WhatsApp message
        const message = createWhatsAppMessage(
            validationResults.name.value, 
            validationResults.address.value, 
            validationResults.phone.value, 
            validationResults.notes.value || ''
        );
        
        // Open WhatsApp with pre-filled message
        const whatsappUrl = `https://wa.me/62895332782122?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        // Show thank you modal
        thankYouModal.show();
        
        // Reset cart and form
        cart = [];
        updateCartCount();
        orderFormEl.reset();
        clearFormValidation(form);
        showProductCatalog();
        
    } catch (error) {
        console.error('Order submission error:', error);
        showErrorMessage('An error occurred while processing your order. Please try again.');
    }
}

// Set field as invalid with Bootstrap classes
function setFieldInvalid(field, message) {
    field.classList.remove('is-valid');
    field.classList.add('is-invalid');
    
    // Update invalid feedback message
    const feedback = field.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.textContent = message;
    }
}

// Set field as valid with Bootstrap classes
function setFieldValid(field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
}

// Clear all form validation states
function clearFormValidation(form) {
    form.classList.remove('was-validated');
    
    const fields = form.querySelectorAll('.form-control');
    fields.forEach(field => {
        field.classList.remove('is-valid', 'is-invalid');
    });
}

// Real-time validation for form fields
function setupFormValidation() {
    const nameInput = document.getElementById('name');
    const addressInput = document.getElementById('address');
    const phoneInput = document.getElementById('phone');
    const notesInput = document.getElementById('notes');
    
    if (nameInput) {
        nameInput.addEventListener('blur', () => validateField(nameInput, 'name'));
        nameInput.addEventListener('input', () => clearFieldValidation(nameInput));
    }
    
    if (addressInput) {
        addressInput.addEventListener('blur', () => validateField(addressInput, 'address'));
        addressInput.addEventListener('input', () => clearFieldValidation(addressInput));
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('blur', () => validateField(phoneInput, 'phone'));
        phoneInput.addEventListener('input', () => clearFieldValidation(phoneInput));
    }
    
    if (notesInput) {
        notesInput.addEventListener('blur', () => validateField(notesInput, 'notes'));
        notesInput.addEventListener('input', () => clearFieldValidation(notesInput));
    }
}

// Validate individual field
function validateField(field, type) {
    let validation;
    
    switch (type) {
        case 'name':
            validation = SecurityUtils.sanitizeAndValidate(field.value, 'name', 50);
            break;
        case 'address':
            validation = SecurityUtils.sanitizeAndValidate(field.value, null, 200);
            if (validation.isValid && validation.value.length < 10) {
                validation.isValid = false;
                validation.error = 'Address must be at least 10 characters long';
            }
            break;
        case 'phone':
            validation = SecurityUtils.sanitizeAndValidate(field.value, 'phone', 20);
            break;
        case 'notes':
            if (!field.value) return; // Notes are optional
            validation = SecurityUtils.sanitizeAndValidate(field.value, null, 500);
            break;
        default:
            return;
    }
    
    if (validation.isValid) {
        setFieldValid(field);
    } else {
        setFieldInvalid(field, validation.error);
    }
}

// Clear field validation state
function clearFieldValidation(field) {
    field.classList.remove('is-valid', 'is-invalid');
}

// Create WhatsApp message
function createWhatsAppMessage(name, address, phone, notes) {
    try {
        let message = `*New Order*\n\n`;
        message += `*Customer Details*\n`;
        message += `Name: ${name}\n`;
        message += `Address: ${address}\n`;
        message += `Phone: ${phone}\n\n`;
        
        message += `*Order Items*\n`;
        
        // Validate and add cart items
        let total = 0;
        cart.forEach(item => {
            if (item && item.name && typeof item.price === 'number' && typeof item.quantity === 'number') {
                const itemTotal = item.price * item.quantity;
                message += `${item.name} x ${item.quantity} - ${formatPrice(itemTotal)}\n`;
                total += itemTotal;
            }
        });
        
        message += `\n*Total: ${formatPrice(total)}*`;
        
        // Add notes if provided
        if (notes && notes.trim()) {
            message += `\n\n*Order Notes*\n${notes}`;
        }
        
        return message;
    } catch (error) {
        console.error('Error creating WhatsApp message:', error);
        throw new Error('Failed to create order message');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
