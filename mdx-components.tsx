import type { MDXComponents } from 'mdx/types';

/**
 * MDX components provider (Next.js convention).
 * Resolves the `next-mdx-import-source-file` alias so compiled MDX never
 * imports the client-only @mdx-js/react inside React Server Components.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
