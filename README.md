# Food Ordering Web Application

A responsive food ordering web application that allows users to browse a product catalog, add items to a cart, and place orders via WhatsApp.

## Features

- Product catalog with placeholder images
- Product details page with "Add to Cart" functionality
- Shopping cart with quantity adjustments and price calculations
- Checkout form collecting customer information
- WhatsApp integration for order submission
- Responsive design for mobile, tablet, and desktop

## Technologies Used

- HTML5
- CSS3 with Bootstrap 5 framework
- Vanilla JavaScript
- Bootstrap 5 for responsive design and components
- Font Awesome for icons
- Google Fonts for typography
- WhatsApp Click-to-Chat API

## Setup Instructions

1. Clone this repository to your local machine
2. Open the `index.html` file in your web browser

No server setup is required as this is a client-side only application.

## Testing the WhatsApp Ordering Flow

1. Browse the product catalog and click "View Details" on any product
2. Click "Add to Cart" to add the product to your shopping cart
3. Click the cart icon in the top-right corner to view your cart
4. Adjust quantities or remove items as needed
5. Click "Checkout" to proceed to the checkout form
6. Fill in your name, delivery address, and phone number
7. Click "Place Order via WhatsApp" to generate a pre-filled WhatsApp message
8. A new tab will open with WhatsApp Web (or the WhatsApp app on mobile) with the order details pre-filled
9. Send the message to complete your order

Note: The WhatsApp message will be sent to the number +62 895 3327 82122. This is a placeholder number and should be replaced with your actual business WhatsApp number in a production environment.

## Customization

- To change the product catalog, edit the `products` array in `js/app.js`
- To modify the styling, edit the `css/styles.css` file
- To change the WhatsApp number, update the `whatsappUrl` variable in the `handleOrderSubmit` function in `js/app.js`

## License

This project is open source and available for personal and commercial use.
