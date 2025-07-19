# AI Prompts for Profit - Professional Sales Website

A conversion-focused Next.js website for selling downloadable AI prompt packs. Built with TypeScript, TailwindCSS, and Stripe integration.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Stripe keys

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see your site.

## 📁 Project Structure

```
ai-prompts-for-profit/
├── src/
│   └── app/
│       ├── page.tsx              # Homepage
│       ├── preview/page.tsx      # Preview prompts page
│       ├── buy/page.tsx          # Checkout page
│       ├── download/page.tsx     # Download page
│       └── api/
│           ├── checkout/route.ts # Stripe checkout API
│           └── webhook/route.ts  # Stripe webhook handler
├── components/
│   ├── Header.tsx               # Site header
│   ├── Footer.tsx               # Site footer
│   └── BuyButton.tsx            # Purchase button component
├── data/
│   ├── prompts.ts               # Sample and full prompt data
│   └── faq.ts                   # FAQ content
├── lib/
│   └── stripe.ts                # Stripe client configuration
└── public/
    └── assets/                  # Images and static files
```

## 🎨 Customization Guide

### Editing Content

#### 1. Update Prompts
Edit `data/prompts.ts` to modify sample prompts and add your full collection:

```typescript
export const samplePrompts = [
  {
    id: 1,
    title: "Your Prompt Title",
    preview: "Brief description...",
    fullPrompt: "Complete prompt text..."
  }
];
```

#### 2. Modify FAQ
Update `data/faq.ts` to change frequently asked questions:

```typescript
export const faqs = [
  {
    question: "Your question?",
    answer: "Your answer..."
  }
];
```

#### 3. Update Site Content
- **Homepage**: Edit `src/app/page.tsx`
- **Preview Page**: Edit `src/app/preview/page.tsx`
- **Checkout**: Edit `src/app/buy/page.tsx`
- **Download**: Edit `src/app/download/page.tsx`

### Styling Customization

The site uses a black/white/gold color scheme. To customize:

#### Colors
Update these Tailwind classes throughout the components:
- `bg-black` - Main black background
- `text-yellow-400` - Gold accent color
- `bg-yellow-400` - Gold buttons
- `bg-gray-900` - Dark gray sections

#### Typography
The site uses system fonts. To add custom fonts:

1. Import in `src/app/layout.tsx`:
```typescript
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
```

2. Apply to body:
```typescript
<body className={inter.className}>
```

## 💳 Stripe Configuration

### 1. Get Stripe Keys
1. Create account at [stripe.com](https://stripe.com)
2. Get your publishable and secret keys from the dashboard
3. Set up webhook endpoint for production

### 2. Update Environment Variables
Edit `.env.local`:

```bash
# Test keys (start with pk_test_ and sk_test_)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Production URL (update for deployment)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Webhook Setup
1. In Stripe dashboard, go to Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy webhook secret to `.env.local`

### 4. Test Payments
Use Stripe test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Push to GitHub
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy

3. **Update Environment Variables**
   In Vercel dashboard, add:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL)

### Alternative Deployment Options

#### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

#### Self-hosted
```bash
npm run build
npm start
```

## 📦 Adding More Products

### Create New Prompt Packs

1. **Add New Data File**
   Create `data/advanced-prompts.ts`:
   ```typescript
   export const advancedPrompts = [
     // Your new prompts
   ];
   ```

2. **Create New Pages**
   - `src/app/advanced-preview/page.tsx`
   - `src/app/advanced-buy/page.tsx`

3. **Update Stripe Products**
   Modify `src/app/api/checkout/route.ts` to handle different products:
   ```typescript
   const products = {
     basic: { price: 1000, name: "30 AI Prompts" },
     advanced: { price: 2000, name: "50 Advanced Prompts" }
   };
   ```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Adding Dependencies
```bash
npm install package-name
```

### Environment Setup
1. Copy `.env.local.example` to `.env.local`
2. Update with your actual Stripe keys
3. Never commit `.env.local` to version control

## 📧 Email Integration (Optional)

To send confirmation emails after purchase:

1. **Install Email Service**
   ```bash
   npm install @sendgrid/mail
   # or
   npm install nodemailer
   ```

2. **Update Webhook Handler**
   Add email sending to `src/app/api/webhook/route.ts`:
   ```typescript
   case 'checkout.session.completed':
     // Send confirmation email
     await sendConfirmationEmail(session.customer_email);
     break;
   ```

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env.local`
   - Use different keys for development/production
   - Rotate keys regularly

2. **Webhook Security**
   - Always verify webhook signatures
   - Use HTTPS in production
   - Monitor webhook logs

3. **Content Security**
   - Validate all user inputs
   - Sanitize data before display
   - Use HTTPS for all external requests

## 📊 Analytics (Optional)

Add Google Analytics or other tracking:

1. **Install Analytics**
   ```bash
   npm install @next/third-parties
   ```

2. **Add to Layout**
   ```typescript
   import { GoogleAnalytics } from '@next/third-parties/google'
   
   export default function RootLayout() {
     return (
       <html>
         <body>
           {children}
           <GoogleAnalytics gaId="GA_MEASUREMENT_ID" />
         </body>
       </html>
     )
   }
   ```

## 🐛 Troubleshooting

### Common Issues

**Stripe Keys Not Working**
- Ensure you're using the correct test/live keys
- Check that keys are properly set in environment variables
- Verify webhook endpoint is accessible

**Build Errors**
- Run `npm run lint` to check for TypeScript errors
- Ensure all imports are correct
- Check that all required environment variables are set

**Styling Issues**
- Verify Tailwind CSS is properly configured
- Check for conflicting CSS classes
- Ensure responsive breakpoints are working

### Getting Help

1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Review [Stripe documentation](https://stripe.com/docs)
3. Search [Stack Overflow](https://stackoverflow.com) for specific errors

## 📄 License

This project is for commercial use. Customize and deploy as needed for your business.

---

**Built with ❤️ for entrepreneurs ready to profit from AI**

