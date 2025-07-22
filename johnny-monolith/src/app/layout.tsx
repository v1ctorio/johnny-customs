import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';



import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { theme } from '../../theme';
import { SessionProvider } from 'next-auth/react';

export const metadata = {
  title: 'Johhny Customs',
  description: 'The Hack Club next.js taxes helper!',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
        <SessionProvider >
          {children}
          </SessionProvider>        
        </MantineProvider>          
      </body>
    </html>
  );
}
