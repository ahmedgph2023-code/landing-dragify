/**
 * NL3 footer — brand + particle D portal + 4-col nav matching footer-section-ref.
 */

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { BrandLogo, useContent } from '../../new-landing/shared';
import FooterPortalCanvas from './FooterPortalCanvas';

const HREFS = {
  product: ['#features', '#agents', '#integrations', '/pricing'],
  company: ['/resources/blog', '/contact', '/resources/changelog'],
  resources: ['https://docs.dragify.ai/', '/resources/security', '/resources/integrations'],
  legal: ['/terms', '/privacy', '/refund'],
} as const;

const EXTERNAL: Record<string, boolean[]> = {
  product: [false, false, false, false],
  company: [false, false, false],
  resources: [true, false, false],
  legal: [false, false, false],
};

const COL_KEYS = ['product', 'company', 'resources', 'legal'] as const;

const COL_ICONS: Record<(typeof COL_KEYS)[number], ReactNode> = {
  product: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
      <circle cx="6" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="18" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="18" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 11.2 16 7.2M8 12.8l8 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  company: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16" cy="9.5" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4.5 18.5c.6-2.6 2.6-4 4.5-4s3.9 1.4 4.5 4M13.2 15.2c1.2-.5 2.6-.4 3.8.8.7.7 1.1 1.6 1.3 2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  resources: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
      <path
        d="M5 5.5h9.5A2.5 2.5 0 0 1 17 8v11.5H7.5A2.5 2.5 0 0 1 5 17V5.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M8 9h6.5M8 12.5H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  legal: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
      <path d="M12 3.5v14M7 7.5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7 7.5 4.5 14h5L7 7.5ZM17 7.5 14.5 14h5L17 7.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 19.5h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
};

const LINK_ICONS: Record<(typeof COL_KEYS)[number], ReactNode[]> = {
  product: [
    <svg key="wf" viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <rect x="2" y="3" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="9" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 5h2.5V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>,
    <svg key="ag" viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <rect x="4" y="5" width="8" height="7" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="6.5" cy="8" r="0.9" fill="currentColor" />
      <circle cx="9.5" cy="8" r="0.9" fill="currentColor" />
      <path d="M8 2.8v2.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>,
    <svg key="in" viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6 8h4" stroke="currentColor" strokeWidth="1.3" />
    </svg>,
    <svg key="pr" viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <path d="M3 12.5 8 3.5l5 9" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M5.2 9.5h5.6" stroke="currentColor" strokeWidth="1.3" />
    </svg>,
  ],
  company: [
    <svg key="bl" viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <path d="M3.5 3.5h9v9H6L3.5 10V3.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6 6.5h4M6 9h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>,
    <svg key="ct" viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <rect x="2.5" y="3.5" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.8 4.2 8 8.2l5.2-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>,
    <svg key="ch" viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <path d="M4 3.5h8v9H4z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6 6.5h4M6 9h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>,
  ],
  resources: [
    <svg key="dc" viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <path d="M4 2.8h5.2L12 5.6V13.2H4V2.8Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M9 2.9v2.8H12" stroke="currentColor" strokeWidth="1.3" />
    </svg>,
    <svg key="sc" viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <path d="M8 2.5 12.5 4.5v3.2c0 2.8-1.9 4.8-4.5 5.8-2.6-1-4.5-3-4.5-5.8V4.5L8 2.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>,
    <svg key="ri" viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <circle cx="5" cy="6" r="2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="11" cy="10" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6.7 7.2 9.3 8.8" stroke="currentColor" strokeWidth="1.3" />
    </svg>,
  ],
  legal: [
    <svg key="tm" viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <path d="M4 3.5h8M8 3.5v9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>,
    <svg key="pv" viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <rect x="4" y="7" width="8" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6 7V5.5a2 2 0 0 1 4 0V7" stroke="currentColor" strokeWidth="1.3" />
    </svg>,
    <svg key="rf" viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <path d="M4 8a4 4 0 1 0 1.2-2.9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M4 3.8v2.6h2.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
  ],
};

export default function NL3Footer() {
  const { c } = useContent();
  const year = new Date().getFullYear();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const tagline = String(c('footer.tagline') || '');
  const taglineHtml = tagline
    .replace(/(all builders\.?)/i, '<span class="nl3f-mark">$1</span>')
    .replace(/(كل صانع\.?)/, '<span class="nl3f-mark">$1</span>');

  return (
    <footer className="nl3f">
      <div className="nl3f-portal" aria-hidden>
        <FooterPortalCanvas reducedMotion={reducedMotion} />
      </div>

      <div className="nl3f-inner">
        <div className="nl3f-top">
          <div className="nl3f-brand">
            <BrandLogo height={38} />
            <p className="nl3f-tagline" dangerouslySetInnerHTML={{ __html: taglineHtml }} />
            <div className="nl3f-socials">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.75 3H20.82l-6.7 7.66L22 21H15.83l-4.83-6.32L5.46 21H2.4l7.17-8.19L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.24h1.7L7.4 4.7H5.58l11.09 14.54Z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/dragifyai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.5 18.5h-3v-9h3v9ZM7 8.4A1.5 1.5 0 1 1 7 5.4a1.5 1.5 0 0 1 0 3ZM18.5 18.5h-3v-4.6c0-.93-.53-1.4-1.2-1.4-.67 0-1.3.57-1.3 1.4v4.6h-3v-9h3v1.47c.33-.79 1.3-1.67 2.5-1.67 1.58 0 3 1.33 3 3.47v5.73Z" />
                </svg>
              </a>
              <a href="https://github.com/Cloudilic" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 1.27C5.99 1.27 1.05 6.22 1.05 12.22c0 4.8 3.19 8.88 7.62 10.31.54.1.74-.22.74-.49 0-.25-.01-1.02-.01-1.93-3.2.62-3.84-1.44-3.84-1.44-.49-1.26-1.23-1.58-1.23-1.58-1-.66.08-.65.08-.65 1.1.08 1.68 1.11 1.68 1.11.99 1.62 2.56 1.17 3.35.9.1-.68.4-1.13.73-1.38-2.56-.26-5.25-1.16-5.25-5.32 0-1.19.43-2.17 1.19-2.94-.11-.26-.49-1.34.1-2.8 0 0 .94-.27 3.18 1.23.84-.23 1.74-.34 2.63-.35.89.01 1.78.12 2.63.35 2.23-1.5 3.17-1.23 3.17-1.23.59 1.46.21 2.54.1 2.8.76.77 1.19 1.75 1.19 2.94 0 4.17-2.7 5.06-5.27 5.31.42.33.79.98.79 1.97 0 1.43-.02 2.67-.02 3.01 0 .27.2.59.75.48 4.43-1.42 7.61-5.5 7.61-10.3C22.96 6.22 18.02 1.27 12 1.27Z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="nl3f-cols">
            {COL_KEYS.map((key) => {
              const col = c(`footer.columns.${key}`) as { title: string; links: string[] };
              if (!col?.links) return null;
              return (
                <div key={key} className="nl3f-col">
                  <div className="nl3f-col-head">
                    <span className="nl3f-col-ico">{COL_ICONS[key]}</span>
                    <h4 className="nl3f-col-title">{col.title}</h4>
                    <span className="nl3f-col-rule" aria-hidden />
                  </div>
                  <ul>
                    {col.links.map((label: string, i: number) => {
                      const href = HREFS[key][i];
                      const external = EXTERNAL[key][i];
                      const icon = LINK_ICONS[key][i];
                      return (
                        <li key={label}>
                          <span className="nl3f-link-ico">{icon}</span>
                          {external ? (
                            <a href={href} target="_blank" rel="noopener noreferrer">
                              {label}
                            </a>
                          ) : (
                            <Link href={href}>{label}</Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className="nl3f-bottom">
          <div className="nl3f-copy">
            <span className="nl3f-mini-mark" aria-hidden>
              <Image src="/logo3.png" alt="" width={22} height={22} style={{ objectFit: 'contain' }} />
            </span>
            <span>
              © {year} <BrandLogo height={14} /> {c('footer.copyright')}
            </span>
          </div>

          <div className="nl3f-legal">
            <Link href="/terms">{c('footer.bottom.terms')}</Link>
            <span aria-hidden>·</span>
            <Link href="/privacy">{c('footer.bottom.privacy')}</Link>
            <span aria-hidden>·</span>
            <Link href="/refund">{c('footer.bottom.refunds')}</Link>
          </div>

          <a
            className="nl3f-arrow"
            href="https://calendly.com/cloudilic"
            target="_blank"
            rel="noreferrer"
            aria-label="Book consultation"
          >
            <span className="nl3f-arrow-ring" aria-hidden />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 12h12M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
