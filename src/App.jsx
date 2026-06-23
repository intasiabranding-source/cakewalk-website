import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShoppingCart, 
  Menu as MenuIcon, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  Sparkles, 
  Check, 
  Phone, 
  Mail, 
  Calendar, 
  User, 
  Clock, 
  Heart, 
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Lock,
  Edit,
  PlusCircle,
  Settings,
  FileText,
  Upload,
  RefreshCw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Star
} from 'lucide-react';

// Swiper & Framer Motion Integration
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Pagination, Navigation } from 'swiper/modules';
import { motion, useMotionValue, useTransform } from 'framer-motion';

// Swiper CSS styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-cards';

// Import default images
import defaultHeroCakeImg from './assets/hero_cake.png';
import defaultFounderPortraitImg from './assets/founder_portrait.png';

// Review component
import { StaggerTestimonials } from './components/ui/stagger-testimonials';

// Custom Instagram SVG Icon Component
const Instagram = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// Framer Motion Animation Variants for Premium Look
const fadeInUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

const fadeInScaleVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Initial Default Content Database (CMS baseline)
const DEFAULT_CONTENT = {
  hero: {
    tagline: "✨ TURNING SWEET MOMENTS INTO BEAUTIFUL MEMORIES",
    heading: "Freshly Baked Cakes, Brownies & Custom Creations",
    subtext: "Crafted with premium organic ingredients, deep love, and obsessive attention to detail. Perfect designs to elevate your luxury celebrations.",
    image: "" // Empty means fallback to defaultHeroCakeImg
  },
  story: {
    heading: "The Story Behind Cake Walk",
    paragraph1: "Cake Walk started from a deep, heartfelt passion for baking and creating pure happiness through handcrafted desserts. What began as baking homemade treats for family and close friends gradually bloomed into a luxury home bakery business.",
    paragraph2: "Today, we are dedicated to delivering beautiful, custom-designed, and remarkably delicious cakes that act as the centerpiece for your most special life celebrations. Every batter is whisked by hand, every layer is assembled with care, and only premium ingredients find their way into our ovens.",
    bioQuote: "Focused on making fresh, high-quality cakes and desserts that bring genuine joy to our customers and make their celebrations truly unforgettable.",
    image: "" // Empty means fallback to defaultFounderPortraitImg
  },
  menuItems: [
    // Fresh Cream Cakes
    { id: 'fc-1', name: 'Vanilla Cake', price: 650, category: 'Fresh Cream Cakes', tag: 'Classic', desc: 'Fluffy vanilla sponge layered with rich white cream and Madagascar vanilla bean.', image: '' },
    { id: 'fc-2', name: 'Chocolate Cake', price: 900, category: 'Fresh Cream Cakes', tag: 'Chocolate', desc: 'Decadent chocolate sponge smothered in velvety milk chocolate ganache.', image: '' },
    { id: 'fc-3', name: 'Butterscotch Cake', price: 1100, category: 'Fresh Cream Cakes', tag: 'Classic', desc: 'Rich cake with crunchy caramelized butterscotch pieces and soft cream.', image: '' },
    { id: 'fc-4', name: 'Coffee Mocha Cake', price: 1250, category: 'Fresh Cream Cakes', tag: 'Premium', desc: 'Fresh espresso-infused sponge with silky chocolate cream layers.', image: '' },
    { id: 'fc-5', name: 'Double Chocolate Cake', price: 1200, category: 'Fresh Cream Cakes', tag: 'Chocolate', desc: 'Triple layer indulgence for true chocolate purists.', image: '' },
    { id: 'fc-6', name: 'Pistachio Cake', price: 1250, category: 'Fresh Cream Cakes', tag: 'Premium', desc: 'Exquisite pistachio flour sponge with real toasted pistachio buttercream.', image: '' },
    { id: 'fc-7', name: 'Rasmalai Cake', price: 1250, category: 'Fresh Cream Cakes', tag: 'Premium', desc: 'A royal fusion cake soaked in cardamom saffron milk and topped with fresh rasmalai.', image: '' },
    { id: 'fc-8', name: 'Gulab Jamun Cake', price: 1100, category: 'Fresh Cream Cakes', tag: 'Classic', desc: 'Rich cardamom sponge layered with sweet gulab jamun pieces and rose cream.', image: '' },
    // Dream Cakes
    { id: 'dc-1', name: 'Double Chocolate Dream Cake', price: 850, category: 'Dream Cakes', tag: 'Chocolate', desc: 'Indulgent 5-layer tin cake with chocolate ganache, mousse, and a crispy crack top.', image: '' },
    { id: 'dc-2', name: 'Pistachio Dream Cake', price: 990, category: 'Dream Cakes', tag: 'Premium', desc: 'Layers of premium pistachio paste, soft cream, chocolate shell, and toasted pistachios.', image: '' },
    { id: 'dc-3', name: 'Rasmalai Dream Cake', price: 950, category: 'Dream Cakes', tag: 'Premium', desc: 'Royal fusion with saffron cream, soaked cardamom sponge, and velvety white chocolate.', image: '' },
    { id: 'dc-4', name: 'Gulab Jamun Dream Cake', price: 890, category: 'Dream Cakes', tag: 'Classic', desc: 'Indulgence in a tin with Gulab Jamun layers, rose ganache, and cardamom crumble.', image: '' },
    { id: 'dc-5', name: 'Rose Milk Dream Cake', price: 850, category: 'Dream Cakes', tag: 'Premium', desc: 'Soft pink sponge soaked in sweet rose milk with a crisp white chocolate shell.', image: '' },
    { id: 'dc-6', name: 'Coffee Mocha Dream Cake', price: 890, category: 'Dream Cakes', tag: 'Chocolate', desc: 'Silky espresso cream, chocolate fudge, and dusting of high-quality cocoa powder.', image: '' },
    { id: 'dc-7', name: 'Ferrero Rocher Dream Cake', price: 1050, category: 'Dream Cakes', tag: 'Chocolate', desc: 'Crunchy hazelnut praline, milk chocolate glaze, and toasted caramelized nuts.', image: '' },
    // Dessert Cups
    { id: 'dp-1', name: 'Chocolate Mousse Cup', price: 150, category: 'Dessert Cups', tag: 'Chocolate', desc: 'Silky dark chocolate mousse topped with fine cocoa nibs.', image: '' },
    { id: 'dp-2', name: 'Oreo Dessert Cup', price: 150, category: 'Dessert Cups', tag: 'Chocolate', desc: 'Creamy vanilla mousse layered with crushed Oreo cookies.', image: '' },
    { id: 'dp-3', name: 'Lotus Biscoff Dessert Cup', price: 180, category: 'Dessert Cups', tag: 'Premium', desc: 'Decadent Biscoff spread and whipped cream with crunchy cookie crumbs.', image: '' },
    { id: 'dp-4', name: 'Red Velvet Dessert Cup', price: 180, category: 'Dessert Cups', tag: 'Premium', desc: 'Vibrant red velvet cake crumbs layered with sweet cream cheese frosting.', image: '' },
    // Tres Leches
    { id: 'tl-1', name: 'Rose Milk Tres Leches', price: 90, category: 'Tres Leches', tag: 'Premium', desc: 'Sponge cake soaked in sweet rose-infused milk and topped with fresh cream.', image: '' },
    { id: 'tl-2', name: 'Milk Tres Leches', price: 90, category: 'Tres Leches', tag: 'Classic', desc: 'Classic three-milk cake with light vanilla whipping and berries.', image: '' },
    { id: 'tl-3', name: 'Coffee Tres Leches', price: 110, category: 'Tres Leches', tag: 'Classic', desc: 'Espresso three-milk soak topped with a delicate dusting of premium cocoa.', image: '' },
    { id: 'tl-4', name: 'Lotus Biscoff Tres Leches', price: 110, category: 'Tres Leches', tag: 'Premium', desc: 'Rich biscoff-flavored milk soak topped with a biscoff spread swirl.', image: '' },
    { id: 'tl-5', name: 'Pistachio Tres Leches', price: 110, category: 'Tres Leches', tag: 'Premium', desc: 'Real pistachio nut milk soak decorated with crushed toasted pistachios.', image: '' },
    // Brownies
    { id: 'br-1', name: 'Brownie Bites', price: 200, category: 'Brownies', tag: 'Classic', desc: 'Fudgy bite-sized chocolate brownie chunks perfect for snacking.', image: '' },
    { id: 'br-2', name: 'Brownie Balls', price: 99, category: 'Brownies', tag: 'Classic', desc: 'Coated chocolate brownie truffles rolled in sprinkles and hazelnuts.', image: '' },
    { id: 'br-3', name: 'Chocolate Ganache Brownies', price: 250, category: 'Brownies', tag: 'Chocolate', desc: 'Signature rich, fudgy brownie slab topped with thick dark ganache.', image: '' },
    { id: 'br-4', name: 'Assorted Brownies Box', price: 450, category: 'Brownies', tag: 'Premium', desc: 'A sampler box of chocolate chip, walnut, and biscoff brownies.', image: '' },
    { id: 'br-5', name: 'Brownie Tower', price: 1200, category: 'Brownies', tag: 'Premium', desc: 'A showstopping stack of 12 fudgy brownies decorated with chocolate drizzle.', image: '' }
  ],
  specials: [
    { id: 'sp-1', name: 'Cookie Pie', price: 350, category: 'Special Desserts', tag: 'Popular', desc: 'Deep-dish cookie loaded with Belgian chocolate chips and a gooey chocolate fudge core.', image: '' },
    { id: 'sp-2', name: 'Brookies (Brownie + Cookie)', price: 280, category: 'Special Desserts', tag: 'Best Seller', desc: 'The ultimate hybrid—half rich chocolate fudge brownie, half chewy chocolate chip cookie.', image: '' },
    { id: 'sp-3', name: 'Mini Dessert Box', price: 550, category: 'Special Desserts', tag: 'Gifting Special', desc: 'A curated selection of dessert cups, brownie bites, and premium macarons.', image: '' }
  ],
  marquee: [
    "✨ CUSTOM DESIGNS AVAILABLE",
    "FRESHLY BAKED TO ORDER",
    "PREMIUM INGREDIENTS ONLY",
    "MADE WITH LOVE",
    "PACKED WITH FLAVOR"
  ],
  adminPassword: "cakewalkbyIndhu@1",
  orders: [],
  stories: [
    {
      id: 'st-1',
      title: 'Handcrafted Chocolate Cake',
      desc: 'Watch our signature rich chocolate sponge smothered in velvety milk chocolate ganache.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-chocolate-glaze-on-a-cake-41552-large.mp4'
    },
    {
      id: 'st-2',
      title: 'Cake Piping Artistry',
      desc: 'Watch the beautiful creation of multi-tiered custom rose piping in slow motion.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-decorating-a-cake-with-cream-41551-large.mp4'
    },
    {
      id: 'st-3',
      title: 'Fluffy Powdered Sugar Decorating',
      desc: 'A gorgeous slow-motion sprinkle of powdered sugar on our fresh premium desserts.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-sprinkling-powdered-sugar-on-a-dessert-41554-large.mp4'
    },
    {
      id: 'st-4',
      title: 'Finishing Touches',
      desc: 'Placing the final fresh cherry on top of our signature red velvet cupcakes.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-putting-cherry-on-top-of-a-cupcake-41553-large.mp4'
    }
  ],
  reviews: []
};

// StoryCard component with playback & mute overlays
const StoryCard = ({ story, isPlaying, onTogglePlay }) => {
  const videoRef = React.useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  React.useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(err => console.log("Autoplay blocked", err));
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  const handleVideoClick = () => {
    onTogglePlay(story.id);
  };

  const handleMuteClick = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <div 
      onClick={handleVideoClick}
      className="relative w-[280px] sm:w-[300px] h-[480px] rounded-[28px] overflow-hidden border border-forestGreen/20 shadow-luxury hover:shadow-luxury-hover transition-luxury group cursor-pointer bg-black select-none shrink-0"
    >
      <video
        ref={videoRef}
        src={story.videoUrl}
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500"
      />
      
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/35 pointer-events-none" />

      {/* Floating Mute Button */}
      <button
        type="button"
        onClick={handleMuteClick}
        className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/45 hover:bg-black/60 hover:scale-105 active:scale-95 transition-all text-warmCream border border-warmCream/10 shadow-sm animate-fadeIn"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      {/* Center play icon that displays when paused or briefly on hover */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`p-4 rounded-full bg-black/55 text-warmCream border border-warmCream/10 backdrop-blur-sm transition-all duration-300 ${isPlaying ? 'opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100' : 'opacity-100 scale-100'}`}>
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </div>
      </div>

      {/* Text Details overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-left pointer-events-none">
        <h4 className="font-serif text-lg font-bold text-warmCream mb-1">
          {story.title}
        </h4>
        <p className="font-sans text-xs text-warmCream/80 leading-relaxed line-clamp-2">
          {story.desc}
        </p>
      </div>
    </div>
  );
};

// Helper to perform multipart file uploads to Express Backend
const uploadFileToServer = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    throw new Error('Upload to backend failed');
  }
  
  const data = await response.json();
  return data.url;
};

// Helper for local video file uploads sending directly to backend
const handleVideoUpload = async (e, callback, showToast) => {
  const file = e.target.files?.[0];
  if (file) {
    if (file.size > 50 * 1024 * 1024) {
      showToast("Video file must be under 50MB!");
      return;
    }
    try {
      showToast("Uploading video to server...");
      const url = await uploadFileToServer(file);
      callback(url);
      showToast("Video uploaded successfully!");
    } catch (err) {
      console.error(err);
      showToast("Video upload failed.");
    }
  }
};

function App() {
  // Centralized site state (CMS backed by Express Backend + default fallback)
  const [siteData, setSiteData] = useState(DEFAULT_CONTENT);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load from Express Backend on mount
  useEffect(() => {
    const loadFromServer = async () => {
      try {
        const response = await fetch('/api/content');
        if (response.ok) {
          const data = await response.json();
          // Merge with defaults to prevent broken states
          const merged = { ...DEFAULT_CONTENT, ...data };
          if (merged.adminPassword === 'cakewalk2026') {
            merged.adminPassword = 'cakewalkbyIndhu@1';
          }
          setSiteData(merged);
        }
      } catch (e) {
        console.error("Error loading data from Express Backend:", e);
      } finally {
        setIsDataLoaded(true);
      }
    };
    loadFromServer();
  }, []);

  // Sync to Express Backend database
  useEffect(() => {
    if (!isDataLoaded) return;

    const syncData = async () => {
      try {
        await fetch('/api/content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(siteData)
        });
      } catch (e) {
        console.error("Failed to sync to backend database:", e);
      }
    };

    syncData();
  }, [siteData, isDataLoaded]);

  // Client States
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [playingStoryId, setPlayingStoryId] = useState(null);
  const [hoveredNav, setHoveredNav] = useState(null);

  const navLinks = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'story', label: 'Our Story', href: '#story' },
    { id: 'menu', label: 'Menu', href: '#menu' },
    { id: 'specials', label: 'Reviews', href: '#reviews' }
  ];

  // Theme Toggle Hook (Real-time working)
  
  
  // Admin & Portal States
  const [loginOpen, setLoginOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState('pages');

  // Checkout Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    notes: ''
  });

  // CMS Edit States
  const [editItem, setEditItem] = useState(null); // Menu item currently being edited
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Fresh Cream Cakes', tag: 'Classic', desc: '', image: '' });
  const [editSpecial, setEditSpecial] = useState(null); // Special item being edited
  const [newPassword, setNewPassword] = useState('');
  const [activeEditModalItem, setActiveEditModalItem] = useState(null);

  // Handle Toast notification
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Add Item to Cart
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        showToast(`Updated quantity of ${item.name} in cart!`);
        return prevCart.map((cartItem) => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      showToast(`${item.name} added to cart!`);
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  // Update Cart Quantity
  const updateQuantity = (itemId, amount) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === itemId) {
          const newQty = item.quantity + amount;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      });
    });
  };

  // Remove Item from Cart
  const removeFromCart = (itemId, itemName) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    showToast(`${itemName} removed from cart.`);
  };

  // Calculate Subtotal
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Form Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Log Order in Express database
  const logOrderLocally = async () => {
    const orderRecord = {
      id: `ord-${Date.now()}`,
      customerName: formData.name,
      phone: formData.phone,
      deliveryDate: formData.date,
      notes: formData.notes || 'None',
      items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
      total: cartSubtotal,
      timestamp: new Date().toLocaleString(),
      status: 'Pending'
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderRecord)
      });
      if (response.ok) {
        const data = await response.json();
        setSiteData(prev => ({
          ...prev,
          orders: [data.order, ...(prev.orders || [])]
        }));
      }
    } catch (err) {
      console.error("Failed to log order on backend database:", err);
    }
  };

  // Compile Order and Redirect to WhatsApp
  const handleWhatsAppCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty! Add some delicious treats first.');
      return;
    }
    if (!formData.name || !formData.phone || !formData.date) {
      alert('Please fill in your Name, Phone Number, and Delivery Date.');
      return;
    }

    logOrderLocally();

    const itemsText = cart
      .map(item => `• ${item.quantity}x ${item.name}`)
      .join('\n');

    const message = `🎂 NEW CAKE WALK ORDER REQUEST 🎂
----------------------------------
👤 Customer Details:
• Name: ${formData.name}
• Phone: ${formData.phone}
• Delivery Date: ${formData.date}
${formData.notes ? `• Design Notes: ${formData.notes}` : ''}

🛒 Selected Items:
${itemsText}

----------------------------------
Thank you for ordering with Cake Walk! 🌸
(Order request sent from cakewalk.com)`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/917358944114?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setCart([]);
    showToast("Order logged and sent to WhatsApp!");
  };

  // Compile Order and Redirect to Email
  const handleEmailCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty! Add some delicious treats first.');
      return;
    }
    if (!formData.name || !formData.phone || !formData.date) {
      alert('Please fill in your Name, Phone Number, and Delivery Date.');
      return;
    }

    logOrderLocally();

    const itemsText = cart
      .map(item => `• ${item.quantity}x ${item.name}`)
      .join('%0D%0A');

    const bodyText = `New Cake Walk Order Request%0D%0A%0D%0AName: ${formData.name}%0D%0APhone: ${formData.phone}%0D%0ADelivery Date: ${formData.date}%0D%0ANotes: ${formData.notes || 'None'}%0D%0A%0D%0AItems:%0D%0A${itemsText}%0D%0A%0D%0ASent from Cake Walk Website.`;

    const mailtoUrl = `mailto:Cakewalk10@gmail.com?subject=Cake Walk Order Request - ${formData.name}&body=${bodyText}`;
    window.location.href = mailtoUrl;
    setCart([]);
    showToast("Order logged and drafted in email client!");
  };

  // Menu Categories Filter
  const categories = ['All', 'Fresh Cream Cakes', 'Dream Cakes', 'Dessert Cups', 'Tres Leches', 'Brownies'];
  const filteredItems = activeCategory === 'All' 
    ? siteData.menuItems 
    : siteData.menuItems.filter(item => item.category === activeCategory);

  // Tag helper to style tags elegantly
  const getTagColorClass = (tag) => {
    switch (tag) {
      case 'Classic':
        return 'bg-forestGreen/10 text-forestGreen';
      case 'Chocolate':
        return 'bg-forestGreen/15 text-forestGreen';
      case 'Premium':
        return 'bg-forestGreen/25 text-forestGreen';
      default:
        return 'bg-forestGreen/10 text-forestGreen';
    }
  };

  // Admin Security Handlers
  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    if (enteredPassword === siteData.adminPassword) {
      setLoginError('');
      setLoginOpen(false);
      setAdminOpen(true);
      setEnteredPassword('');
    } else {
      setLoginError('Invalid password. Please try again.');
    }
  };

  // Local Photo Upload Helper sending to backend
  const handleImageUpload = async (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert("Image is too large! Please upload files under 20MB.");
      return;
    }

    try {
      showToast("Uploading image...");
      const url = await uploadFileToServer(file);
      callback(url);
      showToast("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      showToast("Image upload failed.");
    }
  };

  // Reset to default
  const handleFactoryReset = () => {
    if (window.confirm("Are you sure you want to revert all changes, delete local orders, and load factory defaults?")) {
      setSiteData(DEFAULT_CONTENT);
      showToast("Site settings restored to defaults!");
      setAdminOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-warmCream relative select-none overflow-x-hidden text-forestGreen transition-colors duration-500">


      {/* Floating Micro Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-forestGreen text-warmCream px-6 py-4 rounded-2xl shadow-luxury flex items-center gap-3 border border-forestGreen/20 animate-bounce">
          <div className="w-5 h-5 rounded-full bg-warmCream flex items-center justify-center text-forestGreen">
            <Check size={12} className="stroke-[3]" />
          </div>
          <span className="font-sans text-sm font-semibold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* STICKY GLASSMORPHIC HEADER */}
      <header className="sticky top-0 z-40 bg-warmCream border-b border-forestGreen/25 transition-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 group">
            <span className="font-serif text-3xl font-bold tracking-tight text-forestGreen relative">
              Cake Walk
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-crispCarrot transition-all duration-300 group-hover:w-full"></span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav 
            onMouseLeave={() => setHoveredNav(null)}
            className="hidden md:flex items-center gap-1.5 lg:gap-2.5 bg-forestGreen/5 px-4 py-1.5 rounded-full border border-forestGreen/10 relative"
          >
            {navLinks.map((link) => (
              <a 
                key={link.id}
                href={link.href}
                onMouseEnter={() => setHoveredNav(link.id)}
                className="relative px-4 py-2 rounded-full font-sans text-sm font-bold text-forestGreen/80 hover:text-forestGreen transition-colors duration-300 select-none group"
              >
                <span className="relative z-10">{link.label}</span>
                {/* sliding indicator pill background */}
                {hoveredNav === link.id && (
                  <motion.span
                    layoutId="navHoverBg"
                    className="absolute inset-0 bg-[#9A0002]/10 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {/* centered expanding underline */}
                <span className="absolute bottom-1.5 left-4 right-4 h-[2px] bg-crispCarrot origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-20"></span>
              </a>
            ))}
            <a 
              href="#order" 
              className="px-5 py-2 rounded-full bg-crispCarrot hover:bg-[#6B0001] text-warmCream font-sans text-xs sm:text-sm font-bold tracking-wider transition-all duration-300 flex items-center gap-1.5 shadow-sm hover:shadow-luxury hover:-translate-y-0.5 select-none ml-2"
            >
              Order Now <Sparkles size={13} className="animate-pulse text-warmCream" />
            </a>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Instagram link */}
            <a 
              href="https://instagram.com/Cakewalkbyindhu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-warmCream/80 border border-forestGreen/25 text-forestGreen hover:text-crispCarrot hover:bg-warmCream/35 hover:-translate-y-1 transition-all shadow-sm"
              title="Follow @Cakewalkbyindhu on Instagram"
            >
              <Instagram size={20} />
            </a>

            

            {/* Shopping Cart Trigger */}
            <button 
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-full bg-warmCream/85 border border-forestGreen/25 text-forestGreen hover:bg-warmCream hover:-translate-y-1 transition-all shadow-md group"
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-crispCarrot text-warmCream font-sans text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-warmCream animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-forestGreen hover:bg-forestGreen/10"
            >
              {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-warmCream border-b border-forestGreen/25 transition-all animate-fadeIn">
            <div className="px-6 py-6 flex flex-col gap-5">
              <a 
                href="#home" 
                onClick={() => setMobileMenuOpen(false)}
                className="font-sans text-base font-semibold text-forestGreen hover:text-crispCarrot transition-all"
              >
                Home
              </a>
              <a 
                href="#story" 
                onClick={() => setMobileMenuOpen(false)}
                className="font-sans text-base font-semibold text-forestGreen hover:text-crispCarrot transition-all"
              >
                Our Story
              </a>
              <a 
                href="#menu" 
                onClick={() => setMobileMenuOpen(false)}
                className="font-sans text-base font-semibold text-forestGreen hover:text-crispCarrot transition-all"
              >
                Menu
              </a>
              <a 
                href="#specials" 
                onClick={() => setMobileMenuOpen(false)}
                className="font-sans text-base font-semibold text-forestGreen hover:text-crispCarrot transition-all"
              >
                Special Desserts
              </a>
              <a 
                href="#order" 
                onClick={() => setMobileMenuOpen(false)}
                className="font-sans text-base font-bold text-crispCarrot hover:text-forestGreen transition-all flex items-center gap-2"
              >
                Order Now <Sparkles size={16} className="text-crispCarrot animate-pulse" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative py-20 md:py-28 overflow-hidden z-10 bg-warmCream text-forestGreen transition-colors duration-500">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          
          {/* Hero Left Column */}
          <motion.div 
            variants={staggerContainerVariants}
            className="flex flex-col items-start text-left space-y-6 md:space-y-8"
          >
            <motion.div variants={fadeInUpVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warmCream/60 border border-crispCarrot/20 text-forestGreen shadow-sm">
              <Sparkles size={14} className="text-crispCarrot animate-spin-slow" />
              <span className="font-sans text-[9px] sm:text-xs font-bold tracking-widest uppercase">
                {siteData.hero.tagline}
              </span>
            </motion.div>
            
            <motion.h1 variants={fadeInUpVariants} className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-forestGreen leading-[1.1] tracking-tight">
              {siteData.hero.heading}
            </motion.h1>
            
            <motion.p variants={fadeInUpVariants} className="font-sans text-base sm:text-lg text-forestGreen/80 max-w-xl leading-relaxed">
              {siteData.hero.subtext}
            </motion.p>
            
            <motion.div variants={fadeInUpVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <a 
                href="#menu" 
                className="px-8 py-4 rounded-full bg-crispCarrot hover:bg-[#6B0001] text-warmCream font-sans text-sm font-bold tracking-wider text-center shadow-luxury hover:shadow-luxury-hover hover:-translate-y-1 transition-luxury"
              >
                Explore Menu
              </a>
              <a 
                href="#story" 
                className="px-8 py-4 rounded-full border border-forestGreen/20 hover:border-forestGreen/50 bg-warmCream/40 hover:bg-warmCream/80 text-forestGreen font-sans text-sm font-bold tracking-wider text-center transition-luxury hover:-translate-y-1"
              >
                Our Story
              </a>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div variants={fadeInUpVariants} className="grid grid-cols-3 gap-6 pt-6 border-t border-forestGreen/25 w-full">
              <div>
                <p className="font-serif text-3xl font-bold text-crispCarrot">100%</p>
                <p className="font-sans text-xs font-semibold text-forestGreen/70 mt-1">Freshly Baked</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-crispCarrot">15+</p>
                <p className="font-sans text-xs font-semibold text-forestGreen/70 mt-1">Unique Flavors</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-crispCarrot">5★</p>
                <p className="font-sans text-xs font-semibold text-forestGreen/70 mt-1">Five Star Reviews</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Right Column (Floating Showcase Card) */}
          <motion.div 
            variants={fadeInScaleVariants}
            className="flex items-center justify-center relative mt-6 md:mt-0"
          >
            {/* Soft decorative glow ring */}
            <div className="absolute inset-0 bg-forestGreen/5 rounded-full filter blur-3xl transform scale-75 animate-pulse-slow"></div>

            {/* Core Antigravity Card */}
            <div className="relative w-full max-w-[420px] bg-warmCream rounded-[32px] p-6 sm:p-8 border border-forestGreen/10 shadow-luxury animate-antigravity transition-luxury hover:rotate-2">
              <div className="relative rounded-[24px] overflow-hidden bg-warmCream border border-forestGreen/15 aspect-square flex items-center justify-center">
                <img 
                  src={siteData.hero.image || defaultHeroCakeImg} 
                  alt="Premium Luxury Layered Cake" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-all duration-700" 
                />
                
                {/* Floating badge */}
                <div className="absolute top-4 right-4 bg-warmCream border border-forestGreen/25 py-2 px-4 rounded-full shadow-sm flex items-center gap-1.5 animate-bounce">
                  <Sparkles size={14} className="text-crispCarrot" />
                  <span className="font-sans text-xs font-bold text-forestGreen uppercase tracking-wider">Premium Best</span>
                </div>
              </div>

              {/* Card Meta details */}
              <div className="mt-6 flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-xl font-bold text-forestGreen">Strawberry Fusion</h3>
                  <p className="font-sans text-xs font-semibold text-forestGreen/60 mt-1">Custom orders available</p>
                </div>
                <a 
                  href="#order"
                  className="bg-warmCream hover:bg-warmCream/50 text-forestGreen border border-forestGreen/30/80 p-3 rounded-full shadow-sm hover:scale-110 transition-luxury"
                  title="Customize cake design"
                >
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* BRAND STORY & FOUNDER SECTION */}
      <section id="story" className="py-20 md:py-28 bg-warmCream border-t border-b border-forestGreen/20 relative z-10 transition-colors duration-500 text-forestGreen">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Founder Image Frame (Left Column) */}
            <motion.div 
              variants={fadeInScaleVariants}
              className="col-span-1 md:col-span-5 flex justify-center"
            >
              <div className="relative p-3 bg-warmCream border border-forestGreen/20 rounded-[32px] shadow-luxury hover:-translate-y-2 transition-luxury max-w-[340px] w-full">
                {/* Inner double border */}
                <div className="border border-dashed border-[#C81D1F]/40 rounded-[24px] p-2">
                  <div className="aspect-[4/5] rounded-[18px] overflow-hidden bg-warmCream">
                    <img 
                      src={siteData.story.image || defaultFounderPortraitImg} 
                      alt="Indu Prabakar - Founder of Cake Walk" 
                      className="w-full h-full object-cover filter contrast-[1.02]" 
                    />
                  </div>
                </div>
                
                {/* Float tag */}
                <div className="absolute -bottom-5 -right-3 bg-[#9A0002] text-white px-5 py-3 rounded-2xl shadow-lg border border-[#9A0002]/20 text-center">
                  <p className="font-serif text-sm font-bold tracking-wide">Indu Prabakar</p>
                  <p className="font-sans text-[10px] font-semibold text-white/85 uppercase tracking-widest mt-0.5">Founder & Head Baker</p>
                </div>
              </div>
            </motion.div>

            {/* Story Text Content (Right Column) */}
            <motion.div 
              variants={staggerContainerVariants}
              className="col-span-1 md:col-span-7 flex flex-col space-y-6 text-left"
            >
              <motion.div variants={fadeInUpVariants} className="inline-flex items-center gap-1.5 text-crispCarrot">
                <Heart size={14} className="fill-crispCarrot" />
                <span className="font-sans text-xs font-bold uppercase tracking-widest">Our Heritage</span>
              </motion.div>
              
              <motion.h2 variants={fadeInUpVariants} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forestGreen leading-tight">
                {siteData.story.heading}
              </motion.h2>
              
              <motion.p variants={fadeInUpVariants} className="font-sans text-base text-forestGreen/80 leading-relaxed">
                {siteData.story.paragraph1}
              </motion.p>
              
              <motion.p variants={fadeInUpVariants} className="font-sans text-base text-forestGreen/80 leading-relaxed">
                {siteData.story.paragraph2}
              </motion.p>

              {/* Bio Quote Callout */}
              <motion.div variants={fadeInUpVariants} className="relative p-6 sm:p-8 bg-warmCream border-l-4 border-crispCarrot rounded-r-3xl shadow-sm italic text-forestGreen/95">
                <span className="absolute top-3 left-4 text-6xl font-serif text-crispCarrot/15 pointer-events-none">“</span>
                <p className="font-serif text-base sm:text-lg relative z-10 leading-relaxed">
                  {siteData.story.bioQuote}
                </p>
              </motion.div>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* FILTERABLE MENU CARDS SECTION */}
      <section id="menu" className="py-20 md:py-28 bg-warmCream relative z-10 transition-colors duration-500 text-forestGreen">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 text-center"
        >
          
          <motion.span variants={fadeInUpVariants} className="font-sans text-xs font-bold text-crispCarrot uppercase tracking-widest">Gourmet Selection</motion.span>
          <motion.h2 variants={fadeInUpVariants} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forestGreen mt-2 mb-4">
            Explore Our Sweet Menu
          </motion.h2>
          <motion.p variants={fadeInUpVariants} className="font-sans text-sm sm:text-base text-forestGreen/70 max-w-xl mx-auto mb-10 leading-relaxed">
            From luscious fresh cream designs and indulgent tin dream cakes to decadent tres leches and fudgy brownies, we have something to make every moment sweeter.
          </motion.p>

          {/* Dynamic Filter Tabs */}
          <motion.div variants={fadeInUpVariants} className="flex flex-wrap justify-center items-center gap-2.5 sm:gap-3.5 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-3 rounded-full font-sans text-xs sm:text-sm font-bold tracking-wide transition-luxury ${ activeCategory === category ? 'bg-forestGreen text-warmCream shadow-md ' : 'bg-warmCream/80 hover:bg-warmCream text-forestGreen/80 border border-forestGreen/20 hover:border-forestGreen/30 hover:-translate-y-0.5 ' }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Menu Items Swiper Carousel */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.1,
            }}
            className="relative w-full max-w-5xl px-4 mt-6 mx-auto"
          >
            <style>{`
              .Carousal_003 {
                width: 100%;
                height: 535px;
                padding-bottom: 60px !important;
              }
              
              .Carousal_003 .swiper-slide {
                width: 310px;
                opacity: 0.45;
                transition: opacity 0.4s ease, transform 0.4s ease;
              }

              .Carousal_003 .swiper-slide-active {
                opacity: 1;
              }

              .swiper-pagination-bullet-active {
                background-color: #9A0002 !important;
              }
              
              .swiper-button-next, .swiper-button-prev {
                color: #9A0002 !important;
              }
            `}</style>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Swiper
                key={activeCategory + '-' + JSON.stringify(filteredItems.map(item => ({ id: item.id, name: item.name, desc: item.desc, image: item.image, price: item.price, tag: item.tag })))}
                spaceBetween={20}
                autoplay={false}
                effect="coverflow"
                grabCursor={true}
                slidesPerView="auto"
                centeredSlides={true}
                loop={filteredItems.length > 2}
                coverflowEffect={{
                  rotate: 35,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                }}
                pagination={{
                  clickable: true,
                }}
                navigation={{
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }}
                className="Carousal_003"
                modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
              >
                {filteredItems.map((item) => (
                  <SwiperSlide key={item.id} className="py-2">
                    <div 
                      className="bg-warmCream rounded-3xl border border-forestGreen/20 p-5 shadow-luxury hover:shadow-luxury-hover transition-luxury text-left flex flex-col justify-between h-[455px]"
                    >
                      <div className="flex-grow flex flex-col justify-between h-full">
                        <div>
                          {/* Photo container for customized items */}
                          {item.image ? (
                            <div className="w-full h-36 rounded-2xl overflow-hidden mb-3 border border-forestGreen/15 bg-warmCream">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-full h-36 rounded-2xl mb-3 border border-dashed border-forestGreen/25 bg-warmCream/40 flex flex-col items-center justify-center text-forestGreen/40">
                              <Sparkles size={24} className="mb-1 text-crispCarrot animate-pulse" />
                              <span className="font-sans text-[10px] font-bold uppercase tracking-wider">Cake Walk Fresh</span>
                            </div>
                          )}

                          {/* Card Header (Category & Tag) */}
                          <div className="flex justify-between items-center mb-2.5">
                            <span className="font-sans text-[9px] font-bold text-[#6B0001] uppercase tracking-wider">
                              {item.category}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full font-sans text-[9px] font-bold tracking-wider ${getTagColorClass(item.tag)}`}>
                              {item.tag}
                            </span>
                          </div>

                          {/* Card Title */}
                          <div className="flex justify-between items-start gap-2 mb-1.5">
                            <h3 className="font-serif text-base sm:text-lg font-bold text-forestGreen leading-snug line-clamp-1">
                              {item.name}
                            </h3>
                          </div>

                          {/* Description */}
                          <p className="font-sans text-xs text-forestGreen/70 leading-relaxed line-clamp-3">
                            {item.desc}
                          </p>
                        </div>

                        {/* Add to Cart CTA */}
                        <button 
                          onClick={() => addToCart(item)}
                          className="w-full py-2.5 rounded-2xl bg-warmCream hover:bg-warmCream text-forestGreen border border-forestGreen/30 hover:border-crispCarrot/40 font-sans text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:scale-[1.01] transition-all mt-4"
                        >
                          <Plus size={12} className="stroke-[2.5]" /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
                
                {/* Custom Navigation Buttons */}
                <div className="absolute top-[40%] -left-4 z-20 swiper-button-prev-custom after:hidden bg-warmCream border border-forestGreen/25 w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-105 hover:bg-warmCream/30 cursor-pointer transition-all text-forestGreen">
                  <ChevronLeft size={20} className="stroke-[2.5]" />
                </div>
                <div className="absolute top-[40%] -right-4 z-20 swiper-button-next-custom after:hidden bg-warmCream border border-forestGreen/25 w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-105 hover:bg-warmCream/30 cursor-pointer transition-all text-forestGreen">
                  <ChevronRight size={20} className="stroke-[2.5]" />
                </div>
              </Swiper>
            </motion.div>
          </motion.div>

          {/* End of Menu Banner */}
          <div className="mt-12 bg-warmCream/40 border border-forestGreen/20 rounded-3xl p-6 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-sans text-xs sm:text-sm text-forestGreen/80 font-semibold text-center sm:text-left">
              🌸 Looking for a completely customized theme cake design?
            </p>
            <a 
              href="#order"
              className="px-6 py-3 rounded-full bg-forestGreen hover:bg-[#6B0001] text-warmCream font-sans text-xs font-bold tracking-wider shrink-0 transition-luxury"
            >
              Get Custom Quote
            </a>
          </div>

        </motion.div>
      </section>

      {/* INFINITE BENEFITS MARQUEE */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUpVariants}
        className="bg-warmCream py-6 border-t border-b border-forestGreen/15 overflow-hidden relative z-10 transition-colors duration-500"
      >
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="inline-flex animate-marquee text-forestGreen font-serif text-sm sm:text-base font-bold tracking-widest uppercase items-center gap-12 select-none">
            {siteData.marquee.map((benefit, i) => (
              <React.Fragment key={i}>
                <span>{benefit}</span>
                {i < siteData.marquee.length && <span>✦</span>}
              </React.Fragment>
            ))}
            {/* Duplicate for seamless loop */}
            {siteData.marquee.map((benefit, i) => (
              <React.Fragment key={`dup-${i}`}>
                <span>{benefit}</span>
                {i < siteData.marquee.length && <span>✦</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </motion.section>

      {/* VISUAL STORIES SECTION */}
      <section id="stories" className="py-20 md:py-28 bg-warmCream relative z-10 text-forestGreen">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          
          <motion.div variants={fadeInUpVariants} className="max-w-3xl mx-auto text-center mb-12">
            <span className="font-sans text-[10px] font-bold text-crispCarrot uppercase tracking-widest block mb-2">
              ✦ Behind the Batter ✦
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4">
              Visual Stories
            </h2>
            <p className="font-sans text-sm text-forestGreen/70">
              Take a peek inside our custom baking studio. Tap any video story below to experience the sensory magic of our handcrafted luxury treats.
            </p>
          </motion.div>

          <motion.div variants={fadeInUpVariants} className="relative">
            {/* Custom Navigation */}
            <div className="absolute top-1/2 -left-4 z-20 -translate-y-1/2 swiper-story-prev after:hidden bg-warmCream hover:bg-forestGreen text-forestGreen hover:text-warmCream border border-forestGreen/30 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:-translate-x-0.5 active:scale-95 transition-all">
              <ChevronLeft size={20} />
            </div>
            <div className="absolute top-1/2 -right-4 z-20 -translate-y-1/2 swiper-story-next after:hidden bg-warmCream hover:bg-forestGreen text-forestGreen hover:text-warmCream border border-forestGreen/30 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:translate-x-0.5 active:scale-95 transition-all">
              <ChevronRight size={20} />
            </div>

            <Swiper
              key={JSON.stringify((siteData.stories || []).map(s => ({ id: s.id, title: s.title, desc: s.desc, videoUrl: s.videoUrl })))}
              spaceBetween={24}
              slidesPerView="auto"
              centeredSlides={false}
              grabCursor={true}
              loop={siteData.stories && siteData.stories.length > 2}
              navigation={{
                nextEl: ".swiper-story-next",
                prevEl: ".swiper-story-prev",
              }}
              breakpoints={{
                320: { slidesPerView: "auto", centeredSlides: true },
                640: { slidesPerView: "auto", centeredSlides: false },
                1024: { slidesPerView: 3, centeredSlides: false }
              }}
              className="py-4"
              modules={[Navigation]}
            >
              {siteData.stories && siteData.stories.map((story) => (
                <SwiperSlide key={story.id} className="w-auto py-2">
                  <StoryCard
                    story={story}
                    isPlaying={playingStoryId === story.id}
                    onTogglePlay={(id) => setPlayingStoryId(prev => prev === id ? null : id)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>

        </motion.div>
      </section>

      {/* REVIEWS & CLIENT TESTIMONIALS */}
      <section id="reviews" className="py-20 md:py-28 bg-warmCream relative z-10 transition-colors duration-500 text-forestGreen">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 text-center"
        >
          <motion.span variants={fadeInUpVariants} className="font-sans text-xs font-bold text-crispCarrot uppercase tracking-widest block">What Our Clients Say</motion.span>
          <motion.h2 variants={fadeInUpVariants} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forestGreen mt-2 mb-4">
            Sweet Praises
          </motion.h2>
          <motion.p variants={fadeInUpVariants} className="font-sans text-sm sm:text-base text-forestGreen/70 max-w-xl mx-auto mb-10 leading-relaxed">
            Read the heartwarming reviews from our lovely community celebrating their special moments with Cake Walk.
          </motion.p>

          <motion.div variants={fadeInUpVariants} className="w-full">
            <StaggerTestimonials reviews={siteData.reviews || []} />
          </motion.div>

        </motion.div>
      </section>

      {/* ORDER GENERATOR FORM SECTION */}
      <section id="order" className="py-20 md:py-28 bg-warmCream border-t border-forestGreen/20 relative z-10 transition-colors duration-500 text-forestGreen">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInScaleVariants}
          className="max-w-4xl mx-auto px-4 sm:px-8"
        >
          <div className="bg-warmCream rounded-[36px] border border-forestGreen/15 p-6 sm:p-10 shadow-luxury text-center">
            
            <span className="font-sans text-xs font-bold text-crispCarrot uppercase tracking-widest">Easy Order Request</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forestGreen mt-2 mb-4">
              Place Your Order
            </h2>
            <p className="font-sans text-xs sm:text-sm text-forestGreen/70 max-w-lg mx-auto mb-8 leading-relaxed">
              Add your desired cakes and sweets to the cart, fill out your checkout details below, and submit to send your order directly via WhatsApp or Email!
            </p>

            {/* Cart Preview Inside Order Box */}
            <div className="mb-8 border border-dashed border-forestGreen/30/80 rounded-2xl p-4 bg-warmCream/40 text-left">
              <h3 className="font-serif text-sm font-bold text-forestGreen mb-3 flex items-center justify-between">
                <span>Selected Delicacies ({cartItemCount})</span>
              </h3>
              
              {cart.length === 0 ? (
                <p className="font-sans text-xs text-forestGreen/60 italic">Your cart is currently empty. Explore the menu above to select cakes!</p>
              ) : (
                <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs bg-warmCream py-2 px-3 rounded-lg border border-forestGreen/20">
                      <span className="font-sans font-medium text-forestGreen">{item.quantity}x {item.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Form */}
            <form className="space-y-5 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Customer Name */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="name" className="font-sans text-xs font-bold text-forestGreen uppercase tracking-wider flex items-center gap-1">
                    <User size={13} className="text-crispCarrot" /> Name
                  </label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-forestGreen/30 focus:outline-none focus:border-crispCarrot bg-warmCream/50 text-sm text-forestGreen font-sans"
                  />
                </div>

                {/* Contact Phone */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="phone" className="font-sans text-xs font-bold text-forestGreen uppercase tracking-wider flex items-center gap-1">
                    <Phone size={13} className="text-crispCarrot" /> Phone Number
                  </label>
                  <input 
                    type="tel" 
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-forestGreen/30 focus:outline-none focus:border-crispCarrot bg-warmCream/50 text-sm text-forestGreen font-sans"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Delivery Date */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="date" className="font-sans text-xs font-bold text-forestGreen uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={13} className="text-crispCarrot" /> Delivery / Pickup Date
                  </label>
                  <input 
                    type="date" 
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-forestGreen/30 focus:outline-none focus:border-crispCarrot bg-warmCream/50 text-sm text-forestGreen font-sans"
                  />
                </div>

                {/* Additional Note / Timing */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="notes" className="font-sans text-xs font-bold text-forestGreen uppercase tracking-wider flex items-center gap-1">
                    <Clock size={13} className="text-crispCarrot" /> Custom Design & Delivery Notes
                  </label>
                  <input 
                    type="text" 
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="e.g. eggless, write 'Happy Birthday Indu', delivery at 6 PM" 
                    className="w-full px-4 py-3 rounded-xl border border-forestGreen/30 focus:outline-none focus:border-crispCarrot bg-warmCream/50 text-sm text-forestGreen font-sans"
                  />
                </div>

              </div>

              {/* Checkout CTA Buttons */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="submit"
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-4 rounded-xl bg-[#25D366] hover:bg-[#20BA56] text-warmCream font-sans text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <Phone size={16} /> Send via WhatsApp
                </button>
                
                <button
                  type="submit"
                  onClick={handleEmailCheckout}
                  className="w-full py-4 rounded-xl border border-forestGreen/40 hover:border-forestGreen/80 bg-warmCream hover:bg-warmCream text-forestGreen font-sans text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm hover:-translate-y-0.5 transition-all"
                >
                  <Mail size={16} /> Send via Email
                </button>
              </div>

            </form>

          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="bg-warmCream border-t border-forestGreen/20 py-12 md:py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 text-center space-y-8">
          
          {/* Inner banner notifications */}
          <div className="max-w-xl mx-auto px-6 py-4 rounded-2xl bg-warmCream/30 border border-crispCarrot/10 text-forestGreen font-sans text-xs sm:text-sm font-medium tracking-wide">
            📢 Monthly special offers & limited-time designs announced exclusively on our Instagram!
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-forestGreen/20">
            {/* Logo */}
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-forestGreen">Cake Walk</span>
              <p className="font-sans text-[11px] font-semibold text-forestGreen/60 uppercase tracking-widest mt-1">Premium Home Bakery</p>
            </div>

            {/* Socials & Business */}
            <div className="flex flex-col items-center md:items-end gap-2 text-xs text-forestGreen/75">
              <a 
                href="https://instagram.com/Cakewalkbyindhu" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 font-sans font-bold text-forestGreen hover:text-crispCarrot transition-all"
              >
                <Instagram size={15} /> @Cakewalkbyindhu
              </a>
              <p className="font-sans font-medium text-forestGreen/75">📍 Chennai, India | 📞 +91 7358944114 | ✉️ Cakewalk10@gmail.com</p>
              
              {/* ADMIN PORTAL LOGIN LINK */}
              <button 
                onClick={() => setLoginOpen(true)}
                className="text-[10px] font-sans font-bold text-forestGreen/40 hover:text-crispCarrot mt-2 uppercase tracking-widest flex items-center gap-1 transition-colors"
              >
                <Lock size={10} /> Owner Admin Portal
              </button>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-forestGreen/10">
            <p className="font-sans text-[10px] font-semibold text-forestGreen/40 uppercase tracking-wider">
              © {new Date().getFullYear()} Cake Walk by Indu Prabakar. All rights reserved. Crafted with luxury aesthetics.
            </p>
          </div>

        </div>
      </footer>

      {/* SLIDE-OUT SHOPPING CART DRAWER (Glassmorphic Pane) */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-[#2D2430]/35 flex justify-end animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-warmCream border-l border-forestGreen/20 h-full shadow-2xl flex flex-col justify-between animate-slideLeft z-10">
            
            <div className="p-6 border-b border-forestGreen/20 flex justify-between items-center bg-warmCream/35">
              <h2 className="font-serif text-2xl font-bold text-forestGreen flex items-center gap-2">
                <ShoppingCart size={22} className="text-crispCarrot" /> Your Cart
              </h2>
              <button 
                onClick={() => setCartOpen(false)}
                className="p-2 text-forestGreen/70 hover:text-forestGreen rounded-full hover:bg-forestGreen/10 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                  <div className="w-16 h-16 rounded-full bg-warmCream/40 flex items-center justify-center text-crispCarrot">
                    <ShoppingCart size={28} />
                  </div>
                  <div>
                    <p className="font-serif text-lg font-bold text-forestGreen">Your cart is empty</p>
                    <p className="font-sans text-xs text-forestGreen/60 mt-1 max-w-xs">Browse our filterable bakery menu and add fresh cream cakes or dream cakes!</p>
                  </div>
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="px-6 py-2.5 rounded-full bg-forestGreen hover:bg-[#6B0001] text-warmCream font-sans text-xs font-bold tracking-wider"
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-warmCream/45 border border-forestGreen/15 rounded-2xl p-4 flex justify-between gap-3 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="font-sans text-[10px] font-bold text-forestGreen/50 uppercase tracking-wider">{item.category}</p>
                      <h4 className="font-serif text-base font-bold text-forestGreen">{item.name}</h4>
                      <p className="font-sans text-xs font-semibold text-forestGreen/60">Quantity: {item.quantity}</p>
                    </div>

                    <div className="flex flex-col justify-between items-end shrink-0">
                      <button 
                        onClick={() => removeFromCart(item.id, item.name)}
                        className="text-forestGreen/60 hover:text-forestGreen p-1.5 rounded-lg hover:bg-forestGreen/10 transition-all"
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>

                      <div className="flex items-center gap-2 bg-warmCream border border-forestGreen/25 rounded-xl px-2 py-1 shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-forestGreen/70 hover:text-forestGreen p-0.5"
                        >
                          <Minus size={12} className="stroke-[3]" />
                        </button>
                        <span className="font-sans text-xs font-bold text-forestGreen w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-forestGreen/70 hover:text-forestGreen p-0.5"
                        >
                          <Plus size={12} className="stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-forestGreen/20 bg-warmCream/35 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-sm font-semibold text-forestGreen/80">Items in Cart</span>
                  <span className="font-serif text-xl font-bold text-forestGreen">{cartItemCount}</span>
                </div>
                
                <p className="font-sans text-[10px] text-forestGreen/60 leading-relaxed">
                  * Custom designs may require extra preparation time. Fill out checkout details to submit request.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      const orderSection = document.getElementById('order');
                      if (orderSection) {
                        orderSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full py-4 rounded-xl bg-forestGreen hover:bg-[#6B0001] text-warmCream font-sans text-sm font-bold tracking-wider uppercase text-center shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    Go to Checkout
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ADMIN PORTAL LOGIN MODAL */}
      {loginOpen && (
        <div className="fixed inset-0 z-50 bg-[#2D2430]/40 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-warmCream border border-forestGreen/20 p-6 sm:p-8 rounded-3xl max-w-sm w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-2xl font-bold text-forestGreen flex items-center gap-2">
                <Lock size={20} className="text-crispCarrot" /> Owner Access
              </h3>
              <button 
                onClick={() => { setLoginOpen(false); setLoginError(''); setEnteredPassword(''); }}
                className="p-1 text-forestGreen/60 hover:text-forestGreen hover:bg-forestGreen/10 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label htmlFor="adminPass" className="font-sans text-xs font-bold text-forestGreen uppercase tracking-wider">
                  Enter Password
                </label>
                <input 
                  type="password" 
                  id="adminPass"
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-forestGreen/30 focus:outline-none focus:border-crispCarrot bg-warmCream text-sm text-forestGreen"
                />
                {loginError && <p className="text-xs text-red-500 font-medium mt-1">{loginError}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-forestGreen hover:bg-[#6B0001] text-warmCream font-sans text-sm font-bold tracking-wider uppercase transition-colors shadow-md"
              >
                Enter Dashboard
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MAIN ADMIN DASHBOARD OVERLAY */}
      {adminOpen && (
        <div className="fixed inset-0 z-50 bg-[#2D2430]/15 overflow-y-auto p-4 sm:p-6 lg:p-10 flex items-start justify-center">
          <div className="border border-forestGreen/20 rounded-[32px] w-full max-w-6xl shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[600px] animate-fadeIn text-forestGreen" style={{ backgroundColor: '#EFE6DE' }}>
            
            {/* Sidebar Controls */}
            <div className="md:w-64 border-b md:border-b-0 md:border-r border-forestGreen/15 p-6 flex flex-col justify-between" style={{ backgroundColor: '#DFD2C6' }}>
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-forestGreen">Control Center</h3>
                  <p className="font-sans text-[10px] font-bold text-forestGreen/60 uppercase tracking-widest mt-0.5">Website Admin Portal</p>
                </div>

                <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-3 md:pb-0">
                  <button 
                    onClick={() => setActiveAdminTab('pages')}
                    className={`px-4 py-2.5 rounded-xl font-sans text-xs font-bold tracking-wider text-left whitespace-nowrap w-full flex items-center gap-2 ${ activeAdminTab === 'pages' ? 'bg-forestGreen text-warmCream ' : 'text-forestGreen/70 hover:bg-warmCream/40 ' }`}
                  >
                    <Edit size={14} /> Edit Pages
                  </button>
                  <button 
                    onClick={() => setActiveAdminTab('menu')}
                    className={`px-4 py-2.5 rounded-xl font-sans text-xs font-bold tracking-wider text-left whitespace-nowrap w-full flex items-center gap-2 ${ activeAdminTab === 'menu' ? 'bg-forestGreen text-warmCream ' : 'text-forestGreen/70 hover:bg-warmCream/40 ' }`}
                  >
                    <PlusCircle size={14} /> Manage Menu
                  </button>
                  <button 
                    onClick={() => setActiveAdminTab('specials')}
                    className={`px-4 py-2.5 rounded-xl font-sans text-xs font-bold tracking-wider text-left whitespace-nowrap w-full flex items-center gap-2 ${ activeAdminTab === 'specials' ? 'bg-forestGreen text-warmCream ' : 'text-forestGreen/70 hover:bg-warmCream/40 ' }`}
                  >
                    <Sparkles size={14} /> Specials & Marquee
                  </button>
                  <button 
                    onClick={() => setActiveAdminTab('stories')}
                    className={`px-4 py-2.5 rounded-xl font-sans text-xs font-bold tracking-wider text-left whitespace-nowrap w-full flex items-center gap-2 ${ activeAdminTab === 'stories' ? 'bg-forestGreen text-warmCream ' : 'text-forestGreen/70 hover:bg-warmCream/40 ' }`}
                  >
                    <Play size={14} /> Behind the Batter
                  </button>
                  <button 
                    onClick={() => setActiveAdminTab('reviews')}
                    className={`px-4 py-2.5 rounded-xl font-sans text-xs font-bold tracking-wider text-left whitespace-nowrap w-full flex items-center gap-2 ${ activeAdminTab === 'reviews' ? 'bg-forestGreen text-warmCream ' : 'text-forestGreen/70 hover:bg-warmCream/40 ' }`}
                  >
                    <Star size={14} /> Manage Reviews
                  </button>
                  <button 
                    onClick={() => setActiveAdminTab('orders')}
                    className={`px-4 py-2.5 rounded-xl font-sans text-xs font-bold tracking-wider text-left whitespace-nowrap w-full flex items-center gap-2 ${ activeAdminTab === 'orders' ? 'bg-forestGreen text-warmCream ' : 'text-forestGreen/70 hover:bg-warmCream/40 ' }`}
                  >
                    <FileText size={14} /> Orders Log ({siteData.orders?.length || 0})
                  </button>
                  <button 
                    onClick={() => setActiveAdminTab('settings')}
                    className={`px-4 py-2.5 rounded-xl font-sans text-xs font-bold tracking-wider text-left whitespace-nowrap w-full flex items-center gap-2 ${ activeAdminTab === 'settings' ? 'bg-forestGreen text-warmCream ' : 'text-forestGreen/70 hover:bg-warmCream/40 ' }`}
                  >
                    <Settings size={14} /> Portal Settings
                  </button>
                </nav>
              </div>

              <div className="pt-6 md:pt-0 space-y-3">
                <button 
                  onClick={handleFactoryReset}
                  className="w-full py-2.5 border border-forestGreen/30 hover:bg-forestGreen/10 text-forestGreen rounded-xl font-sans text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <RefreshCw size={12} /> Factory Reset CMS
                </button>
                
                <button
                  onClick={() => setAdminOpen(false)}
                  className="w-full py-2.5 bg-forestGreen text-warmCream hover:bg-forestGreen/95 rounded-xl font-sans text-xs font-bold uppercase tracking-wider text-center block transition-all"
                >
                  Exit Dashboard
                </button>
              </div>
            </div>

            {/* Dashboard Workspace */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto max-h-[85vh]" style={{ backgroundColor: '#EFE6DE' }}>
              
              {/* TAB 1: PAGES EDITOR */}
              {activeAdminTab === 'pages' && (
                <div className="space-y-8 text-left">
                  <div>
                    <h4 className="font-serif text-2xl font-bold text-forestGreen">Edit Page Content</h4>
                    <p className="font-sans text-xs text-forestGreen/60 mt-1">Modify headers, intro columns, and founder bios. Updates reflect instantly on save.</p>
                  </div>

                  {/* Hero Settings */}
                  <div className="bg-warmCream border border-forestGreen/20 p-5 rounded-2xl space-y-4" style={{ backgroundColor: '#EFE6DE' }}>
                    <h5 className="font-serif text-lg font-bold text-forestGreen border-b border-forestGreen/15 pb-2">Hero Section</h5>
                    
                    <div className="space-y-3">
                      <div className="flex flex-col space-y-1">
                        <label className="font-sans text-[10px] font-bold text-forestGreen uppercase tracking-wider">Tagline Banner Text</label>
                        <input 
                          type="text" 
                          value={siteData.hero.tagline} 
                          onChange={(e) => setSiteData(prev => ({ ...prev, hero: { ...prev.hero, tagline: e.target.value } }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-sm text-forestGreen" style={{ backgroundColor: '#EFE6DE' }}
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="font-sans text-[10px] font-bold text-forestGreen uppercase tracking-wider">Main Heading</label>
                        <input 
                          type="text" 
                          value={siteData.hero.heading} 
                          onChange={(e) => setSiteData(prev => ({ ...prev, hero: { ...prev.hero, heading: e.target.value } }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-sm font-serif text-forestGreen" style={{ backgroundColor: '#EFE6DE' }}
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="font-sans text-[10px] font-bold text-forestGreen uppercase tracking-wider">Subtext Paragraph</label>
                        <textarea 
                          value={siteData.hero.subtext} 
                          onChange={(e) => setSiteData(prev => ({ ...prev, hero: { ...prev.hero, subtext: e.target.value } }))}
                          rows="3"
                          className="w-full px-4 py-2.5 rounded-xl border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-sm text-forestGreen font-sans" style={{ backgroundColor: '#EFE6DE' }}
                        />
                      </div>

                      {/* Hero Image Selector */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-warmCream border border-forestGreen/20 flex items-center justify-center shrink-0">
                          <img src={siteData.hero.image || defaultHeroCakeImg} alt="Hero preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1">
                          <label className="font-sans text-[10px] font-bold text-forestGreen uppercase tracking-wider block">Custom Hero Cake Photo</label>
                          <div className="relative">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, (base64) => setSiteData(prev => ({ ...prev, hero: { ...prev.hero, image: base64 } })))}
                              className="hidden" 
                              id="heroImgUpload"
                            />
                            <label htmlFor="heroImgUpload" className="px-4 py-2 rounded-xl bg-warmCream hover:bg-warmCream border border-forestGreen/25 font-sans text-xs font-bold flex items-center gap-1.5 cursor-pointer text-forestGreen">
                              <Upload size={12} /> Upload Photo (Max 1.2MB)
                            </label>
                          </div>
                        </div>
                        {siteData.hero.image && (
                          <button 
                            type="button"
                            onClick={() => setSiteData(prev => ({ ...prev, hero: { ...prev.hero, image: '' } }))}
                            className="text-forestGreen hover:underline font-sans text-xs font-bold pt-2 sm:pt-0"
                          >
                            Revert to Default
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Story Settings */}
                  <div className="bg-warmCream border border-forestGreen/20 p-5 rounded-2xl space-y-4" style={{ backgroundColor: '#EFE6DE' }}>
                    <h5 className="font-serif text-lg font-bold text-forestGreen border-b border-forestGreen/15 pb-2">Story & Founder Section</h5>
                    
                    <div className="space-y-3">
                      <div className="flex flex-col space-y-1">
                        <label className="font-sans text-[10px] font-bold text-forestGreen uppercase tracking-wider">Story Heading</label>
                        <input 
                          type="text" 
                          value={siteData.story.heading} 
                          onChange={(e) => setSiteData(prev => ({ ...prev, story: { ...prev.story, heading: e.target.value } }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-sm text-forestGreen font-serif"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="font-sans text-[10px] font-bold text-forestGreen uppercase tracking-wider">Paragraph 1 (Intro)</label>
                        <textarea 
                          value={siteData.story.paragraph1} 
                          onChange={(e) => setSiteData(prev => ({ ...prev, story: { ...prev.story, paragraph1: e.target.value } }))}
                          rows="3"
                          className="w-full px-4 py-2.5 rounded-xl border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-sm text-forestGreen font-sans" style={{ backgroundColor: '#EFE6DE' }}
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="font-sans text-[10px] font-bold text-forestGreen uppercase tracking-wider">Paragraph 2 (Details)</label>
                        <textarea 
                          value={siteData.story.paragraph2} 
                          onChange={(e) => setSiteData(prev => ({ ...prev, story: { ...prev.story, paragraph2: e.target.value } }))}
                          rows="3"
                          className="w-full px-4 py-2.5 rounded-xl border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-sm text-forestGreen font-sans" style={{ backgroundColor: '#EFE6DE' }}
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="font-sans text-[10px] font-bold text-forestGreen uppercase tracking-wider">Bio Quote</label>
                        <textarea 
                          value={siteData.story.bioQuote} 
                          onChange={(e) => setSiteData(prev => ({ ...prev, story: { ...prev.story, bioQuote: e.target.value } }))}
                          rows="2"
                          className="w-full px-4 py-2.5 rounded-xl border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-sm text-forestGreen italic font-serif"
                        />
                      </div>

                      {/* Founder Portrait Selector */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                        <div className="w-16 h-20 rounded-xl overflow-hidden bg-warmCream border border-forestGreen/20 flex items-center justify-center shrink-0">
                          <img src={siteData.story.image || defaultFounderPortraitImg} alt="Founder portrait preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1">
                          <label className="font-sans text-[10px] font-bold text-forestGreen uppercase tracking-wider block">Custom Founder Photo</label>
                          <div className="relative">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, (base64) => setSiteData(prev => ({ ...prev, story: { ...prev.story, image: base64 } })))}
                              className="hidden" 
                              id="founderImgUpload"
                            />
                            <label htmlFor="founderImgUpload" className="px-4 py-2 rounded-xl bg-warmCream hover:bg-warmCream border border-forestGreen/25 font-sans text-xs font-bold flex items-center gap-1.5 cursor-pointer text-forestGreen">
                              <Upload size={12} /> Upload Photo (Max 1.2MB)
                            </label>
                          </div>
                        </div>
                        {siteData.story.image && (
                          <button 
                            type="button"
                            onClick={() => setSiteData(prev => ({ ...prev, story: { ...prev.story, image: '' } }))}
                            className="text-forestGreen hover:underline font-sans text-xs font-bold pt-2 sm:pt-0"
                          >
                            Revert to Default
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MENU MANAGER */}
              {activeAdminTab === 'menu' && (
                <div className="space-y-8 text-left">
                  <div>
                    <h4 className="font-serif text-2xl font-bold text-forestGreen">Gourmet Menu Manager</h4>
                    <p className="font-sans text-xs text-forestGreen/60 mt-1">Add new menu items, edit tags and details, or remove sweets instantly.</p>
                  </div>

                  {/* Add New Item Form */}
                  <div className="bg-warmCream border border-forestGreen/20 p-5 rounded-2xl space-y-4" style={{ backgroundColor: '#EFE6DE' }}>
                    <h5 className="font-serif text-base font-bold text-forestGreen border-b border-forestGreen/15 pb-2 flex items-center gap-1">
                      <PlusCircle size={16} className="text-crispCarrot" /> Add a New Menu Item
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col space-y-1">
                        <label className="font-sans text-[10px] font-bold text-forestGreen uppercase tracking-wider">Item Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Red Velvet Cake" 
                          value={newItem.name}
                          onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                          className="px-3 py-2 rounded-lg border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-xs text-forestGreen"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="font-sans text-[10px] font-bold text-forestGreen uppercase tracking-wider">Price (₹)</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 850" 
                          value={newItem.price}
                          onChange={(e) => setNewItem(prev => ({ ...prev, price: parseInt(e.target.value) || '' }))}
                          className="px-3 py-2 rounded-lg border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-xs text-forestGreen"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="font-sans text-[10px] font-bold text-forestGreen uppercase tracking-wider">Category</label>
                        <select 
                          value={newItem.category}
                          onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                          className="px-3 py-2 rounded-lg border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-xs text-forestGreen"
                        >
                          <option value="Fresh Cream Cakes">Fresh Cream Cakes</option>
                          <option value="Dream Cakes">Dream Cakes</option>
                          <option value="Dessert Cups">Dessert Cups</option>
                          <option value="Tres Leches">Tres Leches</option>
                          <option value="Brownies">Brownies</option>
                        </select>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="font-sans text-[10px] font-bold text-forestGreen uppercase tracking-wider">Visual Tag</label>
                        <select 
                          value={newItem.tag}
                          onChange={(e) => setNewItem(prev => ({ ...prev, tag: e.target.value }))}
                          className="px-3 py-2 rounded-lg border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-xs text-forestGreen"
                        >
                          <option value="Classic">Classic</option>
                          <option value="Chocolate">Chocolate</option>
                          <option value="Premium">Premium</option>
                        </select>
                      </div>

                      <div className="flex flex-col space-y-1 sm:col-span-2">
                        <label className="font-sans text-[10px] font-bold text-forestGreen uppercase tracking-wider">Description</label>
                        <input 
                          type="text" 
                          placeholder="Brief description of flavours and ingredients..." 
                          value={newItem.desc}
                          onChange={(e) => setNewItem(prev => ({ ...prev, desc: e.target.value }))}
                          className="px-3 py-2 rounded-lg border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-xs text-forestGreen"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2 border-t border-forestGreen/10 mt-2">
                      <div className="space-y-1">
                        <label className="font-sans text-[10px] font-bold text-forestGreen uppercase tracking-wider block">Photo (Optional)</label>
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (base64) => setNewItem(prev => ({ ...prev, image: base64 } )))}
                            className="hidden" 
                            id="newItemImgUpload"
                          />
                          <label htmlFor="newItemImgUpload" className="px-4 py-2 rounded-xl bg-warmCream hover:bg-warmCream border border-forestGreen/25 font-sans text-xs font-bold flex items-center gap-1.5 cursor-pointer text-forestGreen">
                            <Upload size={12} /> {newItem.image ? "Photo Added!" : "Upload Photo"}
                          </label>
                        </div>
                      </div>
                      {newItem.image && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-warmCream border border-forestGreen/20 flex items-center justify-center shrink-0">
                          <img src={newItem.image} alt="new item preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <button 
                        type="button"
                        onClick={() => {
                          if (!newItem.name || !newItem.price) {
                            alert("Please fill in Name and Price!");
                            return;
                          }
                          const addedItem = {
                            ...newItem,
                            id: `item-${Date.now()}`
                          };
                          setSiteData(prev => ({
                            ...prev,
                            menuItems: [addedItem, ...prev.menuItems]
                          }));
                          setNewItem({ name: '', price: '', category: 'Fresh Cream Cakes', tag: 'Classic', desc: '', image: '' });
                          showToast("New menu item created!");
                        }}
                        className="sm:ml-auto px-6 py-2 rounded-xl bg-forestGreen hover:bg-[#6B0001] text-warmCream font-sans text-xs font-bold uppercase tracking-wider shadow"
                      >
                        Create Sweets Item
                      </button>
                    </div>
                  </div>

                  {/* List of existing items */}
                  <div className="border border-forestGreen/20 rounded-2xl overflow-hidden bg-warmCream">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-sans text-left">
                        <thead>
                          <tr className="bg-warmCream/20 border-b border-forestGreen/20 text-forestGreen uppercase font-bold text-[10px] tracking-wider">
                            <th className="p-4">Name / Category</th>
                            <th className="p-4">Tag</th>
                            <th className="p-4">Price</th>
                            <th className="p-4 text-center">Photo</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {siteData.menuItems.map((item) => (
                            <tr key={item.id} className="border-b border-forestGreen/10 hover:bg-warmCream/5">
                              <td className="p-4">
                                <p className="font-bold text-forestGreen text-sm">{item.name}</p>
                                <p className="text-[10px] text-forestGreen/50 mt-0.5">{item.category}</p>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${getTagColorClass(item.tag)}`}>
                                  {item.tag}
                                </span>
                              </td>
                              <td className="p-4 font-serif text-sm font-semibold text-forestGreen">₹{item.price}</td>
                              <td className="p-4 text-center">
                                {item.image ? (
                                  <img src={item.image} alt="preview" className="w-8 h-8 rounded object-cover mx-auto" />
                                ) : (
                                  <span className="text-[10px] text-forestGreen/40">Default</span>
                                )}
                              </td>
                              <td className="p-4 text-right space-x-3">
                                <button 
                                  type="button"
                                  onClick={() => setActiveEditModalItem(item)}
                                  className="text-forestGreen/70 hover:text-crispCarrot font-bold"
                                >
                                  Edit
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Delete ${item.name} from menu?`)) {
                                      setSiteData(prev => ({
                                        ...prev,
                                        menuItems: prev.menuItems.filter(m => m.id !== item.id)
                                      }));
                                      showToast("Menu item deleted.");
                                    }
                                  }}
                                  className="text-forestGreen hover:underline"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SPECIALS & MARQUEE */}
              {activeAdminTab === 'specials' && (
                <div className="space-y-8 text-left">
                  <div>
                    <h4 className="font-serif text-2xl font-bold text-forestGreen">Specials & Marquee Banner</h4>
                    <p className="font-sans text-xs text-forestGreen/60 mt-1">Configure marquee slogans and spotlight confection cards.</p>
                  </div>

                  {/* Marquee Tags */}
                  <div className="bg-warmCream border border-forestGreen/20 p-5 rounded-2xl space-y-4" style={{ backgroundColor: '#EFE6DE' }}>
                    <h5 className="font-serif text-base font-bold text-forestGreen border-b border-forestGreen/15 pb-2">Marquee Banner Slogans</h5>
                    
                    <div className="space-y-3">
                      <p className="text-[10px] text-forestGreen/60">Enter values separated by commas (these scroll continuously on the home page):</p>
                      <textarea 
                        value={siteData.marquee.join(', ')} 
                        onChange={(e) => {
                          const parsed = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                          setSiteData(prev => ({ ...prev, marquee: parsed }));
                        }}
                        rows="2"
                        className="w-full px-4 py-2.5 rounded-xl border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-xs font-mono text-forestGreen"
                      />
                    </div>
                  </div>

                  {/* Specials Manager */}
                  <div className="bg-warmCream border border-forestGreen/20 p-5 rounded-2xl space-y-4" style={{ backgroundColor: '#EFE6DE' }}>
                    <h5 className="font-serif text-base font-bold text-forestGreen border-b border-forestGreen/15 pb-2">Spotlight Specials</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {siteData.specials.map((special) => (
                        <div key={special.id} className="bg-warmCream p-4 border border-forestGreen/20 rounded-xl space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-xs text-forestGreen uppercase">{special.tag}</span>
                            <span className="font-bold text-[#FF4D4F]">₹{special.price}</span>
                          </div>
                          
                          <h6 className="font-serif font-bold text-base text-forestGreen">{special.name}</h6>
                          <p className="text-[11px] text-forestGreen/70">{special.desc}</p>
                          
                          {/* File selector for special image */}
                          <div className="pt-2 flex items-center justify-between gap-2 border-t border-dashed border-forestGreen/15">
                            {special.image ? (
                              <img src={special.image} alt="preview" className="w-8 h-8 rounded object-cover" />
                            ) : (
                              <span className="text-[9px] text-forestGreen/50">No photo</span>
                            )}
                            <div className="relative">
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, (base64) => {
                                  setSiteData(prev => ({
                                    ...prev,
                                    specials: prev.specials.map(s => s.id === special.id ? { ...s, image: base64 } : s)
                                  }));
                                })}
                                className="hidden" 
                                id={`specImgUpload-${special.id}`}
                              />
                              <label htmlFor={`specImgUpload-${special.id}`} className="px-2 py-1 rounded-lg bg-warmCream hover:bg-warmCream border border-forestGreen/25 font-sans text-[10px] font-bold cursor-pointer text-forestGreen">
                                Upload Photo
                              </label>
                            </div>
                          </div>

                          {/* Edit popup trigger */}
                          <button
                            type="button"
                            onClick={() => setActiveEditModalItem(special)}
                            className="w-full py-1.5 bg-warmCream/50 hover:bg-warmCream border border-forestGreen/20 rounded-lg text-[10px] font-bold text-forestGreen text-center block mt-2"
                          >
                            Modify Slogan / Price
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ORDERS LOG */}
              {activeAdminTab === 'stories' && (
                <div className="space-y-8 text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="font-serif text-2xl font-bold text-forestGreen">Sensory Video Stories CMS</h4>
                      <p className="font-sans text-xs text-forestGreen/60 mt-1">Configure story videos shown in the "Behind the Batter" carousel.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Add Demo Video */}
                      <button
                        type="button"
                        onClick={() => {
                          const newId = `st-${Date.now()}`;
                          const newStory = {
                            id: newId,
                            title: 'New Story Video',
                            desc: 'Enter video description here.',
                            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-chocolate-glaze-on-a-cake-41552-large.mp4'
                          };
                          setSiteData(prev => ({
                            ...prev,
                            stories: [...(prev.stories || []), newStory]
                          }));
                          setActiveEditModalItem(newStory);
                          showToast("New story slot created!");
                        }}
                        className="px-4 py-2 bg-warmCream hover:bg-warmCream/95 text-forestGreen border border-forestGreen/25 rounded-xl font-sans text-xs font-bold flex items-center gap-1 shadow transition-luxury cursor-pointer"
                      >
                        <PlusCircle size={14} /> Add Demo Video
                      </button>

                      {/* Add directly from Local file */}
                      <input
                        type="file"
                        accept="video/*"
                        id="addStoryLocalUpload"
                        onChange={(e) => handleVideoUpload(e, (base64) => {
                          const newId = `st-${Date.now()}`;
                          const newStory = {
                            id: newId,
                            title: 'New Local Video',
                            desc: 'Enter video description here.',
                            videoUrl: base64
                          };
                          setSiteData(prev => ({
                            ...prev,
                            stories: [...(prev.stories || []), newStory]
                          }));
                          setActiveEditModalItem(newStory);
                          showToast("Local story created! Please add details below.");
                        }, showToast)}
                        className="hidden"
                      />
                      <label
                        htmlFor="addStoryLocalUpload"
                        className="px-4 py-2 bg-forestGreen hover:bg-forestGreen/95 text-warmCream rounded-xl font-sans text-xs font-bold flex items-center gap-1 shadow cursor-pointer transition-luxury"
                      >
                        <Upload size={14} /> Add from Local File
                      </label>
                    </div>
                  </div>

                  <div className="bg-warmCream border border-forestGreen/20 p-5 rounded-2xl space-y-4" style={{ backgroundColor: '#EFE6DE' }}>
                    <h5 className="font-serif text-base font-bold text-forestGreen border-b border-forestGreen/15 pb-2">Active Stories Carousel</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {(siteData.stories || []).map((story) => (
                        <div key={story.id} className="bg-warmCream p-4 border border-forestGreen/20 rounded-xl flex flex-col justify-between space-y-3 h-[285px]">
                          <div className="space-y-2">
                            <div className="w-full h-24 rounded-lg overflow-hidden bg-black border border-forestGreen/10 relative">
                              <video
                                src={story.videoUrl}
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h6 className="font-serif font-bold text-sm text-forestGreen truncate">{story.title}</h6>
                            <p className="text-[10px] text-forestGreen/70 line-clamp-2 h-7">{story.desc}</p>
                          </div>

                          {/* Direct Local Video File Upload Row */}
                          <div className="pt-2 flex items-center justify-between gap-2 border-t border-dashed border-forestGreen/15">
                            <span className="text-[9px] text-forestGreen/50 truncate max-w-[80px]">
                              {story.videoUrl && story.videoUrl.startsWith('data:') ? '📌 Local' : '🌐 External'}
                            </span>
                            <div className="relative">
                              <input 
                                type="file" 
                                accept="video/*"
                                onChange={(e) => handleVideoUpload(e, (base64) => {
                                  setSiteData(prev => ({
                                    ...prev,
                                    stories: prev.stories.map(s => s.id === story.id ? { ...s, videoUrl: base64 } : s)
                                  }));
                                  showToast("Local video uploaded!");
                                }, showToast)}
                                className="hidden" 
                                id={`storyVidUpload-${story.id}`}
                              />
                              <label htmlFor={`storyVidUpload-${story.id}`} className="px-2 py-1 rounded-lg bg-warmCream hover:bg-warmCream/95 border border-forestGreen/25 font-sans text-[9px] font-bold cursor-pointer text-forestGreen">
                                Replace MP4
                              </label>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2 border-t border-dashed border-forestGreen/15">
                            <button
                              type="button"
                              onClick={() => setActiveEditModalItem(story)}
                              className="flex-grow py-1.5 bg-warmCream hover:bg-warmCream/95 border border-forestGreen/20 rounded-lg text-[10px] font-bold text-forestGreen text-center cursor-pointer"
                            >
                              Edit details
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this story?")) {
                                  setSiteData(prev => ({
                                    ...prev,
                                    stories: prev.stories.filter(s => s.id !== story.id)
                                  }));
                                  showToast("Story deleted.");
                                }
                              }}
                              className="py-1.5 px-2 bg-forestGreen/10 hover:bg-forestGreen/20 border border-forestGreen/20 text-forestGreen"
                              title="Delete Story"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {(siteData.stories || []).length === 0 && (
                        <div className="col-span-full py-12 text-center border border-dashed border-forestGreen/25 rounded-2xl text-forestGreen/40 font-sans text-xs">
                          No stories defined. Click "Add Story Video" above to create one.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeAdminTab === 'reviews' && (
                <div className="space-y-8 text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="font-serif text-2xl font-bold text-forestGreen">Customer Reviews CMS</h4>
                      <p className="font-sans text-xs text-forestGreen/60 mt-1">Configure customer testimonials and star ratings displayed in the Sweet Praises section.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newId = `rev-${Date.now()}`;
                        const newReview = {
                          id: newId,
                          testimonial: 'Baking magic! Absolute perfection.',
                          by: 'Name, Location',
                          rating: 5
                        };
                        setSiteData(prev => ({
                          ...prev,
                          reviews: [...(prev.reviews || []), newReview]
                        }));
                        setActiveEditModalItem(newReview);
                        showToast("New review slot created!");
                      }}
                      className="px-4 py-2 bg-forestGreen hover:bg-forestGreen/95 text-warmCream rounded-xl font-sans text-xs font-bold flex items-center gap-1 shadow transition-luxury cursor-pointer"
                    >
                      <PlusCircle size={14} /> Add Review
                    </button>
                  </div>

                  <div className="bg-warmCream border border-forestGreen/20 p-5 rounded-2xl space-y-4" style={{ backgroundColor: '#EFE6DE' }}>
                    <h5 className="font-serif text-base font-bold text-forestGreen border-b border-forestGreen/15 pb-2">Active Reviews</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(siteData.reviews || []).map((review) => (
                        <div key={review.id} className="bg-warmCream p-5 border border-forestGreen/20 rounded-xl flex flex-col justify-between space-y-4 min-h-[200px]">
                          <div className="space-y-2">
                            <div className="flex gap-0.5">
                              {Array.from({ length: review.rating || 5 }).map((_, i) => (
                                <Star key={i} size={14} className="fill-[#9A0002] text-[#9A0002]" />
                              ))}
                            </div>
                            <p className="font-serif italic text-sm text-forestGreen leading-relaxed">
                              "{review.testimonial}"
                            </p>
                            <p className="font-sans text-xs font-bold text-forestGreen/80">
                              — {review.by}
                            </p>
                          </div>

                          <div className="flex gap-2 pt-3 border-t border-dashed border-forestGreen/15">
                            <button
                              type="button"
                              onClick={() => setActiveEditModalItem(review)}
                              className="flex-grow py-1.5 bg-warmCream hover:bg-warmCream/95 border border-forestGreen/20 rounded-lg text-[10px] font-bold text-forestGreen text-center cursor-pointer"
                            >
                              Edit details
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this review?")) {
                                  setSiteData(prev => ({
                                    ...prev,
                                    reviews: (prev.reviews || []).filter(r => r.id !== review.id)
                                  }));
                                  showToast("Review deleted.");
                                }
                              }}
                              className="py-1.5 px-2 bg-forestGreen/10 hover:bg-forestGreen/20 border border-forestGreen/20 text-forestGreen rounded-lg cursor-pointer"
                              title="Delete Review"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {(siteData.reviews || []).length === 0 && (
                        <div className="col-span-full py-12 text-center border border-dashed border-forestGreen/25 rounded-2xl text-forestGreen/40 font-sans text-xs">
                          No reviews defined. Click "Add Review" above to create one.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeAdminTab === 'orders' && (
                <div className="space-y-8 text-left">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-serif text-2xl font-bold text-forestGreen">Local Orders Ledger</h4>
                      <p className="font-sans text-xs text-forestGreen/60 mt-1">Check names, dates, items, and values of compiled checkout requests.</p>
                    </div>
                    {siteData.orders?.length > 0 && (
                      <button 
                        type="button"
                        onClick={() => {
                          if (window.confirm("Clear all orders from ledger?")) {
                            setSiteData(prev => ({ ...prev, orders: [] }));
                            showToast("Ledger logs cleared.");
                          }
                        }}
                        className="px-4 py-2 border border-forestGreen/30 text-forestGreen hover:bg-forestGreen/10 rounded-xl text-xs"
                      >
                        Clear Order Logs
                      </button>
                    )}
                  </div>

                  {(!siteData.orders || siteData.orders.length === 0) ? (
                    <div className="border border-dashed border-forestGreen/25 rounded-3xl p-12 text-center text-forestGreen/50 bg-warmCream">
                      <p className="font-serif text-lg font-bold">No orders logged yet</p>
                      <p className="text-xs mt-1">When users fill out order forms and check out, records show up here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {siteData.orders.map((ord) => (
                        <div key={ord.id} className="bg-warmCream border border-forestGreen/20 rounded-2xl p-5 shadow-sm space-y-4 text-forestGreen">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-forestGreen/15 pb-3">
                            <div>
                              <p className="text-xs font-bold text-crispCarrot uppercase tracking-wider">Order #{ord.id.split('-')[1]}</p>
                              <p className="text-[10px] text-forestGreen/50">{ord.timestamp}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-serif text-lg font-bold text-forestGreen">Total: ₹{ord.total}</span>
                              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${ ord.status === 'Completed' ? 'bg-green-100 text-green-700 ' : 'bg-orange-100 text-orange-700 ' }`}>
                                {ord.status}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1.5">
                              <p className="text-forestGreen/55 uppercase tracking-widest text-[9px] font-bold">Client Information</p>
                              <p className="font-bold">👤 Name: {ord.customerName}</p>
                              <p className="font-bold">📞 Phone: {ord.phone}</p>
                              <p className="font-bold">📅 Date: {ord.deliveryDate}</p>
                              <p className="bg-warmCream/30 p-2 rounded-lg border border-forestGreen/15 mt-1">
                                💬 Design Notes: {ord.notes}
                              </p>
                            </div>

                            <div className="space-y-1.5">
                              <p className="text-forestGreen/55 uppercase tracking-widest text-[9px] font-bold">Selected Sweets</p>
                              <div className="space-y-1 max-h-[100px] overflow-y-auto pr-1">
                                {ord.items.map((i, idx) => (
                                  <div key={idx} className="flex justify-between py-1 border-b border-dashed border-forestGreen/10">
                                    <span className="font-medium">{i.quantity}x {i.name}</span>
                                    <span className="font-bold text-crispCarrot">₹{i.price * i.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 border-t border-forestGreen/15 pt-3 mt-1">
                            <button
                              type="button"
                              onClick={() => {
                                const newStatus = ord.status === 'Pending' ? 'Completed' : 'Pending';
                                setSiteData(prev => ({
                                  ...prev,
                                  orders: prev.orders.map(o => o.id === ord.id ? { ...o, status: newStatus } : o)
                                }));
                                showToast(`Order marked as ${newStatus}!`);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-warmCream/40 hover:bg-warmCream/80 text-forestGreen font-bold border border-forestGreen/25"
                            >
                              Mark {ord.status === 'Pending' ? 'Complete' : 'Pending'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm("Delete this order record?")) {
                                  setSiteData(prev => ({
                                    ...prev,
                                    orders: prev.orders.filter(o => o.id !== ord.id)
                                  }));
                                  showToast("Order record removed.");
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg border border-forestGreen/25 hover:bg-forestGreen/10 text-forestGreen font-bold"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: PORTAL SETTINGS */}
              {activeAdminTab === 'settings' && (
                <div className="space-y-8 text-left">
                  <div>
                    <h4 className="font-serif text-2xl font-bold text-forestGreen">Portal Settings</h4>
                    <p className="font-sans text-xs text-forestGreen/60 mt-1">Update your security codes and admin login credentials.</p>
                  </div>

                  <div className="bg-warmCream border border-forestGreen/20 p-5 rounded-2xl space-y-4" style={{ backgroundColor: '#EFE6DE' }}>
                    <h5 className="font-serif text-base font-bold text-forestGreen border-b border-forestGreen/15 pb-2">Change Password</h5>
                    
                    <div className="max-w-sm space-y-4">
                      <div className="flex flex-col space-y-1">
                        <label className="font-sans text-[10px] font-bold text-forestGreen uppercase tracking-wider">New Password</label>
                        <input 
                          type="password" 
                          placeholder="Enter new password" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="px-3 py-2.5 rounded-xl border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-xs font-mono text-forestGreen"
                        />
                      </div>
                      
                      <button 
                        type="button"
                        onClick={() => {
                          if (!newPassword) {
                            alert("Please enter a password!");
                            return;
                          }
                          setSiteData(prev => ({
                            ...prev,
                            adminPassword: newPassword
                          }));
                          setNewPassword('');
                          showToast("Admin password updated successfully!");
                        }}
                        className="px-5 py-2.5 bg-forestGreen hover:bg-[#6B0001] text-warmCream rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-colors shadow"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* EDIT POPUP MODAL */}
      {activeEditModalItem && (
        <div className="fixed inset-0 z-50 bg-[#2D2430]/20 flex items-center justify-center p-4 animate-fadeIn">
          <div className="border border-forestGreen/20 p-6 sm:p-8 rounded-3xl max-w-lg w-full shadow-2xl space-y-6 text-left max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#EFE6DE' }}>
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-2xl font-bold text-forestGreen flex items-center gap-2">
                <Edit size={20} className="text-crispCarrot" /> Edit Delicacy Details
              </h3>
              <button 
                type="button"
                onClick={() => setActiveEditModalItem(null)}
                className="p-1 text-forestGreen/60 hover:text-forestGreen hover:bg-forestGreen/10 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const isReview = activeEditModalItem.id.startsWith('rev-');
              const isStory = activeEditModalItem.id.startsWith('st-');
              const isMenu = siteData.menuItems.some(m => m.id === activeEditModalItem.id);
              
              if (isReview) {
                setSiteData(prev => ({
                  ...prev,
                  reviews: (prev.reviews || []).map(r => r.id === activeEditModalItem.id ? activeEditModalItem : r)
                }));
                showToast("Review updated successfully!");
              } else if (isStory) {
                setSiteData(prev => ({
                  ...prev,
                  stories: prev.stories.map(s => s.id === activeEditModalItem.id ? activeEditModalItem : s)
                }));
                showToast("Story video updated successfully!");
              } else if (isMenu) {
                setSiteData(prev => ({
                  ...prev,
                  menuItems: prev.menuItems.map(m => m.id === activeEditModalItem.id ? activeEditModalItem : m)
                }));
                showToast("Menu item updated successfully!");
              } else {
                setSiteData(prev => ({
                  ...prev,
                  specials: prev.specials.map(s => s.id === activeEditModalItem.id ? activeEditModalItem : s)
                }));
                showToast("Special confection updated successfully!");
              }
              setActiveEditModalItem(null);
            }} className="space-y-4 font-sans text-xs">
              {activeEditModalItem.id.startsWith('rev-') ? (
                <>
                  <div className="flex flex-col space-y-1">
                    <label className="font-bold text-forestGreen uppercase tracking-wider">Reviewer Name</label>
                    <input 
                      type="text" 
                      value={activeEditModalItem.by} 
                      onChange={(e) => setActiveEditModalItem({ ...activeEditModalItem, by: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-sm text-forestGreen" style={{ backgroundColor: '#EFE6DE' }}
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-bold text-forestGreen uppercase tracking-wider">Rating (1 to 5 Stars)</label>
                    <select 
                      value={activeEditModalItem.rating || 5} 
                      onChange={(e) => setActiveEditModalItem({ ...activeEditModalItem, rating: parseInt(e.target.value) || 5 })}
                      className="w-full px-3 py-2.5 rounded-xl border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-sm text-forestGreen" style={{ backgroundColor: '#EFE6DE' }}
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-bold text-forestGreen uppercase tracking-wider">Review Text</label>
                    <textarea 
                      value={activeEditModalItem.testimonial} 
                      onChange={(e) => setActiveEditModalItem({ ...activeEditModalItem, testimonial: e.target.value })}
                      rows="4"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-sm text-forestGreen font-sans" style={{ backgroundColor: '#EFE6DE' }}
                    />
                  </div>
                </>
              ) : activeEditModalItem.id.startsWith('st-') ? (
                <>
                  <div className="flex flex-col space-y-1">
                    <label className="font-bold text-forestGreen uppercase tracking-wider">Story Title</label>
                    <input 
                      type="text" 
                      value={activeEditModalItem.title} 
                      onChange={(e) => setActiveEditModalItem({ ...activeEditModalItem, title: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-sm text-forestGreen" style={{ backgroundColor: '#EFE6DE' }}
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-bold text-forestGreen uppercase tracking-wider">Description</label>
                    <textarea 
                      value={activeEditModalItem.desc} 
                      onChange={(e) => setActiveEditModalItem({ ...activeEditModalItem, desc: e.target.value })}
                      rows="3"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-sm text-forestGreen font-sans" style={{ backgroundColor: '#EFE6DE' }}
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-bold text-forestGreen uppercase tracking-wider">Video URL (Or upload below)</label>
                    <input 
                      type="text" 
                      value={activeEditModalItem.videoUrl} 
                      onChange={(e) => setActiveEditModalItem({ ...activeEditModalItem, videoUrl: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-sm text-forestGreen" style={{ backgroundColor: '#EFE6DE' }}
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-2 border-t border-dashed border-forestGreen/15">
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-black border border-forestGreen/20 flex items-center justify-center shrink-0">
                      {activeEditModalItem.videoUrl ? (
                        <video src={activeEditModalItem.videoUrl} muted className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-forestGreen/45">No Video</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-forestGreen uppercase tracking-wider block">Upload Video File</label>
                      <input 
                        type="file" 
                        accept="video/*"
                        id="editModalVideoUpload"
                        onChange={(e) => handleVideoUpload(e, (base64) => setActiveEditModalItem({ ...activeEditModalItem, videoUrl: base64 }), showToast)}
                        className="hidden"
                      />
                      <label htmlFor="editModalVideoUpload" className="px-3 py-1.5 rounded-xl bg-warmCream hover:bg-warmCream border border-forestGreen/25 font-sans text-[10px] font-bold cursor-pointer text-forestGreen">
                        Upload MP4
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col space-y-1">
                    <label className="font-bold text-forestGreen uppercase tracking-wider">Item Name</label>
                    <input 
                      type="text" 
                      value={activeEditModalItem.name} 
                      onChange={(e) => setActiveEditModalItem({ ...activeEditModalItem, name: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-sm text-forestGreen" style={{ backgroundColor: '#EFE6DE' }}
                    />
                  </div>

              <div className="flex flex-col space-y-1">
                <label className="font-bold text-forestGreen uppercase tracking-wider">Internal Reference Price (₹)</label>
                <input 
                  type="number" 
                  value={activeEditModalItem.price} 
                  onChange={(e) => setActiveEditModalItem({ ...activeEditModalItem, price: parseInt(e.target.value) || 0 })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-sm text-forestGreen" style={{ backgroundColor: '#EFE6DE' }}
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-bold text-forestGreen uppercase tracking-wider">Description</label>
                <textarea 
                  value={activeEditModalItem.desc} 
                  onChange={(e) => setActiveEditModalItem({ ...activeEditModalItem, desc: e.target.value })}
                  rows="3"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-sm text-forestGreen font-sans" style={{ backgroundColor: '#EFE6DE' }}
                />
              </div>

              {siteData.menuItems.some(m => m.id === activeEditModalItem.id) && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="font-bold text-forestGreen uppercase tracking-wider">Category</label>
                    <select 
                      value={activeEditModalItem.category} 
                      onChange={(e) => setActiveEditModalItem({ ...activeEditModalItem, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-sm text-forestGreen" style={{ backgroundColor: '#EFE6DE' }}
                    >
                      <option value="Fresh Cream Cakes">Fresh Cream Cakes</option>
                      <option value="Dream Cakes">Dream Cakes</option>
                      <option value="Dessert Cups">Dessert Cups</option>
                      <option value="Tres Leches">Tres Leches</option>
                      <option value="Brownies">Brownies</option>
                    </select>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="font-bold text-forestGreen uppercase tracking-wider">Tag</label>
                    <select 
                      value={activeEditModalItem.tag} 
                      onChange={(e) => setActiveEditModalItem({ ...activeEditModalItem, tag: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-forestGreen/25 focus:outline-none focus:border-crispCarrot bg-warmCream text-sm text-forestGreen" style={{ backgroundColor: '#EFE6DE' }}
                    >
                      <option value="Classic">Classic</option>
                      <option value="Chocolate">Chocolate</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 pt-2 border-t border-dashed border-forestGreen/15">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-warmCream border border-forestGreen/20 flex items-center justify-center shrink-0">
                  {activeEditModalItem.image ? (
                    <img src={activeEditModalItem.image} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-forestGreen/45">No Photo</span>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-forestGreen uppercase tracking-wider block">Replace Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    id="editModalImgUpload"
                    onChange={(e) => handleImageUpload(e, (base64) => setActiveEditModalItem({ ...activeEditModalItem, image: base64 }))}
                    className="hidden"
                  />
                  <label htmlFor="editModalImgUpload" className="px-3 py-1.5 rounded-xl bg-warmCream hover:bg-warmCream border border-forestGreen/25 font-sans text-[10px] font-bold cursor-pointer text-forestGreen">
                    Upload New
                  </label>
                </div>
                {activeEditModalItem.image && (
                  <button 
                    type="button" 
                    onClick={() => setActiveEditModalItem({ ...activeEditModalItem, image: '' })}
                    className="text-forestGreen hover:underline ml-auto"
                  >
                    Clear Photo
                  </button>
                )}
              </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#9A0002] hover:bg-[#6B0001] text-warmCream font-sans text-sm font-bold tracking-wider uppercase transition-colors shadow-md mt-4"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
