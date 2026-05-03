# 📚 BookHaven Backend

## ⚡ Setup Kaise Karein

### Step 1 — Dependencies install karo
```bash
cd bookhaven-backend
npm install
```

### Step 2 — .env file check karo
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/bookhaven
JWT_SECRET=bookhaven_secret_key_change_this
```
> MongoDB Compass ya Atlas use kar rahe ho toh MONGO_URI accordingly badlo

### Step 3 — Books ka data MongoDB mein daalo
```bash
npm run seed
```

### Step 4 — Server start karo
```bash
# Development mode (auto restart)
npm run dev

# Production mode
npm start
```

Server chalega: http://localhost:5000

---

## 🔗 API Endpoints

### Auth
| Method | URL | Kaam |
|--------|-----|------|
| POST | /api/auth/signup | Naya account banao |
| POST | /api/auth/login | Login karo |
| GET | /api/auth/me | Apni profile dekho (token chahiye) |

**Signup body:**
```json
{
  "name": "Rahul",
  "email": "rahul@email.com",
  "password": "123456"
}
```

**Login body:**
```json
{
  "email": "rahul@email.com",
  "password": "123456"
}
```

---

### Books
| Method | URL | Kaam |
|--------|-----|------|
| GET | /api/books | Saari books |
| GET | /api/books?category=free | Sirf free books |
| GET | /api/books?category=paid | Sirf paid books |
| GET | /api/books?genre=Fiction | Genre se filter |
| GET | /api/books?search=gatsby | Search karo |
| GET | /api/books/genres | Saare genres |
| GET | /api/books/:id | Ek book ki detail |

---

### Orders (Login zaroori)
| Method | URL | Kaam |
|--------|-----|------|
| POST | /api/orders | Book purchase karo |
| GET | /api/orders/mine | Meri purchases dekho |

**Purchase body:**
```json
{
  "bookId": "book_id_yahan"
}
```

**Token kaise bhejein (Header mein):**
```
Authorization: Bearer <tumhara_token>
```

---

## 🔄 Frontend Mein Kya Badlega

### 1. Books fetch karna (Course.jsx / Freebooks.jsx)
```js
// Pehle
fetch("/list.json")

// Baad mein
fetch("http://localhost:5000/api/books?category=free")
```

### 2. Login karna (Login.jsx)
```js
const res = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
});
const data = await res.json();
localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));
```

### 3. Book purchase karna (Cards.jsx)
```js
const token = localStorage.getItem("token");
const res = await fetch("http://localhost:5000/api/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({ bookId: item._id })
});
```
