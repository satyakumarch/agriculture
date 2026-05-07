# AgriAssist Backend API

## Setup & Run

### 1. Install dependencies
```bash
cd server
npm install
```

### 2. Make sure MongoDB is running
```bash
# Windows
net start MongoDB

# Or start MongoDB manually
mongod --dbpath C:\data\db
```

### 3. Start the server
```bash
npm run dev    # development (auto-restart)
npm start      # production
```

Server runs at: http://localhost:5000

## MongoDB Collections

| Collection | Description |
|------------|-------------|
| `users` | Farmer accounts (name, email, password hashed) |
| `expenses` | Farm expenses and income records |
| `listings` | Marketplace listings (seeds, tools, equipment) |
| `dronebookings` | Drone service bookings |
| `communitymessages` | Farmer community chat messages |
| `contactreports` | Contact form / issue reports |

## API Endpoints

### Auth
- `POST /api/auth/register` — Register new farmer
- `POST /api/auth/login` — Login, returns JWT token

### Expenses
- `GET /api/expenses` — Get user's expenses (requires token)
- `POST /api/expenses` — Add expense/income (requires token)
- `DELETE /api/expenses/:id` — Delete entry (requires token)

### Marketplace Listings
- `GET /api/listings` — Get all listings (public)
- `POST /api/listings` — Create listing (requires token)
- `DELETE /api/listings/:id` — Delete listing (requires token)

### Drone Bookings
- `GET /api/dronebookings` — Get user's bookings (requires token)
- `POST /api/dronebookings` — Create booking (requires token)
- `PATCH /api/dronebookings/:id` — Update status (requires token)

### Community
- `GET /api/community` — Get messages (public)
- `POST /api/community` — Post message (requires token)
- `PATCH /api/community/:id/like` — Like message (public)

### Contact
- `POST /api/contact` — Submit issue report (public)

## Authentication
Send JWT token in header:
```
Authorization: Bearer <token>
```
