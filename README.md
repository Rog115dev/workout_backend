# Workout Backend Server

A TypeScript Express.js backend server for the Workout application.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MySQL Server
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

3. **Database Setup**
   ```bash
   npm run db:init
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run start` | Start production server |
| `npm run build` | Build TypeScript to JavaScript |
| `npm run build:watch` | Build with file watching |
| `npm run db:init` | Initialize database and tables |
| `npm run db:reset` | Reset database (drop and recreate) |
| `npm run clean` | Clean build directory |
| `npm run lint` | Run linter (placeholder) |
| `npm test` | Run tests (placeholder) |

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=workout
DB_PORT=3306

# Security
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

### Database Schema

The server uses MySQL with the following table:

**user_settings**
- `id` - Primary key (AUTO_INCREMENT)
- `user_id` - User identifier (UNIQUE)
- `table_colors` - JSON object for table colors
- `button_colors` - JSON object for button colors
- `favorites` - JSON array of favorites
- `languages` - JSON array of languages
- `my_best` - Text field for best achievement
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## 🌐 API Endpoints

### Health Check
- `GET /health` - Server health status

### API Info
- `GET /api` - API information and available endpoints

## 🛠️ Development

### Project Structure

```
src/
├── index.ts              # Main server file
├── config/               # Configuration files
│   └── database.ts       # Database configuration
├── scripts/              # Database scripts
│   ├── init-database.ts  # Database initialization
│   └── reset-database.ts # Database reset
├── types/                # TypeScript type definitions
│   └── index.ts
└── validation/           # Validation schemas
    └── schemas.ts
```

### Adding New Features

1. **API Routes**: Add new routes in `src/index.ts`
2. **Database Operations**: Extend `src/config/database.ts`
3. **Validation**: Add schemas in `src/validation/schemas.ts`
4. **Types**: Define types in `src/types/index.ts`

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

## 📊 Monitoring

The server includes:
- **Health Check**: `/health` endpoint for monitoring
- **Request Logging**: Morgan middleware for HTTP logging
- **Security Headers**: Helmet middleware for security
- **CORS Support**: Configurable CORS for frontend integration
- **Compression**: Response compression for better performance

## 🔒 Security

- Helmet.js for security headers
- CORS configuration
- Input validation with Zod
- SQL injection prevention with parameterized queries
- Environment-based configuration

## 📝 License

ISC