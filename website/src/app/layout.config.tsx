import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <img
        src="https://cloud-2lknei65b-hack-club-bot.vercel.app/0johnny.jpg"
        style={{height:32,width:'auto'}}
        />
          <circle cx={12} cy={12} r={12} fill="currentColor" />
        Johnny customs
      </>
    ),
  },
  links: [
    {
      text: 'Documentation',
      url: '/docs',
      active: 'nested-url',
    },
    {
      text: 'Slack channel',
      url: 'https://hackclub.slack.com/archives/C07JZQHQDBP'
    }
  ],
};
