# 🏝️ RGFL Survivor Fantasy League - Setup Guide

## Quick Start

### For Unix/Linux/macOS:
```bash
./setup.sh
```

### For Windows:
```cmd
setup.bat
```

## Manual Setup

### Prerequisites
- Node.js 18+ 
- npm
- Git
- PostgreSQL database access

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Setup Database
```bash
# Set your database URL
export DATABASE_URL="postgresql://rgfl_survivor_db_user:cPam8QBgB6uK7lUBZHDUgo7uAhIsMKSV@dpg-d3fohbc9c44c73dagrm0-a/rgfl_survivor_db"

# Push database schema
npx prisma db push --force-reset
```

### 4. Seed Database
```bash
npm run db:seed
```

### 5. Build Application
```bash
npm run build
```

### 6. Start Development Server
```bash
npm run dev
```

## Script Commands

### Unix/Linux/macOS (`setup.sh`):
- `./setup.sh` - Full setup (install, build, seed database)
- `./setup.sh dev` - Start development server
- `./setup.sh deploy` - Deploy to Render
- `./setup.sh build` - Build the application
- `./setup.sh db` - Setup and seed database only
- `./setup.sh help` - Show help message

## Environment Variables

The following environment variables are hardcoded in the application:

- **DATABASE_URL**: `postgresql://rgfl_survivor_db_user:cPam8QBgB6uK7lUBZHDUgo7uAhIsMKSV@dpg-d3fohbc9c44c73dagrm0-a/rgfl_survivor_db`
- **JWT_SECRET**: `ab0a7959c06c1449f2ec58732091d033032adea96fd83a60029444a700c07b4817174d42af32ccd731f2e703b274b63f6d7eb3f300f01a816abf072f8fcd827b`
- **SESSION_SECRET**: Same as JWT_SECRET
- **CORS_ORIGIN**: `https://rgfl-survivor.onrender.com`

## Database Schema

The application includes the following models:
- **User**: User accounts and authentication
- **League**: Fantasy league management
- **Castaway**: Survivor contestants
- **Week**: Weekly episodes
- **Pick**: User picks for each week
- **WeeklyResult**: Results for each week
- **Score**: User scoring system

## Seed Data

The database is automatically seeded with:
- **18 Survivor 49 Castaways** (Kele, Hina, Uli tribes)
- **Default League**: "RGFL Survivor Fantasy League 2024"
- **13 Weeks**: Episodes 1-13
- **Admin User**: admin@rgfl.com / admin123
- **Sample User**: user@rgfl.com / user123

## Deployment

### Render Deployment
1. Push code to GitHub: `git push origin main`
2. Render automatically deploys from GitHub
3. Visit: https://rgfl-survivor.onrender.com

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
NODE_ENV=production npm start
```

## Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check DATABASE_URL is correct
   - Ensure database is accessible
   - Run `npx prisma db push --force-reset`

2. **Build Errors**
   - Run `npm install` to ensure all dependencies
   - Check TypeScript errors: `npx tsc --noEmit`

3. **Authentication Issues**
   - Verify JWT_SECRET is set correctly
   - Check session configuration

4. **Static Files Not Loading**
   - Ensure build completed successfully
   - Check static file serving configuration

## Development

### Available Scripts:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:client` - Build client only
- `npm run build:server` - Build server only
- `npm run db:seed` - Seed database
- `npm start` - Start production server

### Project Structure:
```
RGFL/
├── client/          # React frontend
├── server/          # Express backend
├── prisma/          # Database schema
├── dist/            # Built files
├── setup.sh         # Unix setup script
├── setup.bat        # Windows setup script
└── README_SETUP.md  # This file
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the deployment checklist: `RENDER_DEPLOYMENT_CHECKLIST.md`
3. Check server logs for specific errors

---

**🎉 Your RGFL Survivor Fantasy League is ready to go!**
