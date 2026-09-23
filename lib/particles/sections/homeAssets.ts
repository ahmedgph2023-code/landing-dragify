/**
 * Home-page assets used on new-landing-3 (logos, agents, integrations, features).
 * Paths match classic `/` + `/landing` public files.
 */

export const PARTNER_LOGOS = [
  {
    src: '/icons/nl3/partners/02_Flat6Labs_partner_card.png',
    alt: 'Flat6Labs',
    label: 'Flat6Labs',
    w: 220,
    h: 72,
  },
  {
    src: '/icons/nl3/partners/06_ITIDA_partner_card.png',
    alt: 'ITIDA',
    label: 'ITIDA',
    w: 220,
    h: 72,
  },
  {
    src: '/icons/nl3/partners/01_AWS_partner_card.png',
    alt: 'AWS Activate',
    label: 'AWS',
    w: 220,
    h: 72,
  },
  {
    src: '/icons/nl3/partners/05_Qatar_Ministry_partner_card.png',
    alt: 'Qatar MCIT',
    label: 'Qatar',
    w: 240,
    h: 72,
  },
  {
    src: '/icons/nl3/partners/03_Google_partner_card.png',
    alt: 'Google for Startups',
    label: 'Google',
    w: 220,
    h: 72,
  },
  {
    src: '/icons/nl3/partners/07_TIEC_partner_card.png',
    alt: 'TIEC',
    label: 'TIEC',
    w: 220,
    h: 72,
  },
  {
    src: '/icons/nl3/partners/04_NVIDIA_partner_card.png',
    alt: 'NVIDIA Inception',
    label: 'NVIDIA',
    w: 220,
    h: 72,
  },
] as const;

export const INTEGRATION_LOGOS = [
  { src: '/slack.png', alt: 'Slack', w: 36, h: 36 },
  { src: '/google.png', alt: 'Google', w: 36, h: 36 },
  { src: '/outlook.png', alt: 'Outlook', w: 36, h: 36 },
  { src: '/onedrive.png', alt: 'OneDrive', w: 36, h: 36 },
  { src: '/salesforce.png', alt: 'Salesforce', w: 36, h: 36 },
  { src: '/amazon.png', alt: 'AWS', w: 40, h: 28 },
  { src: '/ai.png', alt: 'AI Agent', w: 36, h: 36 },
] as const;

/** Classic home hero workflow agent portraits */
export const AGENT_PORTRAITS = [
  { src: '/ceo.png', alt: 'CEO Agent' },
  { src: '/oa.png', alt: 'Operations Agent' },
  { src: '/ca.png', alt: 'Customer Agent' },
  { src: '/pa.png', alt: 'Product Agent' },
  { src: '/ma.png', alt: 'Marketing Agent' },
] as const;

/** Service / feature visuals — crisp icons (not photos) */
export const FEATURE_ICONS = [
  { src: '/icons/nl3/feat/agent.svg', alt: 'Custom AI agents', tag: 'Agents' },
  { src: '/icons/nl3/feat/orchestration.svg', alt: 'Multi-agent orchestration', tag: 'Orchestration' },
  { src: '/icons/nl3/feat/deploy.svg', alt: 'One-click deploy', tag: 'Deployment' },
  { src: '/icons/nl3/feat/api.svg', alt: 'API connections', tag: 'Connections' },
] as const;

/** @deprecated Prefer FEATURE_ICONS */
export const FEATURE_IMAGES = [
  {
    src: '/images/services/ai_agent_working_autonomously.png',
    alt: 'Custom AI agents',
    tag: 'Agents',
  },
  {
    src: '/images/services/multiple_ai_agents_collaborating.png',
    alt: 'Multi-agent orchestration',
    tag: 'Orchestration',
  },
  {
    src: '/images/services/one-click_launch_deployment.png',
    alt: 'One-click deploy',
    tag: 'Deployment',
  },
  {
    src: '/images/services/scalable_api_network_connections.png',
    alt: 'API connections',
    tag: 'Connections',
  },
] as const;

export const HERO_IMAGES = {
  robot: '/robot.png',
  place: '/placee.png',
  glow: '/topLight.png',
  logo: '/logo3.png',
} as const;

export const SHIFT_IMAGES = {
  manifesto: '/images/services/ai_automation_building_solutions.png',
  transform: '/images/services/workflow_instant_transformation.png',
} as const;

export const WORKFLOW_IMAGES = {
  neural: '/images/services/ai_neural_network_decision_making.png',
} as const;
