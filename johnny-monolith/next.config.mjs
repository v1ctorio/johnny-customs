import bundleAnalyzer from '@next/bundle-analyzer';
import rehypeSlug from 'rehype-slug';

import createMdx from '@next/mdx';
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withMDX = createMdx({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [rehypeSlug],
  },
  experimental: {
    mdxRs: true
  }
});

export default withMDX(withBundleAnalyzer({
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
}));
