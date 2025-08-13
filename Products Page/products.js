
// Configuration for products page path to the JSON file containing product data relative to the product HTML file
const JSON_PATH   = 'products.json';
const IMAGE_BASE  = '../images/';
const FIRST_INDEX = 5;
const COUNT       = 12;


// Loads products from JSON and render them

async function loadProducts() {
  const gridEl = document.getElementById('products-grid');

  try {
    // Fetch JSON from the same folder
    const res = await fetch(JSON_PATH);

    // Throw an error if the HTTP request fails (ex: file missing, 404)
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // Convert JSON into a JS array
    let items = await res.json();

    // Limit to only the first 12 products
    items = items.slice(0, COUNT);
    const withImages = items.map((p, i) => {
      // If product already has an image path in JSON, keep it
      if (p.image && typeof p.image === 'string' && p.image.trim()) return p;
      // Otherwise, assign a default based on position (p5, p6, etc…)
      const n = FIRST_INDEX + i;
      return { ...p, image: `${IMAGE_BASE}p${n}.jpg` };
    });

    // Render the HTML for all products into the grid
    gridEl.innerHTML = withImages.map((p, i) => renderCard(p, i)).join('');
  } catch (err) {
    // Show an error in console and on the page if loading fails
    console.error('Failed to load products:', err);
    gridEl.innerHTML = `<p style="color:#c00">Couldn't load products.</p>`;
  }
}



function renderCard(p, i) {
  const title = safe(p.name || 'untitled');
  const size  = safe(p.size || '—');

  // Combine artist and year into one string (e.g., "Name (2020)")
  const artistYear = [p.artist, p.year ? `(${p.year})` : '']
    .filter(Boolean)
    .join(' ');

  // Format the price with commas and dollar sign
  const price = formatPrice(p.price);

  // Create fallback image list (tries jpg, png, jpeg)
  const baseFromIndex = `${IMAGE_BASE}p${FIRST_INDEX + i}`;
  const candidates = [
    (p.image && p.image.trim()) || `${baseFromIndex}.jpg`,
    `${baseFromIndex}.png`,
    `${baseFromIndex}.jpeg`,
    `${IMAGE_BASE}placeholder.jpg`
  ];

  // Inline fallback logic for image loading errors
  const onErr = candidates.slice(1).map((src, idx, arr) => {
    const next = arr[idx + 1];
    return `this.onerror=${next ? `function(){this.src='${next}';}` : 'null'}; this.src='${src}';`;
  }).join(' ');

  // Final HTML for one card
  return `
    <article class="card">
      <div class="thumb">
        <img src="${candidates[0]}" alt="${title}" onerror="${onErr}">
      </div>
      <div class="row">
        <h3 class="title">${title}</h3>
        <div class="size">${size}</div>
      </div>
      <div class="meta">
        <div class="artist">${safe(artistYear)}</div>
        <div class="price">${price}</div>
      </div>
    </article>
  `;
}


// Utility: Format number into US currency
function formatPrice(value){
  if (value === 0 || value === '0') return '$0';
  if (value == null || value === '' || isNaN(Number(value))) return '$—';
  return new Intl.NumberFormat('en-US', {
    style:'currency', currency:'USD', maximumFractionDigits:0
  }).format(Number(value));
}

// Utility: Escape HTML special characters to prevent injection
function safe(s=''){
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}


// Kick things off on load
loadProducts();

