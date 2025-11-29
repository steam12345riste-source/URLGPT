# URLGPT by ExploitZ3r0

A beautiful, fast, and secure URL shortener built with modern web technologies. Transform long URLs into short, shareable links with a sleek dark theme and vibrant green accents.

![URLGPT](https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=630&fit=crop)

## ✨ Features

- **Instant URL Shortening** - Generate 6-character alphanumeric short codes
- **Cross-Device Access** - Links work on any device via Supabase backend
- **Clean Short URLs** - Format: `domain.com/abc123` (no `/s/` prefix)
- **Copy to Clipboard** - One-click copying of shortened URLs
- **Local Management** - Track up to 11 URLs per device
- **Delete Control** - Remove URLs you created
- **Instant Redirects** - Zero-delay redirection to original URLs
- **Beautiful UI** - Dark theme with green accents and smooth animations
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Backend**: Supabase (PostgreSQL + RLS)
- **Routing**: React Router v6
- **Icons**: Lucide React

## 📋 Prerequisites

Before deploying, you'll need:

1. **Supabase Account** (free tier available)
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Run the SQL schema (see [Database Setup](#database-setup))

2. **Git** installed on your machine

3. **Node.js** 18+ (for local development)

## 🗄️ Database Setup

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run this SQL script:

```sql
-- Create shortened_urls table for global URL storage
create table public.shortened_urls (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  original_url text not null,
  created_at timestamptz default now(),
  constraint code_length check (char_length(code) = 6)
);

-- Enable RLS
alter table public.shortened_urls enable row level security;

-- Allow anonymous users to read all shortened URLs
create policy "anon_select_urls"
  on public.shortened_urls for select to anon
  using (true);

-- Allow authenticated users to read all shortened URLs
create policy "authenticated_select_urls"
  on public.shortened_urls for select to authenticated
  using (true);

-- Allow anonymous users to create shortened URLs
create policy "anon_insert_urls"
  on public.shortened_urls for insert to anon
  with check (true);

-- Allow authenticated users to create shortened URLs
create policy "authenticated_insert_urls"
  on public.shortened_urls for insert to authenticated
  with check (true);

-- Create index on code column for fast redirect lookups
create index idx_shortened_urls_code on public.shortened_urls(code);
```

## 🔑 Environment Variables

You'll need these environment variables from your Supabase project:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Where to find them:**
1. Go to your Supabase project dashboard
2. Click **Settings** → **API**
3. Copy **Project URL** → Use as `VITE_SUPABASE_URL`
4. Copy **anon public** key → Use as `VITE_SUPABASE_ANON_KEY`

## 🚀 Deployment Instructions

### Option 1: Vercel (Recommended)

#### Via GUI (Easiest)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **Add New** → **Project**
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Click **Deploy**

#### Via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts and add environment variables when asked

# Deploy to production
vercel --prod
```

**Create `vercel.json` for proper SPA routing:**

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### Option 2: Cloudflare Pages

#### Via GUI

1. Push your code to GitHub
2. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
3. Navigate to **Workers & Pages** → **Create application** → **Pages**
4. Connect to Git and select your repository
5. Configure build:
   - **Framework preset**: None
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Add environment variables (expand **Environment variables**):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Click **Save and Deploy**

#### Via CLI (Wrangler)

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build your project
npm run build

# Deploy
wrangler pages deploy dist --project-name=urlgpt

# Set environment variables
wrangler pages secret put VITE_SUPABASE_URL
wrangler pages secret put VITE_SUPABASE_ANON_KEY
```

**Create `_redirects` file in `public/` folder:**

```
/*  /index.html  200
```

---

### Option 3: Netlify

#### Via GUI

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign in
3. Click **Add new site** → **Import an existing project**
4. Connect to Git and select your repository
5. Configure build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variables under **Site settings** → **Environment variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Click **Deploy site**

#### Via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize and deploy
netlify init

# Or deploy directly
netlify deploy --prod
```

**Create `public/_redirects` file:**

```
/*  /index.html  200
```

---

### Option 4: Render

#### Via GUI

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and sign in
3. Click **New** → **Static Site**
4. Connect your repository
5. Configure:
   - **Name**: urlgpt
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Click **Create Static Site**

**Create `render.yaml` in root:**

```yaml
services:
  - type: web
    name: urlgpt
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: dist
    envVars:
      - key: VITE_SUPABASE_URL
        sync: false
      - key: VITE_SUPABASE_ANON_KEY
        sync: false
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

---

### Option 5: Railway

#### Via GUI

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) and sign in
3. Click **New Project** → **Deploy from GitHub repo**
4. Select your repository
5. Add environment variables in **Variables** tab:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Railway will auto-detect Vite and deploy

#### Via CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add environment variables
railway variables set VITE_SUPABASE_URL=your_url
railway variables set VITE_SUPABASE_ANON_KEY=your_key

# Deploy
railway up
```

**Create `railway.json` in root:**

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npx serve dist -s -p $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

### Option 6: Fly.io

#### Via CLI

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Create app
flyctl launch

# Set secrets (environment variables)
flyctl secrets set VITE_SUPABASE_URL=your_url
flyctl secrets set VITE_SUPABASE_ANON_KEY=your_key

# Deploy
flyctl deploy
```

**Create `fly.toml` in root:**

```toml
app = "urlgpt"
primary_region = "iad"

[build]
  [build.args]
    NODE_VERSION = "18"

[env]
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[statics]]
  guest_path = "/app/dist"
  url_prefix = "/"
```

**Create `Dockerfile`:**

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

**Create `nginx.conf`:**

```nginx
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

---

### Option 7: Docker

**Create `Dockerfile`:**

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Create `docker-compose.yml`:**

```yaml
version: '3.8'

services:
  urlgpt:
    build:
      context: .
      args:
        VITE_SUPABASE_URL: ${VITE_SUPABASE_URL}
        VITE_SUPABASE_ANON_KEY: ${VITE_SUPABASE_ANON_KEY}
    ports:
      - "80:80"
    restart: unless-stopped
```

**Create `.env` file:**

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Deploy:**

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

### Option 8: DigitalOcean App Platform

#### Via GUI

1. Push your code to GitHub
2. Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
3. Click **Apps** → **Create App**
4. Connect to GitHub and select your repository
5. Configure:
   - **Resource Type**: Static Site
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Click **Next** → **Create Resources**

**Create `.do/app.yaml` (optional):**

```yaml
name: urlgpt
static_sites:
  - name: web
    github:
      repo: your-username/urlgpt
      branch: main
      deploy_on_push: true
    build_command: npm run build
    output_dir: dist
    envs:
      - key: VITE_SUPABASE_URL
        scope: BUILD_TIME
      - key: VITE_SUPABASE_ANON_KEY
        scope: BUILD_TIME
    routes:
      - path: /
```

---

### Option 9: AWS Amplify

#### Via GUI

1. Push your code to GitHub
2. Go to [AWS Console](https://console.aws.amazon.com/amplify)
3. Click **New app** → **Host web app**
4. Connect to GitHub and select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Click **Save and deploy**

**Create `amplify.yml`:**

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
  customHeaders:
    - pattern: '**/*'
      headers:
        - key: 'Cache-Control'
          value: 'public, max-age=31536000, immutable'
```

**Add Redirect Rules in Amplify Console:**
- Source: `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>`
- Target: `/index.html`
- Type: `200 (Rewrite)`

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/urlgpt.git
cd urlgpt

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your Supabase credentials to .env
# VITE_SUPABASE_URL=your_url
# VITE_SUPABASE_ANON_KEY=your_key

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Troubleshooting

### Redirects Not Working (404 errors)

**Problem**: Visiting `yoursite.com/abc123` shows 404 instead of redirecting

**Solution**: Configure your platform's redirect rules (see platform-specific instructions above)

### Environment Variables Not Loading

**Problem**: App shows "Missing Supabase environment variables"

**Solutions**:
- Make sure variable names start with `VITE_` prefix
- Rebuild/redeploy after adding variables
- Check that variables are set in platform dashboard
- For local dev, ensure `.env` file exists with correct values

### CORS Errors

**Problem**: Browser console shows CORS errors

**Solution**: Check your Supabase project settings:
1. Go to **Authentication** → **URL Configuration**
2. Add your deployment URL to **Site URL** and **Redirect URLs**

### Database Connection Failed

**Problem**: URLs not saving or loading

**Solutions**:
- Verify Supabase credentials are correct
- Check that SQL schema was executed
- Ensure RLS policies are enabled
- Check Supabase project status

### Build Failures

**Problem**: Deployment fails during build

**Solutions**:
- Check Node.js version (requires 18+)
- Clear build cache and retry
- Verify all dependencies in `package.json`
- Check build logs for specific errors

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👤 Author

**ExploitZ3r0**

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Backend powered by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**Need help?** Open an issue on GitHub or contact support@urlgpt.com

**Star ⭐ this repo if you found it helpful!**
