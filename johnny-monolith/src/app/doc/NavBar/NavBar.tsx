"use client";


import {
  IconLogout,
} from '@tabler/icons-react';
import { Code, Group } from '@mantine/core';
import classes from './NavBar.module.css';
import { countryData } from '../[slug]/page';



export default function DocNavBar({active, countries}: {active: string, countries: countryData[]}) {




  const links = countries.map((item) => (
    <a
      className={classes.link}
      data-active={item.country_code === active || undefined}
      href={`/doc/${item.country_code}`}
      key={item.country_code}

    >
      <p className={classes.linkFlag}style={{fontSize:"200"}}>{item.flag}</p>
      <span>{item.country_full_name}</span>
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