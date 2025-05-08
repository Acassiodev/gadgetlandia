// Dados dos produtos
const products = [
    {
        id: 1,
        name: "Smartphone XYZ",
        description: "O mais novo smartphone com câmera de 48MP",
        price: 1999.99,
        oldPrice: 2499.99,
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        featured: true
    },
    {
        id: 2,
        name: "Notebook Ultra",
        description: "Notebook com processador i7 e 16GB de RAM",
        price: 4599.99,
        oldPrice: 4999.99,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        featured: true
    },
    {
        id: 3,
        name: "Fones de Ouvido",
        description: "Fones sem fio com cancelamento de ruído",
        price: 599.99,
        oldPrice: 799.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        featured: false
    },
    {
        id: 4,
        name: "Smartwatch Pro",
        description: "Relógio inteligente com monitor cardíaco",
        price: 899.99,
        oldPrice: 999.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        featured: false
    },
    {
        id: 5,
        name: "Câmera DSLR",
        description: "Câmera profissional 24.2MP",
        price: 3499.99,
        oldPrice: 3999.99,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        featured: true
    },
    {
        id: 6,
        name: "Tablet HD",
        description: "Tablet com tela de 10 polegadas",
        price: 1299.99,
        oldPrice: 1499.99,
        image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        featured: false
    }
];

// Carrinho de compras
let cart = [];

// Elementos do DOM
const productContainer = document.querySelector('.product-container');
const featuredContainer = document.querySelector('.featured-container');
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.querySelector('.cart-modal');
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total span');
const cartCount = document.querySelector('.cart-count');
const newsletterForm = document.getElementById('newsletter-form');

// Carregar produtos
function loadProducts() {
    productContainer.innerHTML = '';
    featuredContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productContainer.appendChild(productCard);
        
        if (product.featured) {
            const featuredCard = createProductCard(product);
            featuredContainer.appendChild(featuredCard);
        }
    });
}

// Criar card de produto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">
                <div>
                    <span class="price">R$ ${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">R$ ${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="add-to-cart" data-id="${product.id}">Adicionar</button>
            </div>
        </div>
    `;
    
    return card;
}

// Adicionar ao carrinho
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
    
    updateCart();
}

// Remover do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Atualizar quantidade no carrinho
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity > 0 ? newQuantity : 1;
        updateCart();
    }
}

// Atualizar carrinho
function updateCart() {
    // Atualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Atualizar modal do carrinho
    cartItemsContainer.innerHTML = '';
    
    let totalPrice = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="cart-item-price">R$ ${item.price.toFixed(2)}</span>
                <div class="cart-item-quantity">
                    <button class="decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase" data-id="${item.id}">+</button>
                </div>
                <span class="remove-item" data-id="${item.id}">Remover</span>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Atualizar total
    cartTotal.textContent = totalPrice.toFixed(2);
    
    // Salvar no localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Carregar carrinho do localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCart();
    
    // Adicionar ao carrinho
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
            
            // Feedback visual
            e.target.textContent = 'Adicionado!';
            e.target.style.backgroundColor = '#4CAF50';
            setTimeout(() => {
                e.target.textContent = 'Adicionar';
                e.target.style.backgroundColor = '#333';
            }, 1000);
        }
        
        // Remover item
        if (e.target.classList.contains('remove-item')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
        }
        
        // Aumentar quantidade
        if (e.target.classList.contains('increase')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) {
                updateQuantity(productId, item.quantity + 1);
            }
        }
        
        // Diminuir quantidade
        if (e.target.classList.contains('decrease')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item && item.quantity > 1) {
                updateQuantity(productId, item.quantity - 1);
            }
        }
    });
    
    // Abrir/fechar carrinho
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex';
    });
    
    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    // Fechar carrinho clicando fora
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Newsletter
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value;
        alert(`Obrigado por assinar nossa newsletter! Enviaremos ofertas para ${email}`);
        newsletterForm.reset();
    });
    
    // Finalizar compra
    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        
        alert('Compra finalizada com sucesso! Obrigado por comprar conosco.');
        cart = [];
        updateCart();
        cartModal.style.display = 'none';
    });
});