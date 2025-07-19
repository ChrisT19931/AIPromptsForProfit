# Deployment Guide - AI Prompts for Profit

This guide covers deploying your AI Prompts website to production.

## Pre-Deployment Checklist

### 1. Content Review
- [ ] Update all sample prompts in `data/prompts.ts`
- [ ] Customize FAQ in `data/faq.ts`
- [ ] Review all page content for accuracy
- [ ] Test all links and buttons locally
- [ ] Verify responsive design on mobile/desktop

### 2. Stripe Configuration
- [ ] Create Stripe account
- [ ] Get live API keys (pk_live_ and sk_live_)
- [ ] Set up webhook endpoint
- [ ] Test payment flow with test cards
- [ ] Configure tax settings if required

### 3. Legal & Business
- [ ] Create privacy policy page
- [ ] Create terms of service page
- [ ] Set up business email (support@yourdomain.com)
- [ ] Prepare digital product files (PDF of prompts)

## Vercel Deployment (Recommended)

### Step 1: Prepare Repository
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/yourusername/ai-prompts-for-profit.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: Leave empty (default)

### Step 3: Environment Variables
In Vercel dashboard, add these environment variables:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
STRIPE_SECRET_KEY=sk_live_your_live_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Step 4: Custom Domain (Optional)
1. In Vercel dashboard, go to Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

### Step 5: Stripe Webhook Setup
1. In Stripe dashboard, go to Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
4. Copy webhook secret and update in Vercel environment variables

## Alternative Deployment Options

### Netlify Deployment

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `.next` folder
   - Or connect GitHub repository

3. **Configure Environment Variables**
   Add the same environment variables in Netlify dashboard

4. **Set up Redirects**
   Create `public/_redirects`:
   ```
   /api/* /.netlify/functions/:splat 200
   /* /index.html 200
   ```

### Self-Hosted Deployment

#### Using PM2 (Node.js Process Manager)

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Build and Start**
   ```bash
   npm run build
   pm2 start npm --name "ai-prompts" -- start
   ```

3. **Configure Nginx (Optional)**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

#### Using Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and Run**
   ```bash
   docker build -t ai-prompts .
   docker run -p 3000:3000 --env-file .env.local ai-prompts
   ```

## Post-Deployment Setup

### 1. Test Payment Flow
1. Visit your live site
2. Go through complete purchase process
3. Use Stripe test cards to verify checkout
4. Check webhook logs in Stripe dashboard
5. Verify download page works correctly

### 2. Set up Monitoring
- Enable Vercel Analytics
- Set up Stripe dashboard alerts
- Monitor error logs regularly

### 3. SEO Optimization
Update `src/app/layout.tsx` with proper meta tags:

```typescript
export const metadata = {
  title: 'AI Prompts for Profit - Make Money with ChatGPT',
  description: '30 proven AI prompts to help you make money online. Generate sales emails, content, and more with ChatGPT.',
  keywords: 'AI prompts, ChatGPT, make money online, sales emails, content creation',
  openGraph: {
    title: 'AI Prompts for Profit',
    description: '30 proven AI prompts to help you make money online',
    url: 'https://yourdomain.com',
    siteName: 'AI Prompts for Profit',
    images: [
      {
        url: 'https://yourdomain.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
}
```

### 4. Analytics Setup
Add Google Analytics to `src/app/layout.tsx`:

```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

## Maintenance & Updates

### Regular Tasks
- Monitor Stripe dashboard for payments
- Check webhook delivery status
- Update prompt content as needed
- Review and respond to customer emails
- Monitor site performance and uptime

### Updating Content
1. Edit files locally
2. Test changes with `npm run dev`
3. Commit and push to GitHub
4. Vercel will auto-deploy changes

### Scaling Considerations
- Add database for customer management
- Implement email automation
- Add more product tiers
- Create affiliate program
- Add customer dashboard

## Troubleshooting

### Common Deployment Issues

**Environment Variables Not Working**
- Ensure variables are set in deployment platform
- Check variable names match exactly
- Restart deployment after adding variables

**Webhook Not Receiving Events**
- Verify webhook URL is accessible
- Check webhook secret matches
- Review Stripe webhook logs
- Ensure HTTPS is used in production

**Build Failures**
- Check for TypeScript errors: `npm run lint`
- Verify all dependencies are installed
- Check Node.js version compatibility

**Payment Issues**
- Verify Stripe keys are live (not test)
- Check webhook endpoint configuration
- Review Stripe dashboard for errors
- Test with different payment methods

### Getting Support
- Vercel: [vercel.com/support](https://vercel.com/support)
- Stripe: [support.stripe.com](https://support.stripe.com)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)

---

**Ready to launch your profitable AI prompts business!** 🚀

