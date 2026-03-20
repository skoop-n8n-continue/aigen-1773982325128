// Function to load data from data.json
async function loadAppData() {
    try {
        console.log('Fetching data.json...');
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Data loaded:', data);
        return data;
    } catch (error) {
        console.error('Failed to load app data:', error);
        // Fallback for local development if fetch fails
        if (window.location.protocol === 'file:') {
            console.warn('Fetch might fail on file:// protocol due to CORS. In production this will be replaced.');
        }
        return null;
    }
}

// Function to apply styles from data.json
function applyStyles(data) {
    const settings = data.sections.app_settings;
    const doc = document.documentElement;

    if (settings.primary_color) doc.style.setProperty('--primary-color', settings.primary_color.value);
    if (settings.secondary_color) doc.style.setProperty('--secondary-color', settings.secondary_color.value);
    if (settings.background_color) doc.style.setProperty('--background-color', settings.background_color.value);
    if (settings.text_color) doc.style.setProperty('--text-color', settings.text_color.value);
}

// Function to render the menu content
function renderMenu(data) {
    const categories = data.sections.categories.value;
    const products = data.sections.products.value;
    const container = document.getElementById('menu-container');

    container.innerHTML = ''; // Clear existing content

    categories.forEach(category => {
        // Create category section
        const catSection = document.createElement('div');
        catSection.className = 'category-section';

        // Filter products for this category
        const catProducts = products.filter(p => p.category === category.id);

        if (catProducts.length === 0) return;

        // Render category header
        const header = document.createElement('div');
        header.className = 'category-header';
        header.innerHTML = `
            <div class="category-name">${category.name}</div>
            <div class="header-cols">
                <div class="header-col">THC</div>
                <div class="header-col">Price</div>
            </div>
        `;
        catSection.appendChild(header);

        // Render product list for this category
        const productList = document.createElement('div');
        productList.className = 'product-list';

        catProducts.forEach(product => {
            const item = document.createElement('div');
            item.className = `product-item item-${product.brand.toLowerCase().replace(/\s/g, '-')}`;

            // Format price as currency if needed
            const formattedPrice = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
            }).format(product.price);

            item.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.name}" class="product-thumbnail">
                <div class="product-info">
                    <div class="product-name-brand">
                        ${product.name}
                        <span class="brand-tag">${product.brand}</span>
                    </div>
                </div>
                <div class="product-stats">
                    <div class="thc-value">${product.thc}</div>
                    <div class="price-container">
                        <div class="price-value">${formattedPrice}</div>
                        <div class="weight-value">${product.weight}</div>
                    </div>
                </div>
            `;
            productList.appendChild(item);
        });

        catSection.appendChild(productList);
        container.appendChild(catSection);
    });
}

// Initialize the application
async function init() {
    const data = await loadAppData();
    if (!data) return;

    applyStyles(data);
    renderMenu(data);

    // Reveal the app container after everything is loaded and applied
    setTimeout(() => {
        document.getElementById('app-container').classList.add('loaded');
    }, 50);
}

// Start the app
init();
