import type { NextPage } from 'next';
import ImmersiveHome from '../components/immersive-home/ImmersiveHome';

/**
 * Immersive scroll-driven homepage experience (moved off `/`).
 * Original classic home is restored at `/`.
 * See docs/landing-3d-animation.md
 */
const NewLanding4: NextPage = () => {
  return <ImmersiveHome />;
};

export default NewLanding4;
