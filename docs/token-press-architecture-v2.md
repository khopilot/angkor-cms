# Token Press v2 — Architecture Design

## Le Futur WordPress

WordPress = CMS + Thèmes (PHP, rigides, manuels)
Token Press = CMS + AI + Code Generation + Auto-Deploy

Chaque user a :
- Un **CMS** (EmDash) pour gérer son contenu
- Un **site frontend** (Astro/Next.js + Tailwind) déployé sur Cloudflare Pages
- Une **IA** qui construit et personnalise le site
- Un **pipeline CI/CD** invisible pour le user

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    TOKEN PRESS PLATFORM                       │
│                  (Cloudflare Worker — EmDash)                 │
│                                                              │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────────┐  │
│  │ Admin UI│  │ AI Chat  │  │ Plugins │  │ Site Manager │  │
│  │ (React) │  │ (Drawer) │  │ & Skills│  │   (NEW)      │  │
│  └────┬────┘  └────┬─────┘  └────┬────┘  └──────┬───────┘  │
│       │            │             │               │           │
│  ┌────┴────────────┴─────────────┴───────────────┴────────┐  │
│  │              CMS API (/_emdash/api/*)                   │  │
│  │  Content · Schema · Media · Users · Menus · Settings    │  │
│  └─────────────────────┬──────────────────────────────────┘  │
│                        │                                     │
│  ┌─────────────────────┴──────────────────────────────────┐  │
│  │              Database (D1) · Storage (R2)               │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                         │
                         │ CMS API (content, media, settings)
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    SITE GENERATOR                             │
│              (Cloudflare Worker or Queue)                     │
│                                                              │
│  1. Receive: template + config + CMS API URL                 │
│  2. Clone template from registry                             │
│  3. Apply config (colors, fonts, sections, content)          │
│  4. Build (astro build)                                      │
│  5. Deploy to Cloudflare Pages via Direct Upload API         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                         │
                         │ Deploy
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    USER'S SITE                                │
│              (Cloudflare Pages — unique per user)             │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Astro/Next.js Frontend                                │  │
│  │  - Tailwind CSS (custom theme from config)             │  │
│  │  - SSR: fetches content from CMS API at render time    │  │
│  │  - Professional components (Hero, Grid, Cards, etc.)   │  │
│  │  - SEO optimized, responsive, dark mode                │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  URL: mysite.token-press.com (or custom domain)              │
└──────────────────────────────────────────────────────────────┘
```

---

## Flux Utilisateur

### 1. Inscription
```
User s'inscrit sur token-press.com
→ Création d'un espace CMS isolé (D1 database)
→ Accès au dashboard admin + AI chat
```

### 2. Construction du site
```
User: "Build me a restaurant website in French"

AI:
  1. settings_update → titre, tagline
  2. schema_create_collection → "plats", "reservations", "avis"
  3. content_create × N → menu du restaurant, avis clients
  4. menu_create → navigation
  5. site_configure → {
       template: "starter-business",
       theme: { primary: "#dc2626", font: "Playfair Display" },
       sections: ["hero", "menu", "reviews", "contact", "map"],
       locale: "fr"
     }
  6. site_deploy → Cloudflare Pages

Result: mon-restaurant.token-press.com est live en 60 secondes
```

### 3. Gestion quotidienne
```
User modifie du contenu dans le CMS ou via AI chat
→ Changements visibles instantanément (SSR depuis CMS API)
→ Pas besoin de redéployer pour du contenu

User: "Change the color scheme to green"
→ AI modifie la config du site
→ Redéploiement automatique (~30s)
→ Nouveau design live
```

---

## Templates (Starter Kits)

Repos GitHub avec des sites Astro + Tailwind professionnels :

| Template | Usage | Sections incluses |
|----------|-------|-------------------|
| `starter-business` | Agences, services, consulting | Hero, Services, Team, Testimonials, CTA, Contact, Blog |
| `starter-restaurant` | Restaurants, cafés | Hero, Menu/Plats, Réservations, Avis, Carte, Horaires |
| `starter-portfolio` | Freelancers, artistes | Hero, Projects, About, Skills, Contact |
| `starter-ecommerce` | Boutiques (light) | Hero, Products, Categories, Cart, Reviews |
| `starter-blog` | Publications, médias | Featured, Grid, Categories, Newsletter, About |

Chaque template :
- Est un projet Astro complet avec `site.config.ts`
- Lit le contenu depuis l'API CMS (pas de données hardcodées)
- A un design pro responsive + dark mode
- Est personnalisable via config (couleurs, fonts, sections)

---

## Config-Driven Customization

```typescript
// site.config.ts — ce que l'AI modifie
export default {
  // CMS connection
  cmsUrl: "https://user123-cms.token-press.workers.dev",
  apiToken: "tp_live_xxx",

  // Theme
  theme: {
    primary: "#2563eb",
    secondary: "#7c3aed",
    accent: "#f59e0b",
    font: {
      heading: "Inter",
      body: "Inter",
    },
    borderRadius: "0.5rem",
    darkMode: true,
  },

  // Sections to show on homepage
  sections: {
    hero: { enabled: true, style: "gradient" }, // gradient | image | video
    services: { enabled: true, columns: 3 },
    testimonials: { enabled: true, style: "cards" }, // cards | carousel
    team: { enabled: true },
    blog: { enabled: true, count: 3 },
    cta: { enabled: true },
    contact: { enabled: true, showMap: true },
  },

  // Navigation
  nav: {
    style: "transparent", // transparent | solid | minimal
    logo: true,
  },

  // Footer
  footer: {
    columns: 3,
    newsletter: true,
    social: true,
  },

  // SEO
  seo: {
    siteName: "Mon Restaurant",
    defaultImage: "/og-image.jpg",
  },

  // Locale
  locale: "fr",
}
```

L'AI modifie ce fichier JSON/TS → le template l'utilise pour tout rendre.

---

## Nouveaux Outils AI

```
site_list_templates  → Lister les templates disponibles
site_create         → Créer un site (template + config)
site_configure      → Modifier la config (couleurs, sections, etc.)
site_deploy         → Déclencher un build + deploy
site_status         → Voir le statut du déploiement
site_preview        → Générer un lien de preview
site_set_domain     → Configurer un domaine custom
```

---

## Pipeline de Déploiement

```
AI appelle site_deploy
  ↓
Platform Worker envoie un message à la queue
  ↓
Site Generator Worker:
  1. Fetch template depuis R2 (ou GitHub)
  2. Merge site.config.ts
  3. astro build (via buildless approach ou remote build)
  4. Upload dist/ vers Cloudflare Pages via Direct Upload API
  5. Retourne l'URL du site déployé
  ↓
Pages: https://mon-site.token-press.com est live
```

### Option Build: Buildless (Phase 1 — MVP)
- Templates pré-buildés avec les variantes les plus courantes
- La "customization" est du CSS dynamique (custom properties from config)
- Pas besoin de build step — juste upload les fichiers statiques + un worker pour SSR

### Option Build: Remote Build (Phase 2)
- Build complet via un runner (GitHub Actions, Cloudflare Build Workers)
- Permet des customizations profondes (nouveaux composants, layouts)

---

## Ce Qui Existe Déjà (à garder)

| Composant | Status | Rôle dans v2 |
|-----------|--------|-------------|
| EmDash CMS | ✅ Fonctionne | Backend de contenu (API) |
| Admin UI | ✅ Fonctionne | Dashboard de gestion |
| AI Chat + 61 tools | ✅ Fonctionne | Interface principale |
| Conversation history | ✅ Fonctionne | Mémoire des échanges |
| Web browse | ✅ Fonctionne | Inspiration de sites existants |
| Context-aware prompts | ✅ Fonctionne | AI adapté par page |
| Plugin system | ✅ Fonctionne | Extensibilité |
| MiniMax/Anthropic | ✅ Fonctionne | Provider AI flexible |

---

## Ce Qui Doit Être Construit

### Phase 1 — MVP (2-3 semaines)
1. **1 template pro** (`starter-business`) — Astro + Tailwind, config-driven
2. **Site Generator** — Worker qui prend config → génère → déploie
3. **Pages API integration** — Créer projet, upload, custom subdomain
4. **3 nouveaux outils AI** — `site_create`, `site_configure`, `site_deploy`
5. **Site Manager UI** — page admin pour voir/gérer son site déployé

### Phase 2 — Multi-Template (2 semaines)
6. **3 templates supplémentaires** (restaurant, portfolio, blog)
7. **Template marketplace** dans l'admin
8. **AI template selection** — l'AI choisit le bon template

### Phase 3 — Pro Features (ongoing)
9. **Custom domains** — `mon-domaine.com` → Cloudflare custom hostname
10. **Image generation** — AI génère les visuels du site
11. **Multi-langue** — traduction auto du contenu
12. **Analytics** — Cloudflare Web Analytics intégré
13. **E-commerce** — Stripe integration pour vente

---

## Stack Technique Final

| Layer | Technology |
|-------|-----------|
| Platform CMS | EmDash (Astro + Cloudflare Workers + D1 + R2) |
| AI Provider | MiniMax M2.7 / Anthropic Claude (auto-detect) |
| Frontend Templates | Astro 6 + Tailwind CSS v4 |
| Build & Deploy | Cloudflare Pages Direct Upload API |
| Multi-tenant | Workers for Platforms (custom hostnames) |
| Storage | R2 (templates, media) + D1 (per-user data) |
| Custom Domains | Cloudflare for SaaS (SSL + routing) |
| CI/CD | Cloudflare Queues (build triggers) |
