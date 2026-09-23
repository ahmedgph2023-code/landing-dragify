/**
 * Targets for classic-home sections only.
 */

import type { ParticleTarget } from '../types';
import type { ParticleStateId } from '../../../config/newLanding3Scene';
import { buildAgentsTarget } from './agentsSectionAnimation';
import { buildFaqTarget } from './faqSectionAnimation';
import { buildFeaturesTarget } from './featuresSectionAnimation';
import {
  buildHeroTarget,
  buildHeroNodeTarget,
  buildHeroChainTarget,
  buildHeroFlowTarget,
} from './heroSectionAnimation';
import { buildHowTarget } from './howSectionAnimation';
import { buildIntegrationsTarget } from './integrationsSectionAnimation';
import { buildDissolveTarget, buildTransitionTarget } from './morphBridgeAnimation';
import { buildPartnersTarget } from './partnersSectionAnimation';
import { buildStatsTarget } from './statsSectionAnimation';

export type SectionTargets = Record<ParticleStateId, ParticleTarget>;

export async function buildAllSectionTargets(count: number): Promise<SectionTargets> {
  const [
    hero,
    heroNode,
    heroChain,
    heroFlow,
    partners,
    features,
    agents,
    integrations,
    stats,
    how,
    faq,
    dissolve,
    transition,
  ] = await Promise.all([
    buildHeroTarget(count),
    buildHeroNodeTarget(count),
    buildHeroChainTarget(count),
    buildHeroFlowTarget(count),
    buildPartnersTarget(count),
    buildFeaturesTarget(count),
    buildAgentsTarget(count),
    buildIntegrationsTarget(count),
    buildStatsTarget(count),
    buildHowTarget(count),
    buildFaqTarget(count),
    Promise.resolve(buildDissolveTarget(count)),
    Promise.resolve(buildTransitionTarget(count)),
  ]);

  return {
    hero,
    heroNode,
    heroChain,
    heroFlow,
    partners,
    features,
    agents,
    integrations,
    stats,
    how,
    faq,
    dissolve,
    transition,
  };
}

export { HERO_SECTION } from './heroSectionAnimation';
export { MORPH_BRIDGE } from './morphBridgeAnimation';
export { NL3_SECTIONS, type Nl3SectionId } from './registry';
export * from './homeAssets';
