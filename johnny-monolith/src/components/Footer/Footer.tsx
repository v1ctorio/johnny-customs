'use client';

import { IconBrandGithub, IconBrandSlack, } from '@tabler/icons-react';
import { ActionIcon, Container, Group, Text } from '@mantine/core';
import classes from './Footer.module.css';

export default function Footer() {
  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
				<Group gap={10} justify='flex-start' wrap='nowrap'>
          <img alt='logo' height={30} width={30} src="https://placecats.com/30/30" />
					<Text fw={600}> Made by Vic 4 Hack Club</Text>

				</Group>
        <Group w="200px" ml={"auto"}>
        
        <a href="https://hackclub.slack.com/archives/C07JZQHQDBP">
          <Group gap={0} className={classes.links} justify="flex-end" wrap="nowrap">

          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandSlack size={25} stroke={1.5} />
          </ActionIcon>
        </Group>


        </a>
                <a href="https://github.com/v1ctorio/johnny-customs">
          <Group gap={0} className={classes.links} justify="flex-end" wrap="nowrap">

          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandGithub size={25} stroke={1.5} />
          </ActionIcon>
        </Group>
        </a>
        </Group>

      </Container>
    </div>
  );
}