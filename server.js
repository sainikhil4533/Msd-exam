const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// ==========================
// 🧠 In-Memory Databases (Predefined Data)
// ==========================
let items = [
  { id: 1, name: "Laptop", price: 1200, createdAt: new Date() },
  { id: 2, name: "Smartphone", price: 800, createdAt: new Date() },
  { id: 3, name: "Headphones", price: 150, createdAt: new Date() },
  { id: 4, name: "Keyboard", price: 50, createdAt: new Date() },
  { id: 5, name: "Mouse", price: 30, createdAt: new Date() }
];

let users = [
  { id: 1, name: "Alice", email: "alice@example.com", createdAt: new Date() },
  { id: 2, name: "Bob", email: "bob@example.com", createdAt: new Date() },
  { id: 3, name: "Charlie", email: "charlie@example.com", createdAt: new Date() },
  { id: 4, name: "David", email: "david@example.com", createdAt: new Date() },
  { id: 5, name: "Eve", email: "eve@example.com", createdAt: new Date() }
];

// ==========================
// 🏠 Root Route
// ==========================
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the CRUD Demo API 🚀</h1>
    <p>Available routes:</p>
    <ul>
      <li>GET /api/items</li>
      <li>POST /api/items</li>
      <li>PUT /api/items</li>
      <li>DELETE /api/items</li>
      <li>GET /api/users</li>
      <li>POST /api/users</li>
      <li>PUT /api/users</li>
      <li>DELETE /api/users</li>
      <li>GET /health</li>
    </ul>
  `);
});

// ==========================
// ❤️ Health Check Route
// ==========================
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    message: 'Server is healthy!',
    timestamp: new Date()
  });
});

// ==========================
// 📦 CRUD for ITEMS
// ==========================
app.all('/api/items', (req, res) => {
  switch (req.method) {
    case 'GET':
      return res.json({ count: items.length, items });

    case 'POST': {
      const { name, price } = req.body;
      if (!name || price === undefined)
        return res.status(400).json({ error: 'Name and price are required' });

      const newItem = {
        id: items.length ? items[items.length - 1].id + 1 : 1,
        name,
        price,
        createdAt: new Date()
      };
      items.push(newItem);
      return res.status(201).json({ message: 'Item created', item: newItem });
    }

    case 'PUT': {
      const { id, name, price } = req.body;
      if (!id) return res.status(400).json({ error: 'ID is required' });

      const item = items.find(i => i.id === id);
      if (!item) return res.status(404).json({ error: 'Item not found' });

      if (name) item.name = name;
      if (price !== undefined) item.price = price;
      item.updatedAt = new Date();

      return res.json({ message: 'Item updated', item });
    }

    case 'DELETE': {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'ID is required' });

      const index = items.findIndex(i => i.id === id);
      if (index === -1) return res.status(404).json({ error: 'Item not found' });

      const deleted = items.splice(index, 1)[0];
      return res.json({ message: 'Item deleted', deleted });
    }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
});

// ==========================
// 👤 CRUD for USERS
// ==========================
app.all('/api/users', (req, res) => {
  switch (req.method) {
    case 'GET':
      return res.json({ count: users.length, users });

    case 'POST': {
      const { name, email } = req.body;
      if (!name || !email)
        return res.status(400).json({ error: 'Name and email are required' });

      const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        name,
        email,
        createdAt: new Date()
      };
      users.push(newUser);
      return res.status(201).json({ message: 'User created', user: newUser });
    }

    case 'PUT': {
      const { id, name, email } = req.body;
      if (!id) return res.status(400).json({ error: 'ID is required' });

      const user = users.find(u => u.id === id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      if (name) user.name = name;
      if (email) user.email = email;
      user.updatedAt = new Date();

      return res.json({ message: 'User updated', user });
    }

    case 'DELETE': {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'ID is required' });

      const index = users.findIndex(u => u.id === id);
      if (index === -1) return res.status(404).json({ error: 'User not found' });

      const deleted = users.splice(index, 1)[0];
      return res.json({ message: 'User deleted', deleted });
    }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
});

// ==========================
// ⚠️ 404 Handler
// ==========================
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ==========================
// 🚀 Start Server
// ==========================
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
