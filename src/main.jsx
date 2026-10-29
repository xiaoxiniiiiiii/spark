import { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Camera, CreditCard, Mail,
  Menu, Minus, Plus, Search, ShieldCheck, ShoppingBag, Sparkles, Truck, UserRound, X,
} from 'lucide-react'
import './styles.css'

const company = {
  name: 'Henan Songyun Jiangci Culture & Art Co., Ltd.',
  email: 'wholesaleof@outlook.com',
  phone: '16555178417',
  address: 'Room 3112, Building 1, Luoyang Hotel, No. 117 Zhongzhou West Road, Jianxi District, Luoyang, Henan, China',
}

const categories = [
  { id: 'ear', label: 'Earrings & Ear', note: 'Light around the ear', image: 1 },
  { id: 'neck-hand', label: 'Neck, Hand & Rings', note: 'Layered, soft and easy', image: 16 },
  { id: 'hair-accent', label: 'Hair & Accent Pieces', note: 'The final touch, from hair to bag', image: 31 },
]

const productNames = [
  ['Amber Glow Studs', 'Pearl Loop Earrings', 'Silver Line Drops', 'Moonlight Ear Cuffs', 'Fine Cartilage Studs', 'Vintage Enamel Studs', 'Ripple Hoop Earrings', 'Zircon Petal Studs', 'Obsidian Short Drops', 'Double Metal Ear Cuffs', 'Fine Chain Drops', 'Pearl Ear Chain', 'Silver Dot Studs', 'Zircon Teardrop Drops', 'Minimal Arc Hoops'],
  ['Pearl Bead Bracelet', 'Plain Stacking Ring', 'Natural Stone Cord', 'Hammered Silver Bangle', 'Golden Collarbone Chain', 'Round Pendant Necklace', 'Double Layer Necklace', 'Green Chalcedony Bracelet', 'Vintage Wide Band Ring', 'Enamel Flower Brooch', 'Golden Bag Charm', 'Round Waist Chain', 'Natural Stone Pendant', 'Fine Chain Bracelet', 'Pearl Jewelry Set'],
  ['Amber Claw Clip', 'Tortoiseshell Hair Clip', 'Satin Headband', 'Soft Scrunchie', 'Metal Hair Pin', 'Carved Hair Comb', 'Enamel Pin', 'Vintage Brooch', 'Bohemian Bag Charm', 'Round Key Ring', 'Pearl Hair Clip', 'Minimal Black Claw Clip', 'Color Bead Hair Pin', 'Zircon Headband', 'Silver Safety Pin'],
]

const prices = [28, 36, 42, 45, 52, 58, 64, 72, 78, 88, 96, 118, 138, 168, 228]
const products = categories.flatMap((category, categoryIndex) => productNames[categoryIndex].map((name, index) => ({
  id: categoryIndex * 15 + index + 1,
  category: category.id,
  categoryLabel: category.label,
  name,
  price: prices[index],
  image: `/products/product-${categoryIndex * 15 + index + 1}.webp`,
  material: ['925 Silver', 'Natural Stone', 'Zircon', 'Gold-Plated Alloy'][index % 4],
})))

const policyContent = {
  about: ['About Us', 'Spark curates thoughtful, easy-to-style accessories for everyday life. The website is operated by Henan Songyun Jiangci Culture & Art Co., Ltd. All products are unbranded independent selections, and the product visuals are original local assets created for this store.'],
  shipping: ['Shipping Policy', 'Orders are usually prepared within 1–3 business days. International delivery times depend on the carrier and destination customs. Remote areas, holidays and events beyond our control may cause delays; tracking updates are shared by email.'],
  tracking: ['Order Tracking', 'A demo order number is created after checkout. Contact wholesaleof@outlook.com with your order details to ask about delivery status; this demo does not create a real order or send logistics messages.'],
  payment: ['Payment Policy', 'This page presents PayPal, Visa and credit card payment options. The payment action opens a demo confirmation step. A live launch requires a payment provider, merchant verification, fraud controls and refund configuration.'],
  returns: ['Returns & Refunds', 'Unused and undamaged items in original packaging may be returned within 14 days of delivery. Customized, hygiene-sensitive or worn items are not eligible for change-of-mind returns. Refund timing depends on the payment provider.'],
  cancel: ['Cancellation Policy', 'You may contact us to cancel before an order enters fulfillment. For shipped orders, please follow the return policy. Additional shipping caused by an incorrect address is the customer’s responsibility.'],
  privacy: ['Privacy Policy', 'We use contact details only as needed for inquiries, demo orders and after-sales communication, and we do not sell personal information. A live launch should add complete payment, support, analytics and regional compliance disclosures.'],
  dmca: ['DMCA', 'If you believe content on this website infringes your copyright, send a description of the work, proof of rights, the infringing link and your contact details to wholesaleof@outlook.com. We will review the request.'],
}

const terms = [
  'Definitions & Scope', 'Website Services & Accounts', 'Product Information & Images', 'Prices & Currency', 'Order Formation', 'Payment Authorization', 'Shipping & Delivery', 'Returns & Refunds', 'Order Cancellation', 'Intellectual Property', 'User Content', 'Prohibited Conduct', 'Disclaimers', 'Limitation of Liability', 'Privacy & Data', 'Changes to Terms', 'Governing Law & Contact',
]
policyContent.terms = ['Terms of Service', terms.map((item, index) => `${index + 1}. ${item}: This section sets the basic rules for browsing Spark, product purchases, demo payments, delivery, after-sales support, intellectual property, privacy and dispute handling. Specific orders are governed by the information shown at checkout.`).join(' ')]

function App() {
  const [route, setRoute] = useState(() => window.location.hash.replace('#', '') || 'home')
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace('#', '') || 'home')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const go = (next) => { window.location.hash = next }
  const addToCart = (product, direct = false) => {
    setCart((items) => {
      const found = items.find((item) => item.id === product.id)
      return found ? items.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item) : [...items, { ...product, qty: 1 }]
    })
    if (direct) go('checkout')
    else setCartOpen(true)
  }
  const changeQty = (id, amount) => setCart((items) => items.map((item) => item.id === id ? { ...item, qty: Math.max(0, item.qty + amount) } : item).filter((item) => item.qty > 0))
  const filtered = useMemo(() => products.filter((p) => (activeCategory === 'all' || p.category === activeCategory) && p.name.includes(search.trim())), [activeCategory, search])
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  return <div className="app-shell">
    <div className="announcement">Free shipping over $120 · Take $12 off your first order <button onClick={() => go('home')}>Shop now <ArrowRight size={14} /></button></div>
    <header className="site-header">
      <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu"><Menu size={20} /></button>
      <a className="brand" href="#home"><span className="brand-mark"><Sparkles size={17} /></span><span>SPARK</span></a>
      <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
        <button onClick={() => { setActiveCategory('all'); go('home'); setMenuOpen(false) }}>Home</button>
        {categories.map((category) => <button key={category.id} onClick={() => { setActiveCategory(category.id); go('home'); setMenuOpen(false) }}>{category.label}</button>)}
        <button onClick={() => go('about')}>Our Story</button>
      </nav>
      <div className="header-actions">
        <label className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jewelry" /></label>
        <button className="icon-button" onClick={() => go('admin')} aria-label="Account"><UserRound size={20} /></button>
        <button className="cart-button" onClick={() => setCartOpen(true)} aria-label="Open cart"><ShoppingBag size={20} /><span>{cart.reduce((sum, item) => sum + item.qty, 0)}</span></button>
      </div>
    </header>

    {route === 'home' && <>
      <main>
        <section className="hero wrap">
          <div className="hero-copy"><p className="eyebrow">EVERYDAY OBJECTS, SMALL JOYS</p><h1>A little shine, <em>just right.</em></h1><p className="hero-sub">Lightweight pieces for your ears, neck, hands and hair, designed in calm colors and simple shapes for every day.</p><button className="button dark" onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}>Explore the edit <ArrowRight size={16} /></button></div>
          <div className="hero-art"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><img src="/products/product-6.webp" alt="Gold earrings" /><div className="hero-note">NEW<br /><strong>Small, luminous</strong></div></div>
        </section>
        <section className="service-strip wrap"><div><ShieldCheck size={19} /><span><b>Thoughtful materials</b><small>Clear details · easy to wear</small></span></div><div><Truck size={19} /><span><b>Flexible delivery</b><small>Free over $120 · trackable orders</small></span></div><div><CreditCard size={19} /><span><b>Flexible payment</b><small>PayPal / Visa / credit card</small></span></div></section>
        <section className="category-section wrap"><div className="section-heading"><div><p className="eyebrow">SHOP BY MOOD</p><h2>What are you wearing today?</h2></div><button className="text-button" onClick={() => { setActiveCategory('all'); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }) }}>View all <ArrowRight size={15} /></button></div><div className="category-grid">{categories.map((category) => <button className="category-card" key={category.id} onClick={() => { setActiveCategory(category.id); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }) }}><img src={`/products/product-${category.image}.webp`} alt={category.label} /><div><span>{category.note}</span><h3>{category.label}</h3><ChevronRight size={18} /></div></button>)}</div></section>
        <section className="collection wrap" id="collection"><div className="collection-top"><div><p className="eyebrow">THE COLLECTION</p><h2>{activeCategory === 'all' ? 'The seasonal edit' : categories.find((c) => c.id === activeCategory)?.label}</h2></div><div className="filter-row"><button className={activeCategory === 'all' ? 'active' : ''} onClick={() => setActiveCategory('all')}>All</button>{categories.map((category) => <button key={category.id} className={activeCategory === category.id ? 'active' : ''} onClick={() => setActiveCategory(category.id)}>{category.label}</button>)}</div></div><div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}</div></section>
        <section className="story-band wrap"><div><p className="eyebrow">A LITTLE STORY</p><h2>Jewelry does not need to shout,<br />it only needs to feel like you.</h2><p>We believe good accessories should slip naturally into life: easy for any occasion, effortless to wear, and ready for the person you want to be today.</p><button className="text-button" onClick={() => go('about')}>Meet Spark <ArrowRight size={15} /></button></div><div className="story-stat"><strong>45</strong><span>independent pieces<br />local WebP assets</span></div></section>
      </main>
      <Footer go={go} />
    </>}
    {route === 'checkout' && <Checkout cart={cart} total={total} changeQty={changeQty} go={go} />}
    {route === 'admin' && <Admin go={go} />}
    {policyContent[route] && <PolicyPage type={route} go={go} />}
    <CartDrawer open={cartOpen} cart={cart} total={total} onClose={() => setCartOpen(false)} changeQty={changeQty} go={go} />
  </div>
}

function ProductCard({ product, onAdd }) { return <article className="product-card"><button className="product-image" onClick={() => onAdd(product, true)}><img src={product.image} alt={product.name} /><span className="quick-add">Buy Now <ArrowRight size={14} /></span></button><div className="product-info"><p>{product.material} · {product.categoryLabel}</p><h3>{product.name}</h3><div className="product-bottom"><strong>${product.price}</strong><button className="mini-add" onClick={() => onAdd(product)}>Add to Cart</button></div></div></article> }

function CartDrawer({ open, cart, total, onClose, changeQty, go }) { return <><div className={`drawer-overlay ${open ? 'show' : ''}`} onClick={onClose} /><aside className={`cart-drawer ${open ? 'show' : ''}`}><div className="drawer-head"><div><p className="eyebrow">YOUR EDIT</p><h2>Your bag <span>{cart.reduce((sum, item) => sum + item.qty, 0)}</span></h2></div><button className="icon-button" onClick={onClose}><X size={20} /></button></div>{cart.length === 0 ? <div className="empty-cart"><ShoppingBag size={34} /><p>Your bag is empty</p><button className="button dark" onClick={onClose}>Keep browsing</button></div> : <><div className="drawer-items">{cart.map((item) => <div className="drawer-item" key={item.id}><img src={item.image} alt={item.name} /><div><h3>{item.name}</h3><p>${item.price}</p><div className="qty"><button onClick={() => changeQty(item.id, -1)}><Minus size={13} /></button><span>{item.qty}</span><button onClick={() => changeQty(item.id, 1)}><Plus size={13} /></button></div></div></div>)}</div><div className="drawer-foot"><div><span>Subtotal</span><strong>${total}</strong></div><p>Tax and shipping are calculated at checkout</p><button className="button dark full" onClick={() => { onClose(); go('checkout') }}>Checkout <ArrowRight size={16} /></button></div></>}</aside></> }

function Checkout({ cart, total, changeQty, go }) { const [paid, setPaid] = useState(false); return <><header className="simple-header"><a className="brand" href="#home"><span className="brand-mark"><Sparkles size={17} /></span><span>SPARK</span></a><button className="text-button" onClick={() => go('home')}><ChevronLeft size={16} /> Back to shopping</button></header><main className="checkout wrap">{paid ? <div className="success-card"><div className="success-icon"><ShieldCheck size={30} /></div><p className="eyebrow">DEMO PAYMENT COMPLETE</p><h1>Thank you for your order.</h1><p>This is a frontend demo and no real charge was made. A live integration would show your confirmation number and delivery details here.</p><button className="button dark" onClick={() => go('home')}>Back home <ArrowRight size={16} /></button></div> : <div className="checkout-layout"><section><p className="eyebrow">SECURE CHECKOUT</p><h1>Checkout</h1><div className="checkout-block"><div className="block-title"><h2>Contact details</h2><span>Demo form</span></div><div className="field-grid"><input placeholder="Email address" /><input placeholder="Phone number" /></div></div><div className="checkout-block"><div className="block-title"><h2>Shipping address</h2><span>Required</span></div><div className="field-grid"><input placeholder="Full name" /><input placeholder="Country / region" /><input className="wide" placeholder="Street address" /><input placeholder="City" /><input placeholder="Postal code" /></div></div><div className="checkout-block"><div className="block-title"><h2>Payment method</h2><span>Secure demo</span></div><div className="payment-options"><button className="payment-option selected"><b>PayPal</b><small>Pay with your PayPal account</small></button><button className="payment-option"><b><span className="visa">VISA</span> Visa</b><small>Debit or credit card</small></button><button className="payment-option"><b><CreditCard size={18} /> Credit card</b><small>Visa / Mastercard / American Express</small></button></div></div></section><aside className="order-summary"><p className="eyebrow">ORDER SUMMARY</p><h2>Your order</h2>{cart.length ? cart.map((item) => <div className="summary-item" key={item.id}><img src={item.image} alt={item.name} /><div><b>{item.name}</b><span>${item.price} × {item.qty}</span><div className="qty"><button onClick={() => changeQty(item.id, -1)}><Minus size={13} /></button><span>{item.qty}</span><button onClick={() => changeQty(item.id, 1)}><Plus size={13} /></button></div></div></div>) : <p className="muted">Return home to choose a product.</p>}<div className="summary-lines"><div><span>Subtotal</span><b>${total}</b></div><div><span>Shipping</span><b>{total >= 120 ? 'Free' : '$12'}</b></div><div className="sum-total"><span>Total</span><strong>${total + (total >= 120 || total === 0 ? 0 : 12)}</strong></div></div><button className="button terracotta full" disabled={!cart.length} onClick={() => setPaid(true)}>Confirm & pay <ArrowRight size={16} /></button><p className="demo-note">This payment button is a frontend demo. No real charge will be made.</p></aside></div>}</main><Footer go={go} minimal /></> }

function PolicyPage({ type, go }) { const [title, body] = policyContent[type]; return <><SimplePageHeader go={go} /><main className="policy-page wrap"><p className="eyebrow">SPARK / POLICY</p><h1>{title}</h1><p className="policy-lede">Clear information for a more thoughtful shopping experience.</p><div className="policy-content"><p>{body}</p>{type === 'terms' ? null : <div className="policy-meta"><span>Operated by</span><strong>{company.name}</strong><span>Email</span><strong>{company.email}</strong></div>}</div>{type === 'about' && <div className="policy-links"><h2>All policies</h2>{Object.entries(policyContent).filter(([key]) => key !== 'about').map(([key, [label]]) => <button key={key} onClick={() => go(key)}>{label}<ArrowRight size={15} /></button>)}<button onClick={() => go('terms')}>Terms of Service (17 sections)<ArrowRight size={15} /></button></div>}</main><Footer go={go} /></> }

function SimplePageHeader({ go }) { return <header className="simple-header"><a className="brand" href="#home"><span className="brand-mark"><Sparkles size={17} /></span><span>SPARK</span></a><button className="text-button" onClick={() => go('home')}><ChevronLeft size={16} /> Back home</button></header> }
function Admin({ go }) { const [login, setLogin] = useState(false); return <><SimplePageHeader go={go} /><main className="admin-page wrap">{!login ? <div className="admin-login"><span className="admin-symbol"><Sparkles /></span><p className="eyebrow">SPARK ADMIN DEMO</p><h1>Admin portal</h1><p>View product, order and site summaries. This is a frontend demo.</p><input placeholder="Email" defaultValue="admin@spark-jewelry.demo" /><input placeholder="Password" type="password" defaultValue="Spark@2026demo" /><button className="button dark full" onClick={() => setLogin(true)}>Sign in <ArrowRight size={16} /></button><small>Demo login: admin@spark-jewelry.demo / Spark@2026demo</small></div> : <div className="admin-dashboard"><div className="admin-top"><div><p className="eyebrow">OVERVIEW</p><h1>Welcome back, admin</h1></div><button className="button outline" onClick={() => setLogin(false)}>Sign out</button></div><div className="admin-cards"><div><span>Total products</span><strong>45</strong><small>3 categories</small></div><div><span>Demo orders</span><strong>12</strong><small>4 pending</small></div><div><span>Monthly sales</span><strong>$4,820</strong><small>+18.6%</small></div></div><div className="admin-table"><div><b>Recent orders</b><span>Frontend demo only</span></div>{['SPK-20261028-001', 'SPK-20261027-008', 'SPK-20261025-014'].map((order, i) => <div className="admin-row" key={order}><span>{order}</span><span>{['Pending', 'Shipped', 'Completed'][i]}</span><strong>${[168, 92, 228][i]}</strong></div>)}</div></div>}</main></> }

function Footer({ go, minimal = false }) { return <footer className={`site-footer ${minimal ? 'minimal' : ''}`}><div className="footer-main wrap"><div className="footer-brand"><a className="brand" href="#home"><span className="brand-mark"><Sparkles size={17} /></span><span>SPARK</span></a><p>Small, luminous accessories,<br />for every version of you.</p><div className="socials"><button><Camera size={17} /></button><button><Mail size={17} /></button></div></div><div className="footer-col"><h3>Explore</h3><button onClick={() => go('home')}>All products</button>{categories.map((category) => <button key={category.id} onClick={() => go('home')}>{category.label}</button>)}</div><div className="footer-col"><h3>Help</h3>{[['payment', 'Payment policy'], ['returns', 'Returns & refunds'], ['cancel', 'Cancellation policy'], ['shipping', 'Shipping policy'], ['tracking', 'Order tracking']].map(([key, label]) => <button key={key} onClick={() => go(key)}>{label}</button>)}</div><div className="footer-col"><h3>About</h3>{[['about', 'About us'], ['terms', 'Terms of Service'], ['privacy', 'Privacy policy'], ['dmca', 'DMCA'], ['admin', 'Admin portal']].map(([key, label]) => <button key={key} onClick={() => go(key)}>{label}</button>)}</div><div className="footer-contact"><h3>Contact</h3><p>{company.email}</p><p>{company.phone}</p><p>{company.address}</p></div></div><div className="footer-bottom wrap"><span>© 2026 {company.name}</span><span>Unbranded jewelry · Frontend demo</span></div></footer> }

export default App

createRoot(document.getElementById('root')).render(<App />)
