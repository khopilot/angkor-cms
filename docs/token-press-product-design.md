# Token Press — Product Design Document

## Vision

**Lovable + WordPress + Cloudflare.**

- **Lovable** : AI génère du vrai code (React/Astro + Tailwind) → preview → deploy
- **WordPress** : CMS complet (contenu, media, users, plugins, comments, SEO)
- **Cloudflare** : Edge deployment, custom domains, SSL, CDN, analytics

Le user n'a AUCUNE connaissance technique. Il parle à l'IA, son site se construit.

---

## User Journey Complet

```
1. SIGNUP    → token-press.com → "Create my website"
2. BRIEF     → AI: "What kind of site?" → User describes
3. GENERATE  → AI génère le code du site en temps réel (preview live)
4. CUSTOMIZE → "Change the color to green" → AI modifie le code → preview update
5. CONTENT   → "Add a blog post about X" → CMS crée le contenu
6. DEPLOY    → One click → site.token-press.com est live
7. MANAGE    → CMS admin pour le contenu quotidien
8. EVOLVE    → "Add an e-commerce section" → AI modifie le code → redeploy
```

---

## Architecture Technique

```
┌────────────────────────────────────────────────────────────┐
│                    TOKEN PRESS PLATFORM                      │
│               (Cloudflare Workers — monorepo)                │
│                                                              │
│  LAYER 1: USER INTERFACE                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ AI Builder  │  │ CMS Admin    │  │ Live Preview     │   │
│  │ (chat+code) │  │ (content)    │  │ (iframe du site) │   │
│  └──────┬──────┘  └──────┬───────┘  └────────┬─────────┘   │
│         │                │                    │              │
│  LAYER 2: CORE ENGINE                                        │
│  ┌──────┴────────────────┴────────────────────┴──────────┐  │
│  │                                                        │  │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────────┐  │  │
│  │  │ Code Gen   │  │ CMS API    │  │ Site Deployer   │  │  │
│  │  │            │  │            │  │                 │  │  │
│  │  │ AI → Astro │  │ Content    │  │ R2 → CF Pages  │  │  │
│  │  │ code files │  │ Media      │  │ Direct Upload  │  │  │
│  │  │ stored R2  │  │ Users      │  │ Custom Domain  │  │  │
│  │  └────────────┘  └────────────┘  └─────────────────┘  │  │
│  │                                                        │  │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────────┐  │  │
│  │  │ Plugins    │  │ Domain     │  │ Analytics       │  │  │
│  │  │ System     │  │ Manager    │  │ (CF Web Anlytcs)│  │  │
│  │  └────────────┘  └────────────┘  └─────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  LAYER 3: INFRASTRUCTURE                                     │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  D1 (database)  ·  R2 (files+media)  ·  KV (cache)   │  │
│  │  Queues (build)  ·  Pages (deploy)  ·  DNS (domains)  │  │
│  └────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                              │
                              │ Deploy
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                    USER'S WEBSITE                               │
│              (Cloudflare Pages — unique per user)               │
│                                                                │
│  Astro SSR → fetches content from CMS API at render time       │
│  Custom domain: mysite.com (Cloudflare for SaaS)               │
│  SSL + CDN + Edge caching automatic                            │
└────────────────────────────────────────────────────────────────┘
```

---

## Code Generation — Comment ça marche

### Principe : Template + AI Customization

L'IA ne génère pas du code from scratch (trop risqué, qualité variable). Elle part d'un **template de haute qualité** et le **customise** :

```
Template Starter (Astro + CSS)     AI Customization
──────────────────────────         ─────────────────
├── src/                           AI modifie:
│   ├── pages/                     - Couleurs (CSS custom properties)
│   │   ├── index.astro            - Sections (ajoute/supprime)
│   │   ├── about.astro            - Layout (modifie les composants)
│   │   ├── contact.astro          - Contenu statique (textes, images)
│   │   └── [...slug].astro        - Pages (crée de nouvelles)
│   ├── components/                - Composants (modifie le HTML/CSS)
│   │   ├── Hero.astro             
│   │   ├── Services.astro         AI ajoute:
│   │   ├── Testimonials.astro     - Nouveaux composants
│   │   └── Footer.astro           - Nouvelles pages
│   ├── layouts/                   - Intégrations (forms, analytics)
│   │   └── Base.astro             
│   └── styles/                    CMS API:
│       └── theme.css              - Contenu dynamique (SSR)
├── site.config.json               - Media (images R2)
└── package.json                   - Menus, settings, etc.
```

### Flux de génération

```
1. User: "Build me a restaurant website, dark theme, French"

2. AI choisit: template "starter-business"

3. AI génère les modifications:
   - site.config.json: { theme: "dark", locale: "fr", primary: "#dc2626" }
   - src/pages/index.astro: ajoute section Menu, section Réservations
   - src/components/Hero.astro: modifie le texte hero
   - src/styles/theme.css: dark mode colors
   - CMS: crée collections "plats", "avis", crée le contenu

4. Fichiers stockés dans R2: sites/{userId}/src/...

5. Build: astro build (via Cloudflare Build ou pré-build)

6. Deploy: upload dist/ → Cloudflare Pages Direct Upload API

7. Live: mon-restaurant.token-press.com
```

### Pourquoi Astro (pas Next.js)

- Cloudflare a racheté Astro → intégration native Workers
- EmDash CMS EST un projet Astro → cohérence
- Astro SSR sur Workers = zero cold start
- Output statique + SSR hybride = performance maximale
- Pas besoin de React runtime pour un site vitrine

---

## Ce qui existe déjà vs ce qu'il faut construire

### GARDER (solide, testé)

| Composant | Fichiers | Usage dans v2 |
|-----------|----------|---------------|
| EmDash CMS core | `packages/core/` | CMS API backend (content, media, users, auth) |
| Admin UI | `packages/admin/` | Interface de gestion de contenu |
| AI Chat plugin | `packages/plugins/ai-interface/` | Interface AI (à enrichir avec code gen) |
| 61 CMS tools | `tools.ts` | Gestion de contenu via AI |
| Plugin system | `packages/core/src/plugins/` | Extensibilité |
| Auth (passkeys) | `packages/core/src/auth/` | User management |
| 11 section components | `templates/blog-cloudflare/src/components/sections/` | Base du template starter |
| Collection pages | `templates/blog-cloudflare/src/pages/` | Pages dynamiques |

### CONSTRUIRE (nouveau)

| Composant | Description | Priorité |
|-----------|-------------|----------|
| **Site Deployer** | R2 storage + Cloudflare Pages Direct Upload API | P0 |
| **Template Engine** | Clone template → apply config → store in R2 | P0 |
| **Live Preview** | iframe dans l'admin montrant le site en cours de construction | P0 |
| **AI Code Tools** | `site_create`, `site_modify_component`, `site_add_page`, `site_deploy` | P0 |
| **Domain Manager** | Cloudflare for SaaS custom hostnames | P1 |
| **Site Dashboard** | page admin pour voir/gérer son site déployé | P1 |
| **Template Marketplace** | Browse + install templates | P2 |
| **Built-in Forms** | Soumissions → D1, notifications email | P2 |
| **Analytics Integration** | Cloudflare Web Analytics auto-inject | P2 |
| **Billing** | Stripe integration, plans, quotas | P2 |
| **Image Generation** | AI génère les visuels (Flux/DALL-E) | P3 |
| **i18n Auto-translate** | AI traduit le contenu | P3 |
| **Agency Mode** | Multi-client, white-label | P3 |

---

## P0 — Le MVP qui prouve le concept

### Objectif
Un user dit "Build me a website" → l'AI le construit → il est live sur *.token-press.com en 2 minutes.

### 4 briques à construire

#### Brique 1: Template Starter
- Transformer le template `blog-cloudflare` actuel en template standalone
- Configurable via `site.config.json` (couleurs, sections, CMS URL)
- Pré-buildable (astro build → fichiers statiques + SSR worker)

#### Brique 2: Site Deployer (Plugin CMS)
- Nouveau plugin EmDash : `@token-press/plugin-site-deployer`
- Route `POST /deploy` : prend les fichiers depuis R2 → upload vers CF Pages
- Route `GET /status` : statut du déploiement
- Route `POST /domain` : configure un custom subdomain
- Utilise Cloudflare Pages API (Direct Upload)

#### Brique 3: AI Code Generation Tools
- `site_create` : clone le template, applique la config, stocke dans R2
- `site_set_theme` : modifie les couleurs/fonts dans site.config.json
- `site_add_section` : ajoute un composant section à la homepage
- `site_remove_section` : supprime une section
- `site_deploy` : déclenche le build + deploy
- `site_preview_url` : retourne l'URL de preview

#### Brique 4: Preview dans l'Admin
- iframe dans le chat drawer ou page dédiée
- Montre le site en temps réel
- Refresh automatique après chaque modification

### Séquence d'implémentation

```
Semaine 1: Template Starter
  - Extraire le template actuel en projet standalone
  - Ajouter site.config.json pour la configuration
  - Vérifier que astro build fonctionne en standalone

Semaine 2: Site Deployer
  - Plugin avec routes deploy/status/domain
  - Integration Cloudflare Pages API
  - R2 storage pour les fichiers du site
  - Test: upload un site manuellement → vérifier qu'il est live

Semaine 3: AI Tools + Preview
  - Nouveaux outils AI pour la gestion du site
  - Preview iframe dans l'admin
  - System prompt mis à jour
  - Test end-to-end: AI chat → site live

Semaine 4: Polish + Demo
  - Bug fixes
  - UX polish
  - Demo vidéo
  - Documentation
```

---

## Différenciation vs Concurrence

| Feature | WordPress | Lovable | Bolt.new | Token Press |
|---------|-----------|---------|----------|-------------|
| AI-native | ❌ Plugin | ✅ Core | ✅ Core | ✅ Core |
| CMS complet | ✅ | ❌ | ❌ | ✅ |
| Code generation | ❌ | ✅ React | ✅ React | ✅ Astro |
| Edge deploy | ❌ | ❌ | ❌ | ✅ Cloudflare |
| Custom domains | ✅ Manual | ✅ Paid | ❌ | ✅ Auto |
| Plugin ecosystem | ✅ Mature | ❌ | ❌ | ✅ EmDash |
| Content management | ✅ | ❌ | ❌ | ✅ |
| Zero cold start | ❌ | ❌ | ❌ | ✅ Workers |
| Open source | ✅ | ❌ | ✅ | ✅ |
| Multi-language | ✅ Plugin | ❌ | ❌ | ✅ AI auto |
| Price | Hosting | $$$ | $$$ | Freemium |

**Token Press unique advantage**: C'est le seul qui combine AI code generation + CMS complet + edge deployment. Lovable/Bolt génèrent des apps mais pas de CMS. WordPress a le CMS mais pas l'AI.

---

## Prochaine étape concrète

Commencer par la **Brique 1 : Template Starter** — extraire le template actuel en projet standalone configurable. C'est la fondation de tout le reste.
