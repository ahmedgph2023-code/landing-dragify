/**
 * Section-2 scroll-morph package — Studio NL3 export.
 * Source: public/icons/nl3/particle/section-2
 * Install:  components/particle-scroll-morph/
 * Asset:    /icons/nl3/particle/section-2/assets/form-a.png
 */
import type { NextPage } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ScrollMorphHero = dynamic(
  () => import('../components/particle-scroll-morph/ScrollMorphHero'),
  { ssr: false },
);

const ParticleSection2Page: NextPage = () => {
  const [progress, setProgress] = useState(0.35);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, window.scrollY / max)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Head>
        <title>Dragify — Particle Section 2 (Scroll Morph)</title>
        <meta name="theme-color" content="#050506" />
      </Head>
      <main style={{ background: '#050506', minHeight: '220vh' }}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100%',
          }}
        >
          <ScrollMorphHero
            progress={progress}
            src="/icons/nl3/particle/section-2/assets/form-a.png"
          />
        </div>
      </main>
    </>
  );
};

export default ParticleSection2Page;
