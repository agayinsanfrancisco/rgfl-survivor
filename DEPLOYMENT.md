# RGFL Survivor - Render Deployment Guide

## Prerequisites
- GitHub repository with your code
- Render account (free tier available)

## Deployment Steps

### 1. Database Setup
1. Go to your Render dashboard
2. Create a new PostgreSQL database:
   - Name: `rgfl-db`
   - Plan: Free
   - Database Name: `rgfl_db`
   - User: `rgfl_user`

### 2. Web Service Setup
1. Connect your GitHub repository to Render
2. Create a new Web Service:
   - **Name**: `rgfl-survivor`
   - **Environment**: Node
   - **Plan**: Free
   - **Build Command**: `npm install && npm run build && npx prisma migrate deploy`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/`

### 3. Environment Variables
Set these in your Render service settings:
- `NODE_ENV`: `production`
- `DATABASE_URL`: (Auto-generated from your database)
- `SESSION_SECRET`: (Generate a secure random string)
- `PORT`: `5050`

### 4. Database Migration
The build command includes `npx prisma migrate deploy` which will automatically run database migrations.

### 5. Custom Domain (Optional)
- Go to your service settings
- Add a custom domain if desired
- Update CORS settings

## Alternative Deployment Methods

### Manual Deployment
1. Run `npm run build` locally
2. Upload the `dist` folder to your server
3. Set environment variables
4. Run `npm start`

## Troubleshooting

### Common Issues
1. **Build fails**: Check that all dependencies are in `package.json`
2. **Database connection**: Verify `DATABASE_URL` is correctly set
3. **Static files not serving**: Ensure build process completed successfully
4. **CORS issues**: Check that `FRONTEND_URL` is set correctly

### Logs
Check Render service logs for detailed error information.

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment mode | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Session encryption key | Yes |
| `PORT` | Server port | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | No |

## Security Notes
- Never commit `.env` files
- Use strong, unique `SESSION_SECRET`
- Enable HTTPS in production
- Regularly update dependencies
