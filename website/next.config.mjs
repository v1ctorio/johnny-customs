import { createMDX } from 'fumadocs-mdx/next';
import { init } from 'shrimple-env';

await init({
	envFiles: ['../.env']
});

const SUBMISSIONS_API_URL = (process.env.SUBMISSIONS_API_URL || 'http://localhost:3000').replace(/^['"](.+)['"]$/, '$1');

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
};

const rewrites = async () => {
  return [
    {
      source: '/api/:path*',
      destination: `${SUBMISSIONS_API_URL}/:path*`,
    },
  ];
};

export default withMDX({
  ...config,
  async rewrites() {
    return await rewrites();
  },
});
