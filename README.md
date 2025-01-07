# 🚀 Kitstarter

A batteries-included SvelteKit template for quickly bootstrapping full-stack applications.

## Stack

- 🎯 **SvelteKit** - Frontend framework with Tailwind CSS + Daisy UI
- 💳 **LemonSqueezy** - Payments, taxes, and subscription management
- 🔐 **Supabase** - Authentication and optional SQL database
- 🍃 **MongoDB** - Primary database (when needed)
- ⚡ **Vercel** - Deployment, Edge Functions, and Blob Storage
- 📧 **Brevo** - Transactional emails (signup, magic links, password reset)

## Quick Start

1. Clone this template:
```bash
git clone https://github.com/yourusername/kitstarter.git my-app
cd my-app
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables:
```bash
cp .env.example .env
```

4. Fill in your environment variables in `.env`

5. Start the development server:
```bash
npm run dev
```

## Features

- 🔒 Authentication ready (Supabase)
- 🎨 UI components with Tailwind + Daisy UI
- 📱 Responsive layouts
- 🛣️ Route protection
- ✉️ Email integration setup
- 💰 Payment infrastructure ready

## Environment Setup

You'll need to set up accounts with:

1. **Supabase** - Auth and optional SQL database
2. **MongoDB** - If you need a NoSQL database
3. **LemonSqueezy** - For payments
4. **Brevo** - For transactional emails
5. **Vercel** - For deployment

Add the respective API keys to your `.env` file.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## AI Development with Cline

This template includes predefined prompts for Cline to help you develop faster with AI assistance. Common tasks are documented for quick implementation:

- Authentication flows
- Payment integration
- Email setup
- Database schema design
- API endpoint creation
- UI component development

Use Cline to help you implement features by referencing the stack and existing code structure. For example:
```
"Hey Cline, help me implement a new protected route for user settings using our Supabase auth"
```

## Notes

- This is a personal/friends template - feel free to modify for your needs
- Not all integrations are fully implemented yet - check the code for what's available

Happy coding! 🚀
