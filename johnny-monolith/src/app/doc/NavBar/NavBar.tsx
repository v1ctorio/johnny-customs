"use client";

interface countryData {
  country_full_name: string;
  ID_name: string;
  country_code: string;
  currency: string;
  flag: string;
}



async function fetchAviableCountries(): countryData[] {
  "use server";

  
  
}

import {
  IconLogout,
} from '@tabler/icons-react';
import { Code, Group } from '@mantine/core';
import classes from './NavBar.module.css';
import { usePathname } from 'next/navigation'
import { fstat } from 'fs';
import { GetStaticProps } from 'next';

const data = [
  { link: '', label: 'Main', flag: "" },
  { link: '', label: 'Spain', flag: '🇪🇸',  },
  { link: '', label: 'United Kingdom', flag: '🇬🇧',  },
  { link: '', label: 'Italy', flag: '🇮🇹',  },
  { link: '', label: 'Romania', flag: '🇷🇴',  },
  { link: '', label: 'Australia', flag: '🇦🇺',  },
  { link: '', label: 'Germany', flag: '🇩🇪',  },
];

const countries = fetchAviableCountries

export default function DocNavBar() {


  const activePage = usePathname().split('/')[2]


  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === activePage || undefined}
      href={item.link}
      key={item.label}

    >
      <p className={classes.linkFlag}style={{fontSize:"200"}}>{item.flag}</p>
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Code fw={700}>v3.1.2</Code>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>

        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}