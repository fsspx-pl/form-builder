import { ModalContainer, ModalProvider } from '@faceless-ui/modal';
import payload from 'payload';
import React from 'react';

import { MainMenu } from '@/payload-types';
import { CloseModalOnRouteChange } from '../../components/CloseModalOnRouteChange';
import { Header } from '../../components/Header';
import '../../css/app.scss';
import { GlobalsProvider } from '../../providers/Globals';
import { getPayloadHMR } from '@payloadcms/next/utilities';
import config from '@payload-config'

export const metadata = {
  description: 'An example of how to authenticate with Payload from a Next.js app.',
  title: 'Payload Auth + Next.js App Router Example',
}

async function getAllGlobals(): Promise<MainMenu> {
  try {
    const payload = await getPayloadHMR({ config })
    const mainMenu = await payload.findGlobal({
      slug: 'main-menu',
      depth: 1,
    });

    return mainMenu as MainMenu
  } catch (err) {
    console.error('HELLO MOTO');
    console.error('Error in getAllGlobals:', err);
    throw new Error('Failed to fetch global data');
  }
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const mainMenu = await getAllGlobals();

  return (
    <html lang="en">
      <body>
        <React.Fragment>
          <GlobalsProvider mainMenu={mainMenu}>
            <ModalProvider classPrefix="form" transTime={0} zIndex="var(--modal-z-index)">
              <CloseModalOnRouteChange />
              <Header />
              {/* <Component {...pageProps} /> */}
              {children}
              <ModalContainer />
            </ModalProvider>
          </GlobalsProvider>
        </React.Fragment>
      </body>
    </html>
  )
}
