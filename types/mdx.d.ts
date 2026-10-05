/**
 * Named-export declarations for blog MDX modules (merges with @types/mdx's
 * default-export wildcard declaration).
 */
declare module '*.mdx' {
  export const meta: {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    cover: string;
    author: string;
    category: string;
    readingMinutes: number;
  };
}
