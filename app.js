// Load products from API and display them
const loadProducts = ()=>{
    fetch('https://fakestoreapi.com/products')
    .then((res)=> res.json())
    .then((data)=>{
        displayProduct(data);
    })
}

// Display products in a responsive grid using Bootstrap
const displayProduct = (products)=>{
    const product_container = document.getElementById('product_container')
    products.forEach(element => {
        const div = document.createElement('div');
        div.classList.add('col-xl-3', 'col-lg-4', 'col-md-6', 'col-12'); // Responsive columns
        div.innerHTML = `
        <div class="card h-100 shadow-sm">
            <img class='card-img-top' src='${element.image}' alt='${element.title.slice(0,22)}' style='height: 200px; object-fit: contain;' />
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${element.title.slice(0,30)}</h5>
                <p class="card-text text-muted">${element.description.slice(0,60)}...</p>
                <h6 class="card-subtitle mb-2 text-primary">$${element.price}</h6>
                <div class="mt-auto">
                    <button class="btn btn-outline-primary my-3" onclick="singleProduct('${element.id}')">Details</button>
                    <button class="btn btn-primary" onclick="HandleAddToCart('${element.price}', '${element.title}')">Add to Cart</button>
                </div>
            </div>
        </div>
        `
        product_container.appendChild(div);
    });
}

// Cart toggle functionality
const cartToggle = document.getElementById('cart_toggle');

cartToggle.addEventListener('click', ()=>{
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    cartModal.show();
    updateCartButtonText();
});

// Update cart button text with item count
const updateCartButtonText = () => {
    const totalItems = document.getElementById('total_items').textContent;
    cartToggle.textContent = `Cart (${totalItems})`;
}

// Show temporary success message
const showSuccessMessage = (message) => {
    const alertContainer = document.getElementById('alert_container');
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show';
    alert.role = 'alert';
    alert.innerHTML = `
        <div>${message}</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.classList.remove('show');
        alert.classList.add('hide');
        alert.addEventListener('transitionend', () => alert.remove(), { once: true });
    }, 2000);
}

// Add item to cart
const HandleAddToCart = (price, name)=>{
    const cartItemsContainer = document.getElementById('cart_items');
    const cartItem = document.createElement('div');
    cartItem.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-2', 'p-2', 'border', 'rounded');
    cartItem.innerHTML = `
        <span class="fw-bold">${name}</span>
        <span class="text-primary price">$${price}</span>
    `
    cartItemsContainer.appendChild(cartItem);
    UpdateTotal();
    updateCartButtonText();
    showSuccessMessage(`${name} added to cart`);
}

// Update total price and item count
const UpdateTotal =()=>{
    const allPrices = document.getElementsByClassName('price');
    let total_price = 0;
    let total_items = allPrices.length;
    for(const element of allPrices){
        total_price+= parseFloat(element.innerText.replace('$', ''));
    }
    document.getElementById('total_amount').innerText = `$${total_price.toFixed(2)}`;
    document.getElementById('total_items').innerText = total_items;
    updateCartButtonText();
}

// Fetch single product and show in modal
const singleProduct = (id)=>{
    fetch(`https://fakestoreapi.com/products/${id}`)
    .then(response => response.json())
    .then(data => {
        // Populate modal with product data
        document.getElementById('modalImage').src = data.image;
        document.getElementById('modalImage').alt = data.title;
        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalCategory').textContent = data.category;
        document.getElementById('modalPrice').textContent = `$${data.price}`;
        document.getElementById('modalDescription').textContent = data.description;
        document.getElementById('modalAddToCart').onclick = () => HandleAddToCart(data.price, data.title);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
    });
}

// Initialize the app
loadProducts();