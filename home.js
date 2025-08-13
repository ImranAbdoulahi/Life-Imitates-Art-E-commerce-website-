// load featured items from products.json and render cards
(async function () {
  try {
    // Fetch the JSON file containing all products
    const res = await fetch('home.json');

    // Throw an error if the response is not OK
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // Parse the JSON into a JavaScript array/object
    const all = await res.json();
    const featured = all.filter(p => p.featured);

    const el = document.getElementById('featured-grid');
    el.innerHTML = featured.map(cardHTML).join('');
  } catch (e) {
    console.error(e);
    document.getElementById('featured-grid').innerHTML =
      `<p style="color:#c00">Couldn't load featured items.</p>`;
  }
})();

// Generates HTML for a single product card + accepts a product object and returns a string of HTML
function cardHTML(p){
  const img = p.image || 'images/placeholder.png';
  const location = p.location || '—';
  const date = p.date || '—';
  return `
    <article class="card">
      <header class="card-title">${escapeHTML(p.name)}</header>
      <div class="thumb">
        <img src="${img}" alt="${escapeHTML(p.name)}" />
      </div>
      <div class="meta">
        <div>${escapeHTML(location)}</div>
        <div>${escapeHTML(date)}</div>
      </div>
    </article>
  `;
}

// Escape HTML special characters to prevent broken HTML when inserting text values
function escapeHTML(s=''){
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
