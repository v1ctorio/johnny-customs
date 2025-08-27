'use client';

import { Button, Group, useMantineColorScheme } from '@mantine/core';
import styles from './ColorSchemeToggle.module.css'
export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();

  return (
    <Group justify="right" pr="40px" mt="xl" className={styles.toggle}>
      <Button onClick={() => setColorScheme('light')}>Light</Button>
      <Button onClick={() => setColorScheme('dark')}>Dark</Button>
      <Button onClick={() => setColorScheme('auto')}>Auto</Button>
    </Group>
  );
}
