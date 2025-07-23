import Header from '@/components/Header/Header';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import Footer from '@/components/Footer/Footer';
import { Container, Mark, Text, Title } from '@mantine/core';
import classes from './homepage.module.css'
export default function HomePage() {
  return (
    <>
      <Header/>
      <ColorSchemeToggle />

      <Container size="md">

        <Title className={classes.title}>
<Mark pl="5px" color='yellow' p="sm" className={classes.mark}>
          Johnny {"\n"}</Mark>
          
          <Mark pl="5px" p="sm" className={classes.mark}>Customs{"  "}
          </Mark></Title>

<Container pt="xl" size="xl">

<Text className={classes.description}>
  Welcome to the Customs Pain Center. The home for all your pain regarding import taxes, customs, and shipping fees.
</Text>
</Container>

      </Container>
      <Footer />

    </>
  );
}
