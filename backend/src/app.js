const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { properties, agents, stats, formatPrice } = require('./data/seed');

const JWT_SECRET = process.env.JWT_SECRET || 'estateflow-dev-secret-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));

// ══════════════════════════════════════════════════
// IN-MEMORY DATA STORES
// ══════════════════════════════════════════════════

var users = [
  {
    id: 'u-admin',
    name: 'Admin User',
    email: 'admin@estateflow.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'admin_head',
    phone: '+1 (555) 000-0001',
    address: '', city: '', state: '', zip: '', country: 'US', bio: '',
    isActive: true,
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'u-buyer',
    name: 'Alex Carter',
    email: 'buyer@estateflow.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'buyer',
    phone: '+1 (555) 000-0002',
    address: '45 Elm Street', city: 'Austin', state: 'TX', zip: '78704', country: 'US', bio: '',
    isActive: true,
    createdAt: new Date('2024-03-05').toISOString(),
  },
  {
    id: 'u-seller',
    name: 'Jordan Lee',
    email: 'seller@estateflow.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'seller',
    phone: '+1 (555) 000-0003',
    address: '78 Park Avenue', city: 'New York', state: 'NY', zip: '10016', country: 'US', bio: 'Licensed real estate seller with 5+ years of experience.',
    isActive: true,
    createdAt: new Date('2024-02-20').toISOString(),
  },
  {
    id: 'u-agent',
    name: 'Sophia Reynolds',
    email: 'agent@estateflow.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'agent',
    phone: '+1 (555) 000-0004',
    address: '200 Main St', city: 'Austin', state: 'TX', zip: '78701', country: 'US', bio: 'Senior Listing Agent specializing in residential properties.',
    isActive: true,
    createdAt: new Date('2024-04-10').toISOString(),
  },
];

var inquiries = [];

var favorites = [
  { userId: 'u-buyer', propertyId: 'prop-1', createdAt: new Date().toISOString() },
  { userId: 'u-buyer', propertyId: 'prop-4', createdAt: new Date().toISOString() },
  { userId: 'u-buyer', propertyId: 'prop-8', createdAt: new Date().toISOString() },
];

var adminPermissions = [];

var messages = [
  {
    id: 'msg-1',
    fromId: 'u-buyer',
    toId: 'u-seller',
    propertyId: 'prop-1',
    subject: 'Interested in Modern Family Home',
    body: 'Hi, I am very interested in the 4-bedroom home in Austin. Can we schedule a visit this weekend?',
    isRead: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'msg-2',
    fromId: 'system',
    toId: 'u-seller',
    propertyId: 'prop-3',
    subject: 'Property listed via Agent',
    body: 'Your property "Suburban Townhouse in Maple District" has been listed by agent Sophia Reynolds.',
    isRead: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

var notifications = [
  {
    id: 'notif-1',
    userId: 'u-seller',
    type: 'listing_approved',
    title: 'Listing Approved',
    body: 'Your property "Modern Family Home in Greenwood" is now live and visible to buyers.',
    isRead: false,
    propertyId: 'prop-1',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'notif-2',
    userId: 'u-seller',
    type: 'new_lead',
    title: 'New Lead',
    body: 'Alex Carter is interested in "Modern Family Home in Greenwood".',
    isRead: false,
    propertyId: 'prop-1',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'notif-3',
    userId: 'u-buyer',
    type: 'offer_update',
    title: 'Offer Status Update',
    body: 'The seller is reviewing your interest in "Coastal Villa with Ocean Access".',
    isRead: false,
    propertyId: 'prop-4',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'notif-4',
    userId: 'u-seller',
    type: 'agent_listing',
    title: 'Agent Listed Property',
    body: 'Agent Sophia Reynolds listed "Luxury Penthouse in Midtown" on your behalf.',
    isRead: true,
    propertyId: 'prop-6',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

var purchases = [
  {
    id: 'purch-1',
    buyerId: 'u-buyer',
    propertyId: 'prop-7',
    sellerId: 'u-seller',
    type: 'offer',
    status: 'completed',
    offerPrice: 610000,
    currency: 'USD',
    message: 'Loved the mountain views and the horse-friendly property.',
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    completedAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

// ══════════════════════════════════════════════════
// HELPERS & MIDDLEWARE
// ══════════════════════════════════════════════════

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function authMiddleware(req, res, next) {
  try {
    var auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    var decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    var user = users.find(function (u) { return u.id === decoded.userId; });
    if (!user || !user.isActive) return res.status(401).json({ message: 'Unauthorized' });
    req.user = {
      id: user.id, name: user.name, email: user.email, role: user.role,
      phone: user.phone, address: user.address, city: user.city,
      state: user.state, zip: user.zip, country: user.country, bio: user.bio,
      createdAt: user.createdAt,
    };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function requireRole() {
  var allowedRoles = Array.from(arguments);
  return function (req, res, next) {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    return next();
  };
}

function requireAdminPermission(permissionKey) {
  return function (req, res, next) {
    if (req.user.role === 'admin_head') return next();
    if (req.user.role === 'admin_co' || req.user.role === 'admin_co_head') {
      var perms = adminPermissions.find(function (p) { return p.userId === req.user.id; });
      if (perms && perms[permissionKey]) return next();
    }
    return res.status(403).json({ message: 'Forbidden: missing permission ' + permissionKey });
  };
}

function sanitizeUser(u) {
  return {
    id: u.id, name: u.name, email: u.email, role: u.role,
    phone: u.phone || '', address: u.address || '', city: u.city || '',
    state: u.state || '', zip: u.zip || '', country: u.country || '',
    bio: u.bio || '', isActive: u.isActive, createdAt: u.createdAt,
  };
}

function createNotification(userId, type, title, body, propertyId) {
  var notif = {
    id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    userId: userId, type: type, title: title, body: body,
    isRead: false, propertyId: propertyId || null,
    createdAt: new Date().toISOString(),
  };
  notifications.push(notif);
  return notif;
}

// ══════════════════════════════════════════════════
// ROUTES
// ══════════════════════════════════════════════════

app.get('/health', function (req, res) {
  return res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

var api = express.Router();

// ── Auth ──────────────────────────────────────────

api.post('/auth/register', function (req, res) {
  var b = req.body;
  if (!b.name || !b.email || !b.password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  if (users.find(function (u) { return u.email === b.email; })) {
    return res.status(409).json({ message: 'Email already registered' });
  }
  var allowedRoles = ['buyer', 'seller', 'agent'];
  var finalRole = allowedRoles.includes(b.role) ? b.role : 'buyer';
  var user = {
    id: 'u-' + Date.now(), name: b.name, email: b.email,
    password: bcrypt.hashSync(b.password, 10), role: finalRole,
    phone: b.phone || '', address: '', city: '', state: '', zip: '', country: '', bio: '',
    isActive: true, createdAt: new Date().toISOString(),
  };
  users.push(user);
  var token = signToken({ userId: user.id, role: user.role });
  return res.status(201).json({ token: token, user: sanitizeUser(user) });
});

api.post('/auth/login', function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  var user = users.find(function (u) { return u.email === email; });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  if (!user.isActive) return res.status(403).json({ message: 'Account is deactivated. Contact admin.' });
  var token = signToken({ userId: user.id, role: user.role });
  return res.json({ token: token, user: sanitizeUser(user) });
});

api.get('/auth/me', authMiddleware, function (req, res) {
  var perms = null;
  if (req.user.role === 'admin_co' || req.user.role === 'admin_co_head') {
    perms = adminPermissions.find(function (p) { return p.userId === req.user.id; }) || null;
  }
  return res.json({ user: req.user, permissions: perms });
});

api.put('/auth/profile', authMiddleware, function (req, res) {
  var u = users.find(function (x) { return x.id === req.user.id; });
  if (!u) return res.status(404).json({ message: 'User not found' });
  var b = req.body;
  if (b.name) u.name = b.name;
  if (b.phone !== undefined) u.phone = b.phone;
  if (b.address !== undefined) u.address = b.address;
  if (b.city !== undefined) u.city = b.city;
  if (b.state !== undefined) u.state = b.state;
  if (b.zip !== undefined) u.zip = b.zip;
  if (b.country !== undefined) u.country = b.country;
  if (b.bio !== undefined) u.bio = b.bio;
  if (b.email && b.email !== u.email) {
    if (users.find(function (x) { return x.email === b.email && x.id !== u.id; })) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    u.email = b.email;
  }
  if (b.currentPassword && b.newPassword) {
    if (!bcrypt.compareSync(b.currentPassword, u.password)) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    u.password = bcrypt.hashSync(b.newPassword, 10);
  }
  return res.json({ user: sanitizeUser(u), message: 'Profile updated successfully' });
});

// ── Properties (public) ───────────────────────────

api.get('/properties', function (req, res) {
  var result = properties.filter(function (p) { return p.isPublished && p.status === 'active'; });
  var q = req.query;
  if (q.listingType) result = result.filter(function (p) { return p.listingType === q.listingType; });
  if (q.type) result = result.filter(function (p) { return p.type === q.type; });
  if (q.city) { var c = q.city.toLowerCase(); result = result.filter(function (p) { return p.city.toLowerCase().includes(c); }); }
  if (q.country) result = result.filter(function (p) { return p.country === q.country; });
  if (q.currency) result = result.filter(function (p) { return p.currency === q.currency; });
  if (q.minPrice) result = result.filter(function (p) { return p.price >= Number(q.minPrice); });
  if (q.maxPrice) result = result.filter(function (p) { return p.price <= Number(q.maxPrice); });
  if (q.beds) result = result.filter(function (p) { return p.beds >= Number(q.beds); });
  return res.json(result);
});

api.get('/properties/featured', function (req, res) {
  return res.json(properties.filter(function (p) { return p.featured && p.isPublished; }));
});

api.get('/properties/:slug', function (req, res) {
  var p = properties.find(function (x) { return x.slug === req.params.slug || x.id === req.params.slug; });
  if (!p) return res.status(404).json({ message: 'Property not found' });
  // Attach seller info
  var seller = users.find(function (u) { return u.id === p.ownerId; });
  var agent = p.agentId ? users.find(function (u) { return u.id === p.agentId; }) : null;
  var result = Object.assign({}, p, {
    seller: seller ? { id: seller.id, name: seller.name, phone: seller.phone, email: seller.email } : null,
    agentInfo: agent ? { id: agent.id, name: agent.name, phone: agent.phone, email: agent.email } : null,
  });
  return res.json(result);
});

// ── Favorites ─────────────────────────────────────

api.get('/favorites', authMiddleware, function (req, res) {
  var userFavs = favorites.filter(function (f) { return f.userId === req.user.id; });
  var result = userFavs.map(function (f) {
    var p = properties.find(function (x) { return x.id === f.propertyId; });
    return p ? Object.assign({}, p, { favoritedAt: f.createdAt }) : null;
  }).filter(Boolean);
  return res.json(result);
});

api.post('/favorites/:propertyId', authMiddleware, function (req, res) {
  var pid = req.params.propertyId;
  if (favorites.find(function (f) { return f.userId === req.user.id && f.propertyId === pid; })) {
    return res.status(409).json({ message: 'Already in favorites' });
  }
  if (!properties.find(function (p) { return p.id === pid; })) {
    return res.status(404).json({ message: 'Property not found' });
  }
  favorites.push({ userId: req.user.id, propertyId: pid, createdAt: new Date().toISOString() });
  return res.status(201).json({ message: 'Added to favorites', propertyId: pid });
});

api.delete('/favorites/:propertyId', authMiddleware, function (req, res) {
  var idx = favorites.findIndex(function (f) { return f.userId === req.user.id && f.propertyId === req.params.propertyId; });
  if (idx === -1) return res.status(404).json({ message: 'Not in favorites' });
  favorites.splice(idx, 1);
  return res.json({ message: 'Removed from favorites' });
});

// ══════════════════════════════════════════════════
// SELLER ENDPOINTS
// ══════════════════════════════════════════════════

var sellerRouter = express.Router();
sellerRouter.use(authMiddleware);
sellerRouter.use(requireRole('seller'));

sellerRouter.get('/properties', function (req, res) {
  var myProps = properties.filter(function (p) { return p.ownerId === req.user.id; });
  return res.json(myProps);
});

sellerRouter.post('/properties', function (req, res) {
  var b = req.body;
  if (!b.title || !b.price) return res.status(400).json({ message: 'Title and price are required' });

  var listViaAgent = !!b.listViaAgent;
  var agentId = listViaAgent && b.agentId ? b.agentId : null;

  var prop = {
    id: 'prop-' + Date.now(),
    slug: (b.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    title: b.title, description: b.description || '',
    type: b.type || 'House', listingType: b.listingType || 'buy',
    price: Number(b.price), currency: b.currency || 'USD',
    beds: Number(b.beds) || 0, baths: Number(b.baths) || 0,
    areaSqFt: Number(b.areaSqFt || b.area) || 0,
    address: b.address || '', city: b.city || '', state: b.state || '',
    country: b.country || 'US',
    image: b.images && b.images[0] ? b.images[0] : '',
    images: b.images || [],
    featured: false,
    amenities: b.amenities || [],
    ownerId: req.user.id,
    listedByAgent: listViaAgent,
    agentId: agentId,
    status: 'active',
    isPublished: true,
    createdAt: new Date().toISOString(),
  };
  properties.push(prop);

  // Notification if listed via agent
  if (listViaAgent && agentId) {
    createNotification(agentId, 'agent_assignment', 'New Listing Assignment',
      'Seller ' + req.user.name + ' assigned you to list "' + prop.title + '".', prop.id);
  }

  createNotification(req.user.id, 'listing_created', 'Listing Created',
    'Your property "' + prop.title + '" has been published.', prop.id);

  return res.status(201).json({ property: prop, message: 'Property listed successfully' });
});

sellerRouter.put('/properties/:id', function (req, res) {
  var prop = properties.find(function (p) { return p.id === req.params.id && p.ownerId === req.user.id; });
  if (!prop) return res.status(404).json({ message: 'Property not found or not yours' });
  var b = req.body;
  if (b.title) prop.title = b.title;
  if (b.description !== undefined) prop.description = b.description;
  if (b.price) prop.price = Number(b.price);
  if (b.currency) prop.currency = b.currency;
  if (b.beds) prop.beds = Number(b.beds);
  if (b.baths) prop.baths = Number(b.baths);
  if (b.areaSqFt || b.area) prop.areaSqFt = Number(b.areaSqFt || b.area);
  if (b.address) prop.address = b.address;
  if (b.city) prop.city = b.city;
  if (b.state) prop.state = b.state;
  if (b.country) prop.country = b.country;
  if (b.type) prop.type = b.type;
  if (b.listingType) prop.listingType = b.listingType;
  if (typeof b.listedByAgent === 'boolean') prop.listedByAgent = b.listedByAgent;
  if (b.agentId !== undefined) prop.agentId = b.agentId;
  return res.json({ property: prop, message: 'Property updated' });
});

sellerRouter.put('/properties/:id/publish', function (req, res) {
  var prop = properties.find(function (p) { return p.id === req.params.id && p.ownerId === req.user.id; });
  if (!prop) return res.status(404).json({ message: 'Property not found or not yours' });
  prop.isPublished = !prop.isPublished;
  prop.status = prop.isPublished ? 'active' : 'draft';
  return res.json({ property: prop, message: prop.isPublished ? 'Published' : 'Unpublished' });
});

sellerRouter.delete('/properties/:id', function (req, res) {
  var idx = properties.findIndex(function (p) { return p.id === req.params.id && p.ownerId === req.user.id; });
  if (idx === -1) return res.status(404).json({ message: 'Property not found or not yours' });
  var removed = properties.splice(idx, 1)[0];
  return res.json({ message: 'Property deleted', property: removed });
});

sellerRouter.get('/leads', function (req, res) {
  // Leads = buyers who sent messages about seller's properties + inquiries + purchases
  var myPropIds = properties.filter(function (p) { return p.ownerId === req.user.id; }).map(function (p) { return p.id; });
  var leadSet = {};

  // From messages
  messages.forEach(function (m) {
    if (m.toId === req.user.id && m.fromId !== 'system' && m.propertyId) {
      var buyer = users.find(function (u) { return u.id === m.fromId; });
      if (buyer) {
        var prop = properties.find(function (p) { return p.id === m.propertyId; });
        leadSet[buyer.id] = {
          buyerId: buyer.id, name: buyer.name, email: buyer.email, phone: buyer.phone,
          property: prop ? prop.title : 'Unknown', propertyId: m.propertyId,
          source: 'Message', lastContact: m.createdAt, status: 'Interested',
        };
      }
    }
  });

  // From purchases/offers
  purchases.forEach(function (p) {
    if (p.sellerId === req.user.id) {
      var buyer = users.find(function (u) { return u.id === p.buyerId; });
      var prop = properties.find(function (x) { return x.id === p.propertyId; });
      if (buyer) {
        leadSet[buyer.id + '-' + p.propertyId] = {
          buyerId: buyer.id, name: buyer.name, email: buyer.email, phone: buyer.phone,
          property: prop ? prop.title : 'Unknown', propertyId: p.propertyId,
          source: p.type === 'buy_now' ? 'Direct Purchase' : 'Offer',
          lastContact: p.createdAt, status: p.status === 'completed' ? 'Sold' : p.status === 'pending' ? 'Pending' : 'Active',
        };
      }
    }
  });

  return res.json(Object.values(leadSet));
});

sellerRouter.get('/sold', function (req, res) {
  var myPropIds = properties.filter(function (p) { return p.ownerId === req.user.id; }).map(function (p) { return p.id; });
  var soldPurchases = purchases.filter(function (p) {
    return p.sellerId === req.user.id && p.status === 'completed';
  }).map(function (p) {
    var prop = properties.find(function (x) { return x.id === p.propertyId; });
    var buyer = users.find(function (u) { return u.id === p.buyerId; });
    return {
      purchaseId: p.id, property: prop ? prop.title : 'Unknown',
      buyer: buyer ? buyer.name : 'Unknown',
      price: p.offerPrice || (prop ? prop.price : 0),
      currency: p.currency || 'USD',
      completedAt: p.completedAt || p.createdAt,
    };
  });
  return res.json(soldPurchases);
});

api.use('/seller', sellerRouter);

// ══════════════════════════════════════════════════
// PURCHASE / BUY ENDPOINTS
// ══════════════════════════════════════════════════

api.post('/purchases', authMiddleware, function (req, res) {
  var b = req.body;
  var prop = properties.find(function (p) { return p.id === b.propertyId; });
  if (!prop) return res.status(404).json({ message: 'Property not found' });
  if (prop.status === 'sold') return res.status(400).json({ message: 'Property is already sold' });
  if (prop.ownerId === req.user.id) return res.status(400).json({ message: 'You cannot buy your own property' });

  var purchaseType = b.type || 'offer'; // 'buy_now' or 'offer'
  var offerPrice = purchaseType === 'buy_now' ? prop.price : (Number(b.offerPrice) || prop.price);

  var purchase = {
    id: 'purch-' + Date.now(),
    buyerId: req.user.id,
    propertyId: prop.id,
    sellerId: prop.ownerId,
    type: purchaseType,
    status: purchaseType === 'buy_now' ? 'completed' : 'pending',
    offerPrice: offerPrice,
    currency: prop.currency,
    message: b.message || '',
    createdAt: new Date().toISOString(),
    completedAt: purchaseType === 'buy_now' ? new Date().toISOString() : null,
  };
  purchases.push(purchase);

  if (purchaseType === 'buy_now') {
    prop.status = 'sold';
    prop.isPublished = false;
    createNotification(prop.ownerId, 'property_sold', 'Property Sold!',
      req.user.name + ' purchased "' + prop.title + '" for ' + formatPrice(offerPrice, prop.currency) + '.', prop.id);
    createNotification(req.user.id, 'purchase_complete', 'Purchase Complete',
      'You have successfully purchased "' + prop.title + '".', prop.id);
  } else {
    createNotification(prop.ownerId, 'new_offer', 'New Offer Received',
      req.user.name + ' made an offer of ' + formatPrice(offerPrice, prop.currency) + ' on "' + prop.title + '".', prop.id);
    createNotification(req.user.id, 'offer_sent', 'Offer Sent',
      'Your offer of ' + formatPrice(offerPrice, prop.currency) + ' on "' + prop.title + '" has been sent to the seller.', prop.id);
  }

  return res.status(201).json({ purchase: purchase, message: purchaseType === 'buy_now' ? 'Purchase completed!' : 'Offer sent to seller' });
});

api.get('/purchases', authMiddleware, function (req, res) {
  var myPurchases = purchases.filter(function (p) { return p.buyerId === req.user.id; }).map(function (p) {
    var prop = properties.find(function (x) { return x.id === p.propertyId; });
    return Object.assign({}, p, {
      propertyTitle: prop ? prop.title : 'Unknown',
      propertyCity: prop ? prop.city : '',
      propertyImage: prop ? (prop.image || '') : '',
    });
  });
  return res.json(myPurchases);
});

// Seller respond to offer
api.put('/purchases/:id/respond', authMiddleware, function (req, res) {
  var purchase = purchases.find(function (p) { return p.id === req.params.id; });
  if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
  if (purchase.sellerId !== req.user.id) return res.status(403).json({ message: 'Not your listing' });
  if (purchase.status !== 'pending') return res.status(400).json({ message: 'Offer already ' + purchase.status });

  var action = req.body.action; // 'accept' or 'reject'
  if (action === 'accept') {
    purchase.status = 'completed';
    purchase.completedAt = new Date().toISOString();
    var prop = properties.find(function (p) { return p.id === purchase.propertyId; });
    if (prop) { prop.status = 'sold'; prop.isPublished = false; }
    createNotification(purchase.buyerId, 'offer_accepted', 'Offer Accepted!',
      'Your offer on "' + (prop ? prop.title : 'property') + '" has been accepted!', purchase.propertyId);
  } else {
    purchase.status = 'rejected';
    var prop = properties.find(function (p) { return p.id === purchase.propertyId; });
    createNotification(purchase.buyerId, 'offer_rejected', 'Offer Declined',
      'Your offer on "' + (prop ? prop.title : 'property') + '" was not accepted by the seller.', purchase.propertyId);
  }

  return res.json({ purchase: purchase, message: 'Offer ' + action + 'ed' });
});

// ══════════════════════════════════════════════════
// MESSAGES
// ══════════════════════════════════════════════════

api.get('/messages', authMiddleware, function (req, res) {
  var userMsgs = messages.filter(function (m) {
    return m.toId === req.user.id || m.fromId === req.user.id;
  }).map(function (m) {
    var from = m.fromId === 'system' ? { name: 'System', id: 'system' } : users.find(function (u) { return u.id === m.fromId; });
    var to = users.find(function (u) { return u.id === m.toId; });
    var prop = m.propertyId ? properties.find(function (p) { return p.id === m.propertyId; }) : null;
    return Object.assign({}, m, {
      fromName: from ? from.name : 'Unknown',
      toName: to ? to.name : 'Unknown',
      propertyTitle: prop ? prop.title : null,
      direction: m.fromId === req.user.id ? 'sent' : 'received',
    });
  }).sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
  return res.json(userMsgs);
});

api.post('/messages', authMiddleware, function (req, res) {
  var b = req.body;
  if (!b.toId || !b.body) return res.status(400).json({ message: 'Recipient and body are required' });
  var msg = {
    id: 'msg-' + Date.now(),
    fromId: req.user.id, toId: b.toId,
    propertyId: b.propertyId || null,
    subject: b.subject || '', body: b.body,
    isRead: false, createdAt: new Date().toISOString(),
  };
  messages.push(msg);

  // Create notification for recipient
  createNotification(b.toId, 'new_message', 'New Message from ' + req.user.name,
    b.subject || b.body.substring(0, 80), b.propertyId);

  return res.status(201).json({ message: msg });
});

api.put('/messages/:id/read', authMiddleware, function (req, res) {
  var msg = messages.find(function (m) { return m.id === req.params.id && m.toId === req.user.id; });
  if (!msg) return res.status(404).json({ message: 'Message not found' });
  msg.isRead = true;
  return res.json({ message: 'Marked as read' });
});

// ══════════════════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════════════════

api.get('/notifications', authMiddleware, function (req, res) {
  var userNotifs = notifications
    .filter(function (n) { return n.userId === req.user.id; })
    .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
  return res.json(userNotifs);
});

api.put('/notifications/:id/read', authMiddleware, function (req, res) {
  var notif = notifications.find(function (n) { return n.id === req.params.id && n.userId === req.user.id; });
  if (!notif) return res.status(404).json({ message: 'Notification not found' });
  notif.isRead = true;
  return res.json({ message: 'Marked as read' });
});

api.put('/notifications/read-all', authMiddleware, function (req, res) {
  notifications.forEach(function (n) { if (n.userId === req.user.id) n.isRead = true; });
  return res.json({ message: 'All marked as read' });
});

// ── Agents ────────────────────────────────────────

api.get('/agents', function (req, res) { return res.json(agents); });
api.get('/agents/:id', function (req, res) {
  var a = agents.find(function (x) { return x.id === req.params.id; });
  if (!a) return res.status(404).json({ message: 'Agent not found' });
  return res.json(a);
});

// ── Stats ─────────────────────────────────────────

api.get('/stats', function (req, res) { return res.json(stats); });

// ── Inquiries ─────────────────────────────────────

api.post('/inquiries', function (req, res) {
  var inquiry = {
    id: 'inq-' + Date.now(), propertyId: req.body.propertyId || '',
    fullName: req.body.fullName || '', email: req.body.email || '',
    phone: req.body.phone || '', message: req.body.message || '',
    createdAt: new Date().toISOString(),
  };
  inquiries.push(inquiry);

  // If property exists, notify the seller
  if (inquiry.propertyId) {
    var prop = properties.find(function (p) { return p.id === inquiry.propertyId; });
    if (prop && prop.ownerId) {
      createNotification(prop.ownerId, 'new_inquiry', 'New Inquiry',
        inquiry.fullName + ' inquired about "' + prop.title + '".', prop.id);
    }
  }

  return res.status(201).json({ success: true, message: 'Inquiry submitted successfully.', data: inquiry });
});

// ── Contact ───────────────────────────────────────

api.post('/contact', function (req, res) {
  return res.json({ success: true, message: 'Thanks! Your message has been sent. Our team will reach out soon.' });
});

api.get('/contact/offices', function (req, res) {
  return res.json([
    { city: 'Austin', address: '124 Greenwood Ave, Austin, TX 78704', phone: '+1 (555) 120-4488', email: 'austin@estateflow.com' },
    { city: 'New York', address: '88 Riverfront St, New York, NY 10019', phone: '+1 (555) 889-3021', email: 'nyc@estateflow.com' },
    { city: 'Mumbai', address: '14th Floor, Bandra Kurla Complex, Mumbai 400051', phone: '+91 22 4455 6677', email: 'mumbai@estateflow.com' },
  ]);
});

// ══════════════════════════════════════════════════
// ADMIN ENDPOINTS (backend-only — not exposed in frontend nav)
// ══════════════════════════════════════════════════

var adminRouter = express.Router();
adminRouter.use(authMiddleware);
adminRouter.use(requireRole('admin_head', 'admin_co', 'admin_co_head'));

adminRouter.get('/users', requireAdminPermission('canManageUsers'), function (req, res) {
  return res.json(users.map(sanitizeUser));
});

adminRouter.post('/users', requireAdminPermission('canManageUsers'), function (req, res) {
  var b = req.body;
  if (!b.name || !b.email || !b.password) return res.status(400).json({ message: 'Name, email, and password are required' });
  if (users.find(function (u) { return u.email === b.email; })) return res.status(409).json({ message: 'Email already registered' });
  var u = {
    id: 'u-' + Date.now(), name: b.name, email: b.email,
    password: bcrypt.hashSync(b.password, 10), role: b.role || 'buyer',
    phone: b.phone || '', address: '', city: '', state: '', zip: '', country: '', bio: '',
    isActive: true, createdAt: new Date().toISOString(),
  };
  users.push(u);
  return res.status(201).json({ user: sanitizeUser(u), message: 'User created' });
});

adminRouter.put('/users/:id', requireAdminPermission('canManageUsers'), function (req, res) {
  var u = users.find(function (x) { return x.id === req.params.id; });
  if (!u) return res.status(404).json({ message: 'User not found' });
  if (req.body.name) u.name = req.body.name;
  if (req.body.role) u.role = req.body.role;
  if (req.body.email) u.email = req.body.email;
  if (typeof req.body.isActive === 'boolean') u.isActive = req.body.isActive;
  return res.json({ user: sanitizeUser(u), message: 'User updated' });
});

adminRouter.delete('/users/:id', requireAdminPermission('canManageUsers'), function (req, res) {
  var u = users.find(function (x) { return x.id === req.params.id; });
  if (!u) return res.status(404).json({ message: 'User not found' });
  u.isActive = false;
  return res.json({ message: 'User deactivated' });
});

adminRouter.get('/co-admins', function (req, res) {
  if (req.user.role !== 'admin_head') return res.status(403).json({ message: 'Only head admin' });
  var cas = users.filter(function (u) { return u.role === 'admin_co' || u.role === 'admin_co_head'; }).map(function (u) {
    return Object.assign({}, sanitizeUser(u), { permissions: adminPermissions.find(function (p) { return p.userId === u.id; }) || null });
  });
  return res.json(cas);
});

adminRouter.post('/co-admins', function (req, res) {
  if (req.user.role !== 'admin_head') return res.status(403).json({ message: 'Only head admin' });
  var b = req.body;
  var userId = b.userId;
  if (!userId && b.name && b.email && b.password) {
    if (users.find(function (u) { return u.email === b.email; })) return res.status(409).json({ message: 'Email exists' });
    var nu = { id: 'u-' + Date.now(), name: b.name, email: b.email, password: bcrypt.hashSync(b.password, 10),
      role: 'admin_co', phone: b.phone || '', address: '', city: '', state: '', zip: '', country: '', bio: '',
      isActive: true, createdAt: new Date().toISOString() };
    users.push(nu);
    userId = nu.id;
  }
  var u = users.find(function (x) { return x.id === userId; });
  if (!u) return res.status(404).json({ message: 'User not found' });
  u.role = 'admin_co';
  var existIdx = adminPermissions.findIndex(function (p) { return p.userId === userId; });
  if (existIdx !== -1) adminPermissions.splice(existIdx, 1);
  var perms = b.permissions || {};
  var np = {
    id: 'perm-' + Date.now(), userId: userId,
    canApproveListings: !!perms.canApproveListings, canManageUsers: !!perms.canManageUsers,
    canManageBlogs: !!perms.canManageBlogs, canListProperties: !!perms.canListProperties,
    canViewAnalytics: !!perms.canViewAnalytics, canManageInquiries: !!perms.canManageInquiries,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
  adminPermissions.push(np);
  return res.status(201).json({ user: sanitizeUser(u), permissions: np, message: 'Co-admin created' });
});

adminRouter.put('/co-admins/:id/permissions', function (req, res) {
  if (req.user.role !== 'admin_head') return res.status(403).json({ message: 'Only head admin' });
  var p = adminPermissions.find(function (x) { return x.userId === req.params.id; });
  if (!p) return res.status(404).json({ message: 'Not found' });
  var b = req.body;
  ['canApproveListings','canManageUsers','canManageBlogs','canListProperties','canViewAnalytics','canManageInquiries'].forEach(function (k) {
    if (typeof b[k] === 'boolean') p[k] = b[k];
  });
  p.updatedAt = new Date().toISOString();
  return res.json({ permissions: p, message: 'Updated' });
});

adminRouter.delete('/co-admins/:id', function (req, res) {
  if (req.user.role !== 'admin_head') return res.status(403).json({ message: 'Only head admin' });
  var u = users.find(function (x) { return x.id === req.params.id; });
  if (!u) return res.status(404).json({ message: 'Not found' });
  u.role = 'buyer';
  var idx = adminPermissions.findIndex(function (p) { return p.userId === req.params.id; });
  if (idx !== -1) adminPermissions.splice(idx, 1);
  return res.json({ message: 'Co-admin revoked' });
});

adminRouter.post('/properties', requireAdminPermission('canListProperties'), function (req, res) {
  var b = req.body;
  var p = {
    id: 'prop-' + Date.now(), slug: (b.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: b.title || '', description: b.description || '', type: b.type || 'House',
    listingType: b.listingType || 'buy', price: Number(b.price) || 0, currency: b.currency || 'USD',
    beds: Number(b.beds) || 0, baths: Number(b.baths) || 0, areaSqFt: Number(b.area) || 0,
    address: b.address || '', city: b.city || '', state: b.state || '', country: b.country || 'US',
    image: '', images: b.images || [], featured: !!b.featured, amenities: [],
    ownerId: req.user.id, listedByAgent: false, agentId: null,
    status: 'active', isPublished: true, createdAt: new Date().toISOString(),
  };
  properties.push(p);
  return res.status(201).json({ property: p, message: 'Listed' });
});

adminRouter.delete('/properties/:id', requireAdminPermission('canApproveListings'), function (req, res) {
  var idx = properties.findIndex(function (p) { return p.id === req.params.id; });
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  properties.splice(idx, 1);
  return res.json({ message: 'Deleted' });
});

api.use('/admin', adminRouter);

// ── Dashboard endpoints ───────────────────────────

api.get('/dashboard/admin', authMiddleware, function (req, res) {
  return res.json({
    metrics: [
      { label: 'Total Listings', value: String(properties.length), delta: '+6.2% MoM' },
      { label: 'Active Users', value: String(users.filter(function (u) { return u.isActive; }).length) + '/' + String(users.length), delta: '+3.9% MoM' },
      { label: 'Open Inquiries', value: String(inquiries.length), delta: '-2.1% MoM' },
      { label: 'Monthly Revenue', value: '$184,900', delta: '+8.5% MoM' },
    ],
    complianceAlerts: [
      { title: 'Listing moderation', detail: properties.filter(function (p) { return p.status === 'pending'; }).length + ' listings pending.', severity: 'medium' },
      { title: 'Agent verification', detail: '11 new agent profiles require KYC.', severity: 'high' },
    ],
    systemHealth: [
      { name: 'API Uptime', status: '99.97%', note: 'Last 30 days' },
      { name: 'Avg. Response', status: '286ms', note: 'Core endpoints' },
    ],
  });
});

api.get('/dashboard/buyer', authMiddleware, function (req, res) {
  var favCount = favorites.filter(function (f) { return f.userId === req.user.id; }).length;
  var myPurchases = purchases.filter(function (p) { return p.buyerId === req.user.id; });
  var unreadMsgs = messages.filter(function (m) { return m.toId === req.user.id && !m.isRead; }).length;
  var unreadNotifs = notifications.filter(function (n) { return n.userId === req.user.id && !n.isRead; }).length;
  return res.json({
    userName: req.user.name.split(' ')[0],
    favoriteCount: favCount,
    purchaseCount: myPurchases.length,
    unreadMessages: unreadMsgs,
    unreadNotifications: unreadNotifs,
    recentPurchases: myPurchases.slice(0, 5),
  });
});

api.get('/dashboard/seller', authMiddleware, function (req, res) {
  var myProps = properties.filter(function (p) { return p.ownerId === req.user.id; });
  var activeCount = myProps.filter(function (p) { return p.status === 'active'; }).length;
  var soldCount = purchases.filter(function (p) { return p.sellerId === req.user.id && p.status === 'completed'; }).length;
  var draftCount = myProps.filter(function (p) { return p.status === 'draft'; }).length;
  var pendingOffers = purchases.filter(function (p) { return p.sellerId === req.user.id && p.status === 'pending'; }).length;
  var unreadMsgs = messages.filter(function (m) { return m.toId === req.user.id && !m.isRead; }).length;
  var unreadNotifs = notifications.filter(function (n) { return n.userId === req.user.id && !n.isRead; }).length;

  return res.json({
    userName: req.user.name.split(' ')[0],
    listingSummary: [
      { label: 'Active Listings', value: activeCount, hint: 'Currently visible to buyers' },
      { label: 'Pending Offers', value: pendingOffers, hint: 'Offers awaiting your response' },
      { label: 'Sold', value: soldCount, hint: 'Completed sales' },
      { label: 'Drafts', value: draftCount, hint: 'Unpublished listings' },
    ],
    totalListings: myProps.length,
    unreadMessages: unreadMsgs,
    unreadNotifications: unreadNotifs,
  });
});

api.get('/dashboard/agent', authMiddleware, function (req, res) {
  var agentProps = properties.filter(function (p) { return p.agentId === req.user.id; });
  var unreadMsgs = messages.filter(function (m) { return m.toId === req.user.id && !m.isRead; }).length;
  return res.json({
    leadStats: [
      { label: 'Assigned Listings', value: agentProps.length, tone: 'bg-primary-fixed text-primary' },
      { label: 'Active', value: agentProps.filter(function (p) { return p.status === 'active'; }).length, tone: 'bg-emerald-100 text-emerald-700' },
      { label: 'Sold', value: agentProps.filter(function (p) { return p.status === 'sold'; }).length, tone: 'bg-amber-100 text-amber-700' },
      { label: 'Unread Messages', value: unreadMsgs, tone: 'bg-violet-100 text-violet-700' },
    ],
    assignedProperties: agentProps.map(function (p) {
      var seller = users.find(function (u) { return u.id === p.ownerId; });
      return { id: p.id, title: p.title, city: p.city, price: p.price, currency: p.currency, status: p.status, sellerName: seller ? seller.name : 'Unknown' };
    }),
    unreadMessages: unreadMsgs,
  });
});

// ── Mount & fallback ──────────────────────────────

app.use('/api/v1', api);

app.use(function (req, res) { return res.status(404).json({ message: 'Route not found' }); });
app.use(function (err, req, res, next) {
  console.error(err);
  return res.status(err.statusCode || 500).json({ message: err.message || 'Internal server error' });
});

module.exports = app;
