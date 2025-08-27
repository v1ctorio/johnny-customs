'use client';
import {
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  ScrollArea,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';

import { useSession, signIn, signOut } from 'next-auth/react'

const butns = [
  {
    caption: "Documentation",
    href: "doc"
  }, 
  {
    caption: "Stats",
    href: "stats"
  },
  {
    caption: "Experiences",
    href: "experiences"
  }
]


export default function Header({active}:{active?:string} = {active:""}) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);


  const { data: session } = useSession()


  return (
    <Box pb={60}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">

<a href="/">
          <img alt='logo' height={30} width={30} src="/passc_yel_am.png" />

</a>

          <Group h="100%" gap={0} visibleFrom="sm">


            {butns.map(b => {
            
            return <a key={b.caption} href={`/${b.href}`} className={`${classes.link} ${active === b.href ? classes.activelink: ""}`}>{b.caption}</a>
            })}



          </Group>

          <Group visibleFrom="sm">
            
            { session?.user == null ?
             <Button variant="filled" onClick={()=>signIn("slack")}>Log in with Slack</Button>
             :
             <Button variant='light' onClick={()=> signOut()}>Log out {session.user?.name}</Button>}
            
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={<a href='/' style={{textDecoration:"none", color: "inherit"}}><Title order={1} size="xl">Johnny Customs</Title></a>}
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px" mx="-md">
          <Divider my="md" />

            { butns.map(b=>{
              return <a href={`/${b.href}`} className={classes.link}>{b.caption}</a>
            })}

          <Divider my="sm" />

          
 { session?.user == null ?
             <Button className={classes.mobilelogbutton} variant="filled" onClick={()=>signIn("slack")}>Log in with Slack</Button>
             :
             <Button className={classes.mobilelogbutton} variant='light' onClick={()=> signOut()}>Log out {session.user?.name}</Button>}
            

        </ScrollArea>
      </Drawer>
    </Box>
  );
}