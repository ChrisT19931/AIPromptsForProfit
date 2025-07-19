# Quick Start Guide - AI Prompts for Profit

Get your AI prompts website up and running in 5 minutes!

## 🚀 Instant Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Stripe**
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` with your Stripe keys from [dashboard.stripe.com](https://dashboard.stripe.com)

3. **Start Development**
   ```bash
   npm run dev
   ```
   Visit: http://localhost:3000

## 🎯 Customize Your Content

### Update Prompts (2 minutes)
Edit `data/prompts.ts`:
- Replace sample prompts with your collection
- Update titles and descriptions
- Add your full 30 prompts

### Modify FAQ (1 minute)
Edit `data/faq.ts`:
- Update questions and answers
- Add your support email
- Customize policies

### Change Branding (1 minute)
- Update site name in `components/Header.tsx`
- Change colors in Tailwind classes
- Add your logo to `public/assets/`

## 💳 Stripe Setup

1. **Get Keys**: [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. **Test Cards**: Use `4242 4242 4242 4242` for testing
3. **Webhooks**: Add `your-domain.com/api/webhook` in production

## 🚀 Deploy in 1 Click

### Vercel (Recommended)
1. Push to GitHub
2. Connect at [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy!

### Other Options
- **Netlify**: Drag & drop build folder
- **Self-hosted**: `npm run build && npm start`

## 📁 Key Files to Edit

```
📂 Your Website
├── 📄 data/prompts.ts        ← Your AI prompts
├── 📄 data/faq.ts           ← FAQ content  
├── 📄 src/app/page.tsx      ← Homepage
├── 📄 components/Header.tsx  ← Site header
└── 📄 .env.local            ← Stripe keys
```

## 🎨 Quick Customizations

### Change Colors
Replace these Tailwind classes:
- `bg-yellow-400` → Your accent color
- `text-yellow-400` → Your text accent
- `bg-black` → Your dark color

### Update Copy
- Homepage hero: `src/app/page.tsx`
- Preview page: `src/app/preview/page.tsx`
- Checkout: `src/app/buy/page.tsx`

### Add Your Logo
1. Add image to `public/assets/logo.png`
2. Update `components/Header.tsx`

## 🔧 Common Issues

**Stripe Error?** 
- Check your API keys in `.env.local`
- Use test keys for development

**Build Error?**
- Run `npm run lint` to check for issues
- Ensure all imports are correct

**Styling Issues?**
- Check Tailwind classes are valid
- Verify responsive breakpoints

## 📞 Need Help?

- 📖 Full docs: `README.md`
- 🚀 Deployment: `DEPLOYMENT.md`
- 💡 Check the example files for reference

---

**You're ready to start making money with AI prompts!** 💰

