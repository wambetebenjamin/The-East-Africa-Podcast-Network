'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

/**
 * AOS-equivalent scroll reveal, reproducing the zip's AOS.init
 * ({ duration: 800, easing: 'slide', once: true }).
 * Supports staggered children via `stagger` (ms between siblings).
 * Spec staggers: show cards 75ms, episode rows 50ms.
 * Honours prefers-reduced-motion via globals.css.
 */
export default function Reveal({
  children,
  variant = 'fade-up',
  delay = 0,
  stagger = 0,
  className = '',
  as: Tag = 'div',
  once = true,
  style,
}: {
  children: ReactNode;
  variant?: 'fade-up' | 'fade' | 'fade-left' | 'fade-right' | 'zoom';
  delay?: number;
  /** ms between staggered direct children */
  stagger?: number;
  className?: string;
  as?: 'div' | 'section' | 'ul' | 'li' | 'article' | 'header';
  once?: boolean;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets: HTMLElement[] = stagger
      ? Array.from(root.children) as HTMLElement[]
      : [root];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove('revealed');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => {
      if (stagger) el.setAttribute('data-reveal', variant);
      el.style.setProperty('--reveal-delay', `${delay}ms`);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [variant, delay, stagger, once]);

  if (stagger) {
    return (
      <Tag ref={ref as never} className={className} style={style} data-reveal-group>
        {children}
      </Tag>
    );
  }

  return (
    <Tag ref={ref as never} className={className} style={style} data-reveal={variant}>
      {children}
    </Tag>
  );
}
