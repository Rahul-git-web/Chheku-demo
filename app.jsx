const { useMemo, useState } = React;

const products = [
  { id: 1, name: 'AirFlex Running Shoes', category: 'Footwear', price: 89, rating: 4.8, badge: 'Best Seller', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80' },
  { id: 2, name: 'Urban Leather Backpack', category: 'Bags', price: 120, rating: 4.6, badge: 'New Arrival', image: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=700&q=80' },
  { id: 3, name: 'Noise-Cancel Headphones', category: 'Electronics', price: 149, rating: 4.9, badge: 'Top Rated', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=700&q=80' },
  { id: 4, name: 'Minimal Analog Watch', category: 'Accessories', price: 75, rating: 4.5, badge: 'Limited', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=700&q=80' },
  { id: 5, name: 'Eco Cotton Hoodie', category: 'Fashion', price: 59, rating: 4.7, badge: 'Popular', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80' },
  { id: 6, name: 'Smart Fitness Band', category: 'Electronics', price: 99, rating: 4.4, badge: 'Hot Deal', image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=700&q=80' }
];

function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState({});

  const categories = useMemo(() => ['All', ...new Set(products.map((item) => item.category))], []);

  const visibleProducts = useMemo(() => products.filter((item) => {
    const inCategory = category === 'All' || item.category === category;
    const inSearch = item.name.toLowerCase().includes(query.toLowerCase().trim());
    return inCategory && inSearch;
  }), [category, query]);

  const cartItems = useMemo(() => Object.entries(cart).map(([id, quantity]) => {
    const product = products.find((item) => item.id === Number(id));
    return { ...product, quantity };
  }), [cart]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const addToCart = (id) => setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const updateQuantity = (id, amount) => {
    setCart((prev) => {
      const next = (prev[id] || 0) + amount;
      const updated = { ...prev };
      if (next <= 0) delete updated[id];
      else updated[id] = next;
      return updated;
    });
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="tag">Modern React E-Commerce</p>
          <h1>ShopHub</h1>
          <p>Discover quality products, add to cart, and experience a complete shopping interface.</p>
        </div>
        <div className="cart-summary">
          <h2>Cart</h2>
          <p>{totalItems} item(s)</p>
          <strong>${totalPrice.toFixed(2)}</strong>
        </div>
      </header>

      <section className="filters">
        <input type="text" placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="chips">
          {categories.map((item) => (
            <button key={item} className={item === category ? 'chip active' : 'chip'} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>
      </section>

      <main className="layout">
        <section className="products-grid">
          {visibleProducts.map((item) => (
            <article key={item.id} className="product-card">
              <img src={item.image} alt={item.name} loading="lazy" />
              <span className="badge">{item.badge}</span>
              <h3>{item.name}</h3>
              <p className="muted">{item.category}</p>
              <div className="row">
                <strong>${item.price}</strong>
                <small>⭐ {item.rating}</small>
              </div>
              <button onClick={() => addToCart(item.id)}>Add to cart</button>
            </article>
          ))}
        </section>

        <aside className="cart-panel">
          <h2>Your Cart</h2>
          {cartItems.length === 0 ? <p className="muted">Your cart is empty. Start adding products.</p> : (
            <ul>
              {cartItems.map((item) => (
                <li key={item.id}>
                  <div>
                    <p>{item.name}</p>
                    <small>${item.price} each</small>
                  </div>
                  <div className="qty-controls">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="checkout">
            <p>Total: ${totalPrice.toFixed(2)}</p>
            <button disabled={!cartItems.length}>Checkout</button>
          </div>
        </aside>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
