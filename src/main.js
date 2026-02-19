import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { profile, fallbackRepos } from './data/profile.js'

gsap.registerPlugin(ScrollTrigger)

const app = document.querySelector('#app')

const getSkillTone = (skill) => {
  const token = skill.toLowerCase()
  if (/(aws|azure|kubernetes|eks|aks|docker|linux|helm|kustomize|nginx|istio)/.test(token)) return 'tag--platform'
  if (/(github actions|jenkins|argo cd|gitops|terraform|ansible|python|bash|ci\/cd)/.test(token)) return 'tag--delivery'
  if (/(grafana|prometheus|jaeger|opentelemetry|loki|elk|slo\/sli|incident response|chaos engineering)/.test(token)) {
    return 'tag--reliability'
  }
  return 'tag--product'
}

const skillGroups = [
  { key: 'tag--platform', label: 'Platform' },
  { key: 'tag--delivery', label: 'Delivery' },
  { key: 'tag--reliability', label: 'Reliability' },
  { key: 'tag--product', label: 'Product' },
]

const skillGroupMeta = {
  'tag--platform': {
    title: 'Platform Engineering',
    summary: 'Operate multi-cloud container platforms with strong production baselines and repeatable infra patterns.',
  },
  'tag--delivery': {
    title: 'Delivery Automation',
    summary: 'Build CI/CD and infrastructure pipelines that reduce manual steps and keep releases predictable.',
  },
  'tag--reliability': {
    title: 'Reliability + Observability',
    summary: 'Instrument systems, define SLO-first monitoring, and improve incident response speed with actionable telemetry.',
  },
  'tag--product': {
    title: 'Product Collaboration',
    summary: 'Ship product-facing features and support full-stack teams with pragmatic backend, frontend, and desktop capabilities.',
  },
}

const render = () => {
  const groupedSkills = skillGroups
    .map((group) => ({
      ...group,
      items: profile.skills.filter((skill) => getSkillTone(skill) === group.key),
    }))
    .filter((group) => group.items.length)

  app.innerHTML = `
    <div class="ambient ambient--one" aria-hidden="true"></div>
    <div class="ambient ambient--two" aria-hidden="true"></div>
    <div class="grain" aria-hidden="true"></div>

    <div class="shell">
      <aside class="side-rail">
        <div class="side-rail__top">
          <button class="side-rail__logo side-rail__logo--toggle magnetic" data-theme-toggle type="button">
            <span>SG</span>
            <span class="side-rail__mode" id="railThemeMode">LT</span>
          </button>
          <button class="side-rail__menu-btn" id="navMenuToggle" type="button" aria-label="Toggle navigation menu" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <nav class="side-rail__nav" id="sideRailNav">
          <a href="#home" class="side-rail__link">Home</a>
          <a href="#experience" class="side-rail__link">Experience</a>
          <a href="#github" class="side-rail__link">GitHub</a>
          <a href="#contact" class="side-rail__link">Contact</a>
        </nav>
      </aside>

      <main class="workspace">
        <header class="workspace-header" id="home">
          <div class="crumb">Workspace / Portfolio / ${profile.role}</div>
          <div class="header-actions">
            <a class="chip magnetic" href="${profile.github}" target="_blank" rel="noreferrer">GitHub</a>
            <a class="chip magnetic" href="${profile.resume}" target="_blank" rel="noreferrer">Resume PDF</a>
          </div>
        </header>

        <section class="hero reveal">
          <div class="hero-copy">
            <p class="eyebrow">${profile.location} / ${profile.company}</p>
            <h1>${profile.name}</h1>
            <p class="lead">${profile.tagline}</p>
            <p class="summary">${profile.summary}</p>

            <div class="focus-list">
              ${profile.focusAreas
                .map((item) => `<div class="focus-item">${item}</div>`)
                .join('')}
            </div>

            <div class="hero-cta">
              <a class="btn btn--primary magnetic" href="mailto:${profile.email}">Let's Build</a>
              <a class="btn btn--ghost magnetic" href="tel:${profile.phone.replace(/\s+/g, '')}">Call Me</a>
            </div>
          </div>

          <div class="hero-stage">
            <div class="stage-top">
              <div class="stage-title">3D Activity Board</div>
              <button class="chip chip--button" id="switchArtifact" type="button">Switch Artifact</button>
            </div>
            <canvas id="heroCanvas" aria-label="3D profile scene"></canvas>
            <div class="stage-note">Realtime interaction: drag cursor inside this panel.</div>
          </div>
        </section>

        <section class="grid-panel reveal">
          <article class="panel-card panel-card--skills">
            <div class="skills-head">
              <div>
                <h2>Stack I Operate Daily</h2>
                <p>Core DevOps and SRE toolkit for delivery speed, reliability, and production visibility.</p>
              </div>
              <span class="skills-count">${profile.skills.length} Skills</span>
            </div>
            <div class="skills-cards">
              ${groupedSkills
                .map(
                  (group) => `
                    <article class="skill-card" data-tone="${group.key}">
                      <div class="skill-card__head">
                        <h3>${skillGroupMeta[group.key]?.title || group.label}</h3>
                        <span>${group.items.length} tools</span>
                      </div>
                      <p>${skillGroupMeta[group.key]?.summary || ''}</p>
                      <div class="skill-card__line">
                        <span>Core Stack</span>
                        <code>${group.items.join(' • ')}</code>
                      </div>
                    </article>
                  `,
                )
                .join('')}
            </div>
          </article>

          <article class="panel-card panel-card--edu">
            <h2>Education + Certifications</h2>
            <ul class="plain-list">
              ${profile.education.map((item) => `<li>${item}</li>`).join('')}
            </ul>
            <h3>Certifications</h3>
            <ul class="plain-list">
              ${profile.certifications.map((item) => `<li>${item}</li>`).join('')}
            </ul>
            <div class="pixel-lab">
              <div class="pixel-lab__head">
                <span>Pixel Lab</span>
                <small>Voxel Study</small>
              </div>
              <canvas id="pixelLabCanvas" aria-label="Pixel-art voxel animation"></canvas>
              <p class="pixel-lab__note">Procedural isometric voxels rendered with retro pixel style.</p>
            </div>
          </article>
        </section>

        <section class="experience reveal" id="experience">
          <div class="section-heading">
            <h2>Execution Timeline</h2>
            <p>Ownership across cloud reliability, developer velocity, and production readiness.</p>
          </div>

          <div class="timeline">
            ${profile.experience
              .map(
                (item) => `
                  <article class="timeline-card">
                    <div class="timeline-meta">${item.period} / ${item.location}</div>
                    <h3>${item.role}</h3>
                    <p class="company">${item.company}</p>
                    <ul>
                      ${item.highlights.map((point) => `<li>${point}</li>`).join('')}
                    </ul>
                  </article>
                `,
              )
              .join('')}
          </div>
        </section>

        <section class="github reveal" id="github">
          <div class="section-heading">
            <h2>GitHub Intelligence</h2>
            <p>Live profile statistics and quality signals from selected repositories.</p>
          </div>

          <div class="github-overview">
            <article class="metric-card">
              <span>Repositories</span>
              <strong data-counter id="repoCount">0</strong>
            </article>
            <article class="metric-card">
              <span>Active Projects</span>
              <strong data-counter id="activeProjectCount">0</strong>
              <small id="activeProjectHint">Quality-screened production builds</small>
            </article>
            <article class="metric-card metric-card--user">
              <img id="profileAvatar" alt="GitHub avatar" src="" />
              <div>
                <span>Profile</span>
                <strong id="profileName">${profile.name}</strong>
                <a href="${profile.github}" target="_blank" rel="noreferrer">@Gani-23</a>
              </div>
            </article>
          </div>

          <div class="latest-projects-wrap">
            <div class="latest-projects__head">
              <h3>Latest Strong Projects</h3>
              <span id="latestProjectsStamp">Scanning repositories...</span>
            </div>
            <div class="latest-projects" id="latestProjects"></div>
          </div>

          <div class="repo-grid" id="repoGrid"></div>
        </section>

        <section class="contact reveal" id="contact">
          <div class="contact-copy">
            <p class="eyebrow">Open for platform engineering and DevOps roles</p>
            <h2>Ready to ship faster without reliability tradeoffs.</h2>
            <p>
              I build production systems, automation, and release pipelines that keep teams moving.
              Reach out for infra ownership, CI/CD modernization, and cloud platform scaling.
            </p>
          </div>
          <div class="contact-actions">
            <a class="btn btn--primary magnetic" href="mailto:${profile.email}">Email ${profile.email}</a>
            <a class="btn btn--ghost magnetic" href="${profile.github}" target="_blank" rel="noreferrer">Open GitHub</a>
            <a class="btn btn--ghost magnetic" href="${profile.resume}" target="_blank" rel="noreferrer">View Resume</a>
          </div>
        </section>

        <footer class="workspace-footer">
          <span>Built with Vite, Three.js, and GSAP.</span>
          <span id="lastSync">Live profile sync pending...</span>
        </footer>
      </main>
    </div>
  `
}

render()

const THEME_STORAGE_KEY = 'saiganesh-theme'
const VIEWPORT_PROFILES = ['compact', 'comfortable', 'short', 'tv', 'ultrawide']
const FAVICON_LIGHT_PATH = '/icons/favicon-lt.svg'
const FAVICON_DARK_PATH = '/icons/favicon-dk.svg'

const normalizeViewportProfile = (profile) =>
  VIEWPORT_PROFILES.includes(profile) ? profile : 'comfortable'

const detectViewportProfile = () => {
  const width = window.innerWidth || document.documentElement.clientWidth || 0
  const height = window.innerHeight || document.documentElement.clientHeight || 0
  const aspect = width / Math.max(height, 1)

  if (width <= 640) return 'compact'
  if (height <= 760 && width >= 981) return 'short'
  if (aspect >= 2.15 && width >= 1500) return 'ultrawide'
  if (width >= 1920 || (width >= 1600 && height >= 900)) return 'tv'
  return 'comfortable'
}

const applyViewportProfile = (profile, options = {}) => {
  const { triggerResize = true } = options
  const normalizedProfile = normalizeViewportProfile(profile)
  const root = document.documentElement

  if (root.getAttribute('data-viewport-profile') === normalizedProfile) return

  root.setAttribute('data-viewport-profile', normalizedProfile)
  if (triggerResize) requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
}

const initViewportProfile = () => {
  let resizeFrame = null

  const updateProfile = () => {
    resizeFrame = null
    applyViewportProfile(detectViewportProfile(), { triggerResize: true })
  }

  applyViewportProfile(detectViewportProfile(), { triggerResize: false })

  window.addEventListener(
    'resize',
    () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(updateProfile)
    },
    { passive: true },
  )
}

const getPreferredTheme = () => {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme
  } catch {
    // ignore storage access errors
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const animateThemeTransition = () => {
  const existingOverlay = document.querySelector('.theme-transition-overlay')
  if (existingOverlay) existingOverlay.remove()

  const overlay = document.createElement('div')
  overlay.className = 'theme-transition-overlay'
  document.body.appendChild(overlay)

  gsap.fromTo(
    overlay,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.16,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
      onComplete: () => overlay.remove(),
    },
  )

  gsap.fromTo(
    '.workspace, .hero, .panel-card, .experience, .github, .contact',
    { scale: 0.992, filter: 'saturate(0.85)' },
    { scale: 1, filter: 'saturate(1)', duration: 0.42, stagger: 0.02, ease: 'power2.out' },
  )

  const logoToggle = document.querySelector('.side-rail__logo--toggle')
  if (logoToggle) {
    gsap.fromTo(
      logoToggle,
      { rotate: 0 },
      { rotate: 360, duration: 0.6, ease: 'power2.out' },
    )
  }
}

const updateFavicon = (theme) => {
  const favicon = document.querySelector('#siteFavicon')
  if (!favicon) return
  const nextHref = theme === 'dark' ? FAVICON_DARK_PATH : FAVICON_LIGHT_PATH
  if (favicon.getAttribute('href') === nextHref) return
  favicon.setAttribute('href', nextHref)
}

const applyTheme = (theme, options = {}) => {
  const { animate = true } = options
  const normalizedTheme = theme === 'dark' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', normalizedTheme)
  updateFavicon(normalizedTheme)

  const themeToggles = document.querySelectorAll('[data-theme-toggle]')
  const railThemeMode = document.querySelector('#railThemeMode')
  if (railThemeMode) {
    railThemeMode.textContent = normalizedTheme === 'dark' ? 'DK' : 'LT'
  }

  if (themeToggles.length) {
    const nextTheme = normalizedTheme === 'dark' ? 'light' : 'dark'
    themeToggles.forEach((themeToggle) => {
      themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} theme`)
      themeToggle.setAttribute('title', `Switch to ${nextTheme} theme`)
    })
  }

  if (animate) animateThemeTransition()

  document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: normalizedTheme } }))
}

const initTheme = () => {
  const themeToggles = document.querySelectorAll('[data-theme-toggle]')
  const initialTheme = getPreferredTheme()

  applyTheme(initialTheme, { animate: false })

  if (!themeToggles.length) return initialTheme

  themeToggles.forEach((themeToggle) => {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark'
      applyTheme(nextTheme)
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
      } catch {
        // ignore storage access errors
      }
    })
  })

  return initialTheme
}

const suspiciousRepoRegex =
  /(bruteforce|leak|hack|crack|exploit|keygen|phish|malware|ransom|ddos|license-key|credential)/i
const lowSignalRepoRegex =
  /(^saiganesh$|^compiler$|^activity$|^pipeline$|^testing$|^calc$|^cite$|^krish$|assignment|sample|practice)/i
const RECENT_ACTIVITY_CUTOFF = new Date('2024-01-01T00:00:00Z').getTime()

const projectNarratives = {
  'agent-buddy': 'AI-powered developer assistant focused on coding workflows and productivity tooling.',
  'agentbuddy': 'AI-powered developer assistant focused on coding workflows and productivity tooling.',
  'summit': 'Kubernetes platform with Terraform provisioning and Helm-based microservice deployments.',
  'oauth4.0': 'SSO and OAuth service with observability using Prometheus, Grafana, and Jaeger.',
  'smartinfraops': 'Infrastructure automation framework combining Terraform provisioning and Ansible orchestration.',
  'hva': 'MERN deployment on AWS with Nginx routing, ALB, and Cloudflare DNS setup.',
  'k8s-resumeai': 'MEAN application deployment workflow across Minikube and AWS EKS with CI/CD.',
  'orchestrationk8s': 'Kubernetes and Helm orchestration patterns with production-style deployment flow.',
  'dynamic_island': 'Cross-platform desktop UI clone built with .NET and Avalonia.',
  'krushigowrava': 'Next.js production website implementation and deployment workflows.',
}

const sanitizeText = (value = '') =>
  value
    .toString()
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const animateCounter = (element, endValue) => {
  const counter = { value: 0 }
  gsap.to(counter, {
    value: endValue,
    duration: 1.4,
    ease: 'power3.out',
    onUpdate: () => {
      element.textContent = Math.round(counter.value).toLocaleString('en-US')
    },
  })
}

const getRepoTimestamp = (repo) => new Date(repo.pushed_at || repo.updated_at || 0).getTime()
const isRecentlyMaintained = (repo) => getRepoTimestamp(repo) >= RECENT_ACTIVITY_CUTOFF

const getRepoAgeDays = (repo) => Math.max(1, Math.round((Date.now() - getRepoTimestamp(repo)) / 86400000))

const getRepoStatusLabel = (repo) => {
  const ageDays = getRepoAgeDays(repo)
  if (ageDays <= 300) return 'In Progress'
  if (ageDays <= 520) return 'Production Hardened'
  return 'Stable Foundation'
}

const getRepoImpactLabel = (repo) => {
  const searchable = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase()
  if (/(agent-buddy|agentbuddy|assistant|ai|llm|copilot)/.test(searchable)) {
    return 'AI Developer Tooling'
  }
  if (/(k8s|kubernetes|terraform|infra|devops|ansible|helm|eks|aks|argocd|argo)/.test(searchable)) {
    return 'Platform Automation'
  }
  if (/(oauth|auth|sso|security|identity)/.test(searchable)) {
    return 'Identity + Security'
  }
  if (/(avalonia|dotnet|\.net|reactiveui|desktop)/.test(searchable)) {
    return 'Cross-Platform App'
  }
  if (/(next|react|mern|mean|frontend|ui|web)/.test(searchable)) {
    return 'Product Engineering'
  }
  return 'Production Engineering'
}

const getRepoMinimumSize = (repo) => {
  const normalizedName = repo.name.toLowerCase()
  if (normalizedName === 'agent-buddy' || normalizedName === 'agentbuddy') return 50
  if (projectNarratives[normalizedName]) return 150
  return 1000
}

const isEligibleRepo = (repo) =>
  !repo.fork && !repo.archived && !suspiciousRepoRegex.test(`${repo.name} ${repo.description || ''}`)

const hasRepoSignal = (repo) =>
  (repo.description || '').trim().length > 8 ||
  (repo.stargazers_count || 0) > 0 ||
  Boolean((repo.homepage || '').trim()) ||
  (repo.topics || []).length > 0

const isQualityRepo = (repo) =>
  isEligibleRepo(repo) &&
  isRecentlyMaintained(repo) &&
  !lowSignalRepoRegex.test(repo.name) &&
  (repo.size || 0) >= getRepoMinimumSize(repo) &&
  (hasRepoSignal(repo) || Boolean(projectNarratives[repo.name.toLowerCase()]))

const getRepoScore = (repo) => {
  const now = Date.now()
  const ageDays = Math.max(1, (now - getRepoTimestamp(repo)) / 86400000)
  const recencyScore = Math.max(0, 540 - ageDays) / 30
  const sizeScore = Math.min(repo.size || 0, 70000) / 4500
  const popularityScore = (repo.stargazers_count || 0) * 1.3 + (repo.forks_count || 0) * 0.8
  const docsScore = (repo.description || '').trim().length > 10 ? 1 : 0
  const mappedNarrativeBonus = projectNarratives[repo.name.toLowerCase()] ? 2.4 : 0
  const sparsePenalty = (repo.description || '').trim().length === 0 && !projectNarratives[repo.name.toLowerCase()] ? 2 : 0
  return recencyScore + sizeScore + popularityScore + docsScore + mappedNarrativeBonus - sparsePenalty
}

const deriveProjectDescription = (repo) =>
  projectNarratives[repo.name.toLowerCase()] ||
  repo.description ||
  'Production-focused repository with deployment and automation workflows.'

const sortRepos = (repos) =>
  (() => {
    const qualityRepos = repos.filter((repo) => isQualityRepo(repo))
    const curated = qualityRepos
      .filter((repo) => projectNarratives[repo.name.toLowerCase()])
      .sort((a, b) => getRepoTimestamp(b) - getRepoTimestamp(a) || getRepoScore(b) - getRepoScore(a))
    const additional = qualityRepos
      .filter((repo) => !projectNarratives[repo.name.toLowerCase()])
      .sort((a, b) => getRepoTimestamp(b) - getRepoTimestamp(a) || getRepoScore(b) - getRepoScore(a))
    return [...curated, ...additional].slice(0, 6)
  })()

const pickLatestProjects = (repos) => {
  const qualityRepos = repos.filter((repo) => isQualityRepo(repo))
  const curatedLatest = qualityRepos
    .filter((repo) => projectNarratives[repo.name.toLowerCase()])
    .sort((a, b) => getRepoTimestamp(b) - getRepoTimestamp(a))
  const fallbackLatest = qualityRepos
    .filter((repo) => !projectNarratives[repo.name.toLowerCase()])
    .sort((a, b) => getRepoTimestamp(b) - getRepoTimestamp(a))
  return [...curatedLatest, ...fallbackLatest].slice(0, 3)
}

const renderLatestProjects = (repos) => {
  const latestProjects = document.querySelector('#latestProjects')
  if (!latestProjects) return

  latestProjects.innerHTML = repos
    .map((repo, index) => {
      const lang = repo.language || 'Mixed'
      return `
        <article class="latest-project" style="--delay:${index * 0.09}s">
          <div class="latest-project__top">
            <span class="latest-project__rank">0${index + 1}</span>
            <span class="latest-project__lang">${sanitizeText(lang)}</span>
          </div>
          <h3>${sanitizeText(repo.name)}</h3>
          <p>${sanitizeText(deriveProjectDescription(repo))}</p>
          <div class="latest-project__meta">
            <span class="meta-pill meta-pill--status">${getRepoStatusLabel(repo)}</span>
            <span class="meta-pill">${getRepoImpactLabel(repo)}</span>
          </div>
          <a href="${repo.html_url}" target="_blank" rel="noreferrer">Open project</a>
        </article>
      `
    })
    .join('')
}

const renderRepos = (repos) => {
  const repoGrid = document.querySelector('#repoGrid')
  repoGrid.innerHTML = repos
    .map((repo, index) => {
      const lang = repo.language || 'Mixed'
      const description = deriveProjectDescription(repo)
      return `
        <article class="repo-card" style="--delay:${index * 0.08}s">
          <div class="repo-card__top">
            <h3>${sanitizeText(repo.name)}</h3>
            <span>${lang}</span>
          </div>
          <p>${sanitizeText(description)}</p>
          <div class="repo-card__meta">
            <span class="meta-pill meta-pill--status">${getRepoStatusLabel(repo)}</span>
            <span class="meta-pill">${getRepoImpactLabel(repo)}</span>
          </div>
          <a href="${repo.html_url}" target="_blank" rel="noreferrer">Open repository</a>
        </article>
      `
    })
    .join('')
}

const hydrateGitHub = async () => {
  const [profileReq, reposReq] = await Promise.all([
    fetch('https://api.github.com/users/Gani-23', { headers: { Accept: 'application/vnd.github+json' } }),
    fetch('https://api.github.com/users/Gani-23/repos?per_page=100&sort=updated', {
      headers: { Accept: 'application/vnd.github+json' },
    }),
  ])

  if (!profileReq.ok || !reposReq.ok) {
    throw new Error('GitHub API request failed')
  }

  const profileData = await profileReq.json()
  const reposData = await reposReq.json()

  const repoCountEl = document.querySelector('#repoCount')
  const activeProjectCountEl = document.querySelector('#activeProjectCount')
  const latestProjectsStampEl = document.querySelector('#latestProjectsStamp')
  const avatarEl = document.querySelector('#profileAvatar')
  const profileNameEl = document.querySelector('#profileName')
  const qualityRepos = reposData.filter((repo) => isQualityRepo(repo))
  const latestProjects = pickLatestProjects(reposData)
  const showcaseRepos = sortRepos(reposData)

  animateCounter(repoCountEl, profileData.public_repos || 0)
  animateCounter(activeProjectCountEl, qualityRepos.length)

  avatarEl.src = profileData.avatar_url
  avatarEl.alt = `${profileData.name || 'Profile'} avatar`
  profileNameEl.textContent = profileData.name || 'Saiganesh Angadi'

  latestProjectsStampEl.textContent = `Showing quality-screened repositories • Analyzed ${reposData.length} repos`

  renderLatestProjects(latestProjects)
  renderRepos(showcaseRepos)

  const syncText = 'Live sync from GitHub API'
  document.querySelector('#lastSync').textContent = syncText
}

const hydrateFallbackGitHub = () => {
  const repoCountEl = document.querySelector('#repoCount')
  const activeProjectCountEl = document.querySelector('#activeProjectCount')
  const latestProjectsStampEl = document.querySelector('#latestProjectsStamp')
  const avatarEl = document.querySelector('#profileAvatar')
  const profileNameEl = document.querySelector('#profileName')
  const latestProjects = pickLatestProjects(fallbackRepos)
  const showcaseRepos = sortRepos(fallbackRepos)

  animateCounter(repoCountEl, 52)
  animateCounter(activeProjectCountEl, showcaseRepos.length)

  avatarEl.src = 'https://avatars.githubusercontent.com/u/47131861?v=4'
  avatarEl.alt = 'Saiganesh Angadi avatar'
  profileNameEl.textContent = 'Saiganesh Angadi'

  latestProjectsStampEl.textContent = 'Showing quality-screened repositories • Cached snapshot'

  renderLatestProjects(latestProjects)
  renderRepos(showcaseRepos)
  document.querySelector('#lastSync').textContent = 'Using cached GitHub snapshot'
}

const initPixelLab = () => {
  const canvas = document.querySelector('#pixelLabCanvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const offscreen = document.createElement('canvas')
  const offCtx = offscreen.getContext('2d')
  if (!offCtx) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let frameId = 0
  let profile = { width: 0, height: 0, lowW: 0, lowH: 0, tileW: 0, tileH: 0 }
  let currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'

  const palettes = {
    light: {
      bgA: '#f4ebd9',
      bgB: '#e7dbc2',
      scan: 'rgba(120, 103, 72, 0.08)',
      dust: '#b39d79',
      topA: '#8fc8ef',
      leftA: '#4f89b6',
      rightA: '#2d6388',
      topB: '#a2dbc6',
      leftB: '#5c9e86',
      rightB: '#3e7a66',
      edge: '#2f2b22',
    },
    dark: {
      bgA: '#152233',
      bgB: '#111a27',
      scan: 'rgba(193, 220, 247, 0.08)',
      dust: '#6f9cc8',
      topA: '#7ec4ff',
      leftA: '#3e77a8',
      rightA: '#27567a',
      topB: '#88e2c4',
      leftB: '#469277',
      rightB: '#2f6e59',
      edge: '#0a1118',
    },
  }

  const drawDiamond = (x, y, w, h, fill, edge) => {
    offCtx.beginPath()
    offCtx.moveTo(x, y - h)
    offCtx.lineTo(x + w, y)
    offCtx.lineTo(x, y + h)
    offCtx.lineTo(x - w, y)
    offCtx.closePath()
    offCtx.fillStyle = fill
    offCtx.fill()
    offCtx.strokeStyle = edge
    offCtx.lineWidth = 0.7
    offCtx.stroke()
  }

  const drawVoxel = (x, y, w, h, colors) => {
    drawDiamond(x, y - h, w, h, colors.top, colors.edge)

    offCtx.beginPath()
    offCtx.moveTo(x - w, y - h)
    offCtx.lineTo(x, y)
    offCtx.lineTo(x, y + h)
    offCtx.lineTo(x - w, y)
    offCtx.closePath()
    offCtx.fillStyle = colors.left
    offCtx.fill()
    offCtx.strokeStyle = colors.edge
    offCtx.stroke()

    offCtx.beginPath()
    offCtx.moveTo(x + w, y - h)
    offCtx.lineTo(x, y)
    offCtx.lineTo(x, y + h)
    offCtx.lineTo(x + w, y)
    offCtx.closePath()
    offCtx.fillStyle = colors.right
    offCtx.fill()
    offCtx.strokeStyle = colors.edge
    offCtx.stroke()
  }

  const recalc = () => {
    const rect = canvas.getBoundingClientRect()
    profile.width = Math.max(160, Math.floor(rect.width))
    profile.height = Math.max(120, Math.floor(rect.height))

    const pixelScale = Math.max(2, Math.floor(Math.min(profile.width / 140, profile.height / 95)))
    profile.lowW = Math.max(90, Math.floor(profile.width / pixelScale))
    profile.lowH = Math.max(64, Math.floor(profile.height / pixelScale))
    profile.tileW = Math.max(4, Math.floor(profile.lowW / 28))
    profile.tileH = Math.max(2, Math.floor(profile.tileW * 0.55))

    canvas.width = profile.width
    canvas.height = profile.height
    offscreen.width = profile.lowW
    offscreen.height = profile.lowH
  }

  const drawScene = (time = 0) => {
    const palette = palettes[currentTheme]
    offCtx.clearRect(0, 0, profile.lowW, profile.lowH)

    const bgGradient = offCtx.createLinearGradient(0, 0, 0, profile.lowH)
    bgGradient.addColorStop(0, palette.bgA)
    bgGradient.addColorStop(1, palette.bgB)
    offCtx.fillStyle = bgGradient
    offCtx.fillRect(0, 0, profile.lowW, profile.lowH)

    for (let y = 0; y < profile.lowH; y += 2) {
      offCtx.fillStyle = palette.scan
      offCtx.fillRect(0, y, profile.lowW, 1)
    }

    offCtx.globalAlpha = 0.8
    for (let i = 0; i < 26; i += 1) {
      const sx = Math.abs((i * 37.7 + time * 19) % profile.lowW)
      const sy = ((i * 11.1 + time * 7) % (profile.lowH * 0.6)) | 0
      offCtx.fillStyle = i % 2 ? palette.dust : palette.edge
      offCtx.fillRect(sx | 0, sy, 1, 1)
    }
    offCtx.globalAlpha = 1

    const originX = profile.lowW * 0.5
    const originY = profile.lowH * 0.6
    const span = 4
    const cells = []

    for (let gx = -span; gx <= span; gx += 1) {
      for (let gz = -span; gz <= span; gz += 1) {
        const waveA = Math.sin(gx * 0.9 + time * 0.9)
        const waveB = Math.cos(gz * 0.7 + time * 0.7)
        const waveC = Math.sin((gx + gz) * 0.55 - time * 0.5)
        const height = Math.max(1, Math.min(4, Math.round(((waveA + waveB + waveC + 3) / 1.9) * 0.9)))

        cells.push({
          gx,
          gz,
          height,
          depth: gx + gz,
          isoX: originX + (gx - gz) * profile.tileW,
          isoY: originY + (gx + gz) * profile.tileH,
          alt: (gx + gz) % 2 === 0,
        })
      }
    }

    cells.sort((a, b) => a.depth - b.depth)

    cells.forEach((cell) => {
      for (let level = 0; level < cell.height; level += 1) {
        const y = cell.isoY - level * (profile.tileH + 1)
        const colors = cell.alt
          ? { top: palette.topA, left: palette.leftA, right: palette.rightA, edge: palette.edge }
          : { top: palette.topB, left: palette.leftB, right: palette.rightB, edge: palette.edge }
        drawVoxel(cell.isoX, y, profile.tileW, profile.tileH, colors)
      }
    })

    ctx.clearRect(0, 0, profile.width, profile.height)
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(offscreen, 0, 0, profile.width, profile.height)
  }

  const animate = () => {
    frameId = requestAnimationFrame(animate)
    drawScene(performance.now() * 0.0012)
  }

  const handleResize = () => {
    recalc()
    drawScene(performance.now() * 0.0012)
  }

  recalc()
  drawScene(0)
  if (!reduceMotion) animate()

  window.addEventListener('resize', handleResize, { passive: true })
  document.addEventListener('themechange', (event) => {
    currentTheme = event.detail?.theme === 'dark' ? 'dark' : 'light'
    drawScene(performance.now() * 0.0012)
  })

  if (reduceMotion && frameId) cancelAnimationFrame(frameId)
}

const init3DStage = () => {
  const canvas = document.querySelector('#heroCanvas')
  const switchButton = document.querySelector('#switchArtifact')
  if (!canvas || !switchButton) return

  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 120)
  camera.position.set(0, 1.1, 4.2)

  const ambientLight = new THREE.AmbientLight(0xf5eddc, 1.05)
  const hemiLight = new THREE.HemisphereLight(0xfff8ea, 0xe0d2b3, 0.75)
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.1)
  keyLight.position.set(3, 4, 5)
  const rimLight = new THREE.PointLight(0xffd9a3, 1.0, 12)
  rimLight.position.set(-2.2, 1.6, -2.4)

  scene.add(ambientLight, hemiLight, keyLight, rimLight)

  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(1.25, 0.02, 18, 100),
    new THREE.MeshStandardMaterial({ color: 0x514a39, roughness: 0.58, metalness: 0.25 }),
  )
  halo.position.set(0, 0.44, -1.5)
  scene.add(halo)

  const surfaceGroup = new THREE.Group()
  scene.add(surfaceGroup)

  const plane = new THREE.Mesh(
    new THREE.CircleGeometry(1.85, 64),
    new THREE.MeshStandardMaterial({ color: 0xf5f0e6, roughness: 0.95, metalness: 0.1 }),
  )
  plane.rotation.x = -Math.PI / 2
  plane.position.y = -1.05
  surfaceGroup.add(plane)

  const dunePatches = []
  for (let i = 0; i < 22; i += 1) {
    const patch = new THREE.Mesh(
      new THREE.CircleGeometry(0.09 + Math.random() * 0.24, 28),
      new THREE.MeshStandardMaterial({ color: 0xddd3be, roughness: 1, metalness: 0 }),
    )
    const angle = Math.random() * Math.PI * 2
    const radius = 0.18 + Math.random() * 1.42
    patch.rotation.x = -Math.PI / 2
    patch.position.set(
      Math.cos(angle) * radius,
      -1.047 + Math.random() * 0.009,
      Math.sin(angle) * radius,
    )
    patch.scale.setScalar(0.7 + Math.random() * 1.1)
    surfaceGroup.add(patch)
    dunePatches.push(patch)
  }

  const craterRings = []
  for (let i = 0; i < 12; i += 1) {
    const inner = 0.06 + Math.random() * 0.14
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(inner, inner + 0.03 + Math.random() * 0.02, 36),
      new THREE.MeshStandardMaterial({
        color: 0xbab09a,
        transparent: true,
        opacity: 0.55,
        roughness: 1,
        metalness: 0,
        side: THREE.DoubleSide,
      }),
    )
    const angle = Math.random() * Math.PI * 2
    const radius = 0.12 + Math.random() * 1.38
    ring.rotation.x = -Math.PI / 2
    ring.position.set(
      Math.cos(angle) * radius,
      -1.044 + Math.random() * 0.007,
      Math.sin(angle) * radius,
    )
    surfaceGroup.add(ring)
    craterRings.push(ring)
  }

  const surfacePebbles = []
  for (let i = 0; i < 36; i += 1) {
    const pebble = new THREE.Mesh(
      new THREE.SphereGeometry(0.01 + Math.random() * 0.02, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xc8bea7, roughness: 0.92, metalness: 0.03 }),
    )
    const angle = Math.random() * Math.PI * 2
    const radius = 0.16 + Math.random() * 1.5
    pebble.position.set(
      Math.cos(angle) * radius,
      -1.034 + Math.random() * 0.022,
      Math.sin(angle) * radius,
    )
    surfaceGroup.add(pebble)
    surfacePebbles.push(pebble)
  }

  const stars = new THREE.Group()
  const starDots = []
  for (let i = 0; i < 80; i += 1) {
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.01, 8, 8),
      new THREE.MeshBasicMaterial({ color: i % 2 ? 0x9f8f71 : 0x2a2f3a }),
    )
    dot.position.set(
      (Math.random() - 0.5) * 4.6,
      Math.random() * 2.4 - 0.5,
      (Math.random() - 0.5) * 4.6,
    )
    stars.add(dot)
    starDots.push(dot)
  }
  scene.add(stars)

  const loader = new GLTFLoader()
  const artifacts = []
  const artifactSources = [
    {
      path: '/models/water-bottle.glb',
      fallbackPath: '/models/astronaut.glb',
      displayName: 'Water Bottle',
      fallbackName: 'Astronaut',
      yaw: 0.52,
      pitch: -0.08,
      roll: 0.02,
      spin: 0.14,
      cameraLift: 0.08,
      fit: 0.82,
      theme: 'light',
    },
    {
      path: '/models/damaged-helmet.glb',
      fallbackPath: '/models/robot.glb',
      displayName: 'Damaged Helmet',
      fallbackName: 'Robot',
      yaw: 0.35,
      pitch: -0.02,
      roll: 0,
      spin: 0.2,
      cameraLift: 0.04,
      fit: 0.93,
      theme: 'dark',
    },
  ]

  let activeIndex = -1
  const pointer = { x: 0, y: 0 }
  const stageNote = document.querySelector('.stage-note')
  const cameraState = { baseY: 1.1, baseZ: 4.2, lookAtY: -0.1 }
  let currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
  let activeArtifactLabel = ''

  const updateStageNote = () => {
    if (!stageNote) return
    const modeLabel = currentTheme === 'dark' ? 'Dark mode' : 'Light mode'
    const artifactLabel = activeArtifactLabel || 'artifact'
    stageNote.textContent = `${modeLabel}: ${artifactLabel} active. Drag cursor to inspect.`
  }

  const centerModelOnGround = (model) => {
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    model.position.sub(center)
    model.position.y -= box.min.y - center.y
    return size
  }

  const normalizeScale = (entry) => {
    const width = canvas.clientWidth || 1
    const height = canvas.clientHeight || 1
    const aspect = width / height
    const baseHeight = aspect < 0.95 ? 1.22 : aspect > 1.5 ? 1.58 : 1.42
    const targetHeight = baseHeight * entry.source.fit
    const scale = targetHeight / entry.baseSize.y
    entry.model.scale.setScalar(scale)

    const scaledBox = new THREE.Box3().setFromObject(entry.model)
    entry.scaledSize = scaledBox.getSize(new THREE.Vector3())
  }

  const frameArtifact = (index, animate = false) => {
    const entry = artifacts[index]
    if (!entry) return

    const aspect = camera.aspect || 1
    const fovRad = THREE.MathUtils.degToRad(camera.fov)
    const heightHalf = entry.scaledSize.y * 0.5
    const widthHalf = entry.scaledSize.x * 0.5 / Math.max(aspect, 0.75)
    const fitHalf = Math.max(heightHalf, widthHalf)
    const distance = fitHalf / Math.tan(fovRad / 2) + entry.scaledSize.z * 0.55
    const baseY = -1.0

    cameraState.baseZ = THREE.MathUtils.clamp(distance, 2.8, 6.5)
    cameraState.lookAtY = baseY + entry.scaledSize.y * 0.54
    cameraState.baseY = cameraState.lookAtY + (aspect < 0.95 ? 0.24 : 0.15) + (entry.source.cameraLift || 0)
    entry.baseY = baseY

    if (animate) {
      gsap.to(camera.position, {
        z: cameraState.baseZ,
        y: cameraState.baseY,
        duration: 0.55,
        ease: 'power2.out',
      })
    } else {
      camera.position.z = cameraState.baseZ
      camera.position.y = cameraState.baseY
    }
  }

  const applySceneTheme = (theme) => {
    const isDark = theme === 'dark'
    const planeMaterial = plane.material
    const haloMaterial = halo.material

    ambientLight.intensity = isDark ? 0.62 : 1.05
    hemiLight.intensity = isDark ? 0.34 : 0.75
    keyLight.intensity = isDark ? 1.28 : 1.1
    rimLight.intensity = isDark ? 1.24 : 1.0
    keyLight.color.setHex(isDark ? 0xc8ddff : 0xffffff)
    rimLight.color.setHex(isDark ? 0x72d0ff : 0xffd9a3)

    haloMaterial.color.setHex(isDark ? 0x5b8fb0 : 0x514a39)
    haloMaterial.metalness = isDark ? 0.55 : 0.25
    haloMaterial.roughness = isDark ? 0.33 : 0.58

    planeMaterial.color.setHex(isDark ? 0x1b222b : 0xeae1cf)
    planeMaterial.roughness = isDark ? 0.84 : 0.97
    planeMaterial.metalness = isDark ? 0.16 : 0.05

    dunePatches.forEach((patch, index) => {
      patch.material.color.setHex(isDark ? (index % 2 ? 0x283544 : 0x2f4152) : index % 2 ? 0xded4c1 : 0xcfc4ae)
      patch.material.roughness = isDark ? 0.9 : 1
      patch.material.metalness = isDark ? 0.06 : 0
    })

    craterRings.forEach((ring) => {
      ring.material.color.setHex(isDark ? 0x5f7391 : 0xb6ab93)
      ring.material.opacity = isDark ? 0.43 : 0.56
    })

    surfacePebbles.forEach((pebble, index) => {
      pebble.material.color.setHex(isDark ? (index % 3 ? 0x94badb : 0x6d8ba7) : index % 3 ? 0xbeb39d : 0xd6ccb6)
      pebble.material.roughness = isDark ? 0.76 : 0.92
      pebble.material.metalness = isDark ? 0.12 : 0.03
    })

    starDots.forEach((dot, index) => {
      dot.material.color.setHex(isDark ? (index % 2 ? 0x7dc8ff : 0x6cf3d1) : index % 2 ? 0x9f8f71 : 0x2a2f3a)
    })

    renderer.setClearColor(isDark ? 0x0d1117 : 0x000000, 0)

    updateStageNote()
  }

  const switchToIndex = (nextIndex, animate = false) => {
    if (!artifacts[nextIndex]) return

    if (activeIndex >= 0 && artifacts[activeIndex]) artifacts[activeIndex].pivot.visible = false
    activeIndex = nextIndex
    artifacts[activeIndex].pivot.visible = true
    activeArtifactLabel = artifacts[activeIndex].loadedName || artifacts[activeIndex].source.displayName
    updateStageNote()
    frameArtifact(activeIndex, animate)

    if (animate) {
      gsap.fromTo(
        artifacts[activeIndex].pivot.rotation,
        {
          y: artifacts[activeIndex].source.yaw - 0.42,
          x: (artifacts[activeIndex].source.pitch || 0) - 0.05,
          z: (artifacts[activeIndex].source.roll || 0) + 0.04,
        },
        {
          y: artifacts[activeIndex].source.yaw + 0.05,
          x: artifacts[activeIndex].source.pitch || 0,
          z: artifacts[activeIndex].source.roll || 0,
          duration: 0.62,
          ease: 'power2.out',
        },
      )
    } else {
      artifacts[activeIndex].pivot.rotation.y = artifacts[activeIndex].source.yaw
      artifacts[activeIndex].pivot.rotation.x = artifacts[activeIndex].source.pitch || 0
      artifacts[activeIndex].pivot.rotation.z = artifacts[activeIndex].source.roll || 0
    }
  }

  const setArtifactForTheme = (theme, animate = false) => {
    const preferredIndex = artifacts.findIndex((entry) => entry.source.theme === theme)
    if (preferredIndex !== -1) {
      switchToIndex(preferredIndex, animate && activeIndex >= 0)
      return
    }
    if (activeIndex < 0 && artifacts.length) switchToIndex(0, false)
  }

  applySceneTheme(currentTheme)

  const loadArtifact = (artifact, loadPath, loadedName) => {
    loader.load(
      loadPath,
      (gltf) => {
        const pivot = new THREE.Group()
        const model = gltf.scene
        const baseSize = centerModelOnGround(model)

        model.traverse((node) => {
          if (node.isMesh) node.frustumCulled = false
        })

        pivot.add(model)
        pivot.rotation.y = artifact.yaw
        pivot.visible = false
        scene.add(pivot)

        const entry = {
          source: artifact,
          loadedPath: loadPath,
          loadedName,
          pivot,
          model,
          baseSize,
          scaledSize: baseSize.clone(),
          baseY: -1.0,
        }

        normalizeScale(entry)
        artifacts.push(entry)
        setArtifactForTheme(currentTheme, false)
      },
      undefined,
      () => {
        if (artifact.fallbackPath && loadPath !== artifact.fallbackPath) {
          loadArtifact(artifact, artifact.fallbackPath, artifact.fallbackName || artifact.displayName)
        }
      },
    )
  }

  artifactSources.forEach((artifact) => {
    loadArtifact(artifact, artifact.path, artifact.displayName)
  })

  const resize = () => {
    const width = canvas.clientWidth || 1
    const height = canvas.clientHeight || 1
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)

    artifacts.forEach((entry) => normalizeScale(entry))
    frameArtifact(activeIndex)
  }

  const handlePointer = (event) => {
    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    pointer.x = (x - 0.5) * 2
    pointer.y = (y - 0.5) * 2
  }

  canvas.addEventListener('pointermove', handlePointer)

  switchButton.addEventListener('click', () => {
    if (!artifacts.length) return
    const nextIndex = activeIndex < 0 ? 0 : (activeIndex + 1) % artifacts.length
    switchToIndex(nextIndex, true)
  })

  document.addEventListener('themechange', (event) => {
    currentTheme = event.detail?.theme === 'dark' ? 'dark' : 'light'
    applySceneTheme(currentTheme)
    setArtifactForTheme(currentTheme, true)
  })

  const clock = new THREE.Clock()
  const tick = () => {
    const elapsed = clock.getElapsedTime()

    halo.rotation.z = elapsed * 0.15
    stars.rotation.y = elapsed * 0.08

    if (artifacts.length) {
      artifacts.forEach((entry, index) => {
        const isActive = index === activeIndex
        const floatOffset = Math.sin(elapsed * 1.05 + index) * (isActive ? 0.055 : 0.03)
        entry.pivot.position.y = entry.baseY + floatOffset
        const baseYaw = entry.source.yaw || 0
        const basePitch = entry.source.pitch || 0
        const baseRoll = entry.source.roll || 0
        const spin = entry.source.spin || 0.18
        entry.pivot.rotation.y = baseYaw + elapsed * (isActive ? spin : spin * 0.45) + pointer.x * (isActive ? 0.06 : 0.02)
        entry.pivot.rotation.x = THREE.MathUtils.lerp(
          entry.pivot.rotation.x,
          basePitch + (isActive ? pointer.y * 0.07 : 0),
          0.09,
        )
        entry.pivot.rotation.z = THREE.MathUtils.lerp(
          entry.pivot.rotation.z,
          baseRoll + (isActive ? pointer.x * 0.05 : 0),
          0.09,
        )
      })
    }

    camera.position.x = pointer.x * 0.16
    camera.position.y = cameraState.baseY - pointer.y * 0.08
    camera.lookAt(0, cameraState.lookAtY, 0)

    renderer.render(scene, camera)
    requestAnimationFrame(tick)
  }

  resize()
  window.addEventListener('resize', resize)
  tick()
}

const initMagnetic = () => {
  const magnets = document.querySelectorAll('.magnetic')

  magnets.forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect()
      const offsetX = event.clientX - (rect.left + rect.width / 2)
      const offsetY = event.clientY - (rect.top + rect.height / 2)

      gsap.to(element, {
        x: offsetX * 0.14,
        y: offsetY * 0.14,
        duration: 0.2,
        ease: 'power2.out',
      })
    })

    element.addEventListener('pointerleave', () => {
      gsap.to(element, { x: 0, y: 0, duration: 0.35, ease: 'elastic.out(1,0.5)' })
    })
  })
}

const initMobileNav = () => {
  const rail = document.querySelector('.side-rail')
  const navToggle = document.querySelector('#navMenuToggle')
  const navLinks = document.querySelectorAll('.side-rail__nav .side-rail__link')
  if (!rail || !navToggle || !navLinks.length) return

  const closeMenu = () => {
    rail.classList.remove('side-rail--open')
    navToggle.setAttribute('aria-expanded', 'false')
  }

  navToggle.addEventListener('click', () => {
    const nextOpen = !rail.classList.contains('side-rail--open')
    rail.classList.toggle('side-rail--open', nextOpen)
    navToggle.setAttribute('aria-expanded', nextOpen ? 'true' : 'false')
  })

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 980px)').matches) closeMenu()
    })
  })

  window.addEventListener(
    'resize',
    () => {
      if (!window.matchMedia('(max-width: 980px)').matches) closeMenu()
    },
    { passive: true },
  )
}

const initScrollAnimation = () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) return

  gsap.from('.workspace-header', {
    y: -22,
    opacity: 0,
    duration: 0.7,
    ease: 'power2.out',
  })

  gsap.from('.hero-copy h1, .hero-copy .lead, .hero-copy .summary', {
    y: 40,
    opacity: 0,
    stagger: 0.12,
    duration: 0.78,
    delay: 0.18,
    ease: 'power3.out',
  })

  gsap.utils.toArray('.reveal').forEach((section) => {
    gsap.from(section, {
      y: 36,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 84%',
      },
    })
  })

  gsap.from('.skill-card', {
    y: 24,
    opacity: 0,
    stagger: 0.08,
    duration: 0.45,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.skills-cards',
      start: 'top 84%',
    },
  })
}

const init = async () => {
  initViewportProfile()
  initTheme()
  initMobileNav()
  init3DStage()
  initPixelLab()
  initMagnetic()
  initScrollAnimation()

  try {
    await hydrateGitHub()
  } catch {
    hydrateFallbackGitHub()
  }
}

init()
