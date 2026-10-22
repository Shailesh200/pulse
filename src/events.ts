/** Stable event names. Apps should not invent aliases. */

export const portfolioEvents = {
  ctaClick: 'cta_click',
  navClick: 'nav_click',
  projectOpen: 'project_open',
  outboundClick: 'outbound_click',
  gateEnter: 'gate_enter',
} as const

export const writesEvents = {
  postView: 'post_view',
  postRead: 'post_read',
  postComplete: 'post_complete',
  share: 'share',
  newsletterSubmit: 'newsletter_submit',
  clap: 'clap',
  search: 'search',
} as const

export const cardorbitEvents = {
  signup: 'signup',
  login: 'login',
  ctaClick: 'cta_click',
} as const

export const chessSchoolEvents = {
  signup: 'signup',
  login: 'login',
  onboardingComplete: 'onboarding_complete',
  lessonStart: 'lesson_start',
  lessonComplete: 'lesson_complete',
  gameCreate: 'game_create',
  gameStart: 'game_start',
  gameEnd: 'game_end',
} as const

export const prismhqEvents = {
  ctaClick: 'cta_click',
  navClick: 'nav_click',
  footerClick: 'footer_click',
  productClick: 'product_click',
  installCopy: 'install_copy',
  installOpen: 'install_open',
  installAgent: 'install_agent',
  docsClick: 'docs_click',
  docsSearch: 'docs_search',
  starClick: 'star_click',
  changelogVersion: 'changelog_version',
  sectionClick: 'section_click',
  outboundClick: 'outbound_click',
} as const
