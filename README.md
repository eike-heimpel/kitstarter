
# 🚀 Kitstarter

A batteries-included SvelteKit template for quickly bootstrapping full-stack applications.

## TODO

MongoDB  
LemonSqueezy  
Brevo  
Privacy Notice  
Imprint  
What else Konrad?  

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

## Deployment

### Deployment Guide  

This project uses Vercel for deployment. We provide a simple script to handle the entire setup process.  

#### Prerequisites  
- Node.js installed  
- Git repository initialized  
- `.env.example` file with all required variables listed  

#### Deployment Steps  

1. Make the setup script executable:  
```bash
chmod +x deploy-setup.sh
```  

2. Run the setup script with the desired environment flag:  
```bash
# For preview environment (default)
./deploy-setup.sh

# For production
./deploy-setup.sh --prod
```  

The script will:  
- Install Vercel CLI if needed  
- Log you into Vercel if needed  
- Deploy your project to Vercel  
- Set up environment variables for the chosen environment  

Each environment (preview, production) can have its own set of environment variables. The script will prompt you to add each variable from your `.env.example` for the selected environment. Development environment variables are handled locally through your `.env` file.

#### Future Deployments  
Pushing to the main branch will automatically trigger a preview deployment. For manual deployments:  

```bash
# Preview deployment (default)
./deploy-setup.sh

# Production deployment
./deploy-setup.sh --prod
```  

#### Troubleshooting  
If you encounter any issues:  
- Ensure you're logged into Vercel: \`vercel login\`  
- Check your environment variables in the Vercel dashboard  
- Verify your `.env.example` file lists all required variables  

**Remember:** Never commit your `.env` file to Git!  

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

You can disable auth by setting \`PUBLIC_AUTH_ENABLED\` to \`false\` in your `.env` file, in which case you can leave the supabase keys empty.  

Add the respective API keys to your `.env` file.  

## Development

- \`npm run dev\` - Start development server  
- \`npm run build\` - Build for production  
- \`npm run preview\` - Preview production build  

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
