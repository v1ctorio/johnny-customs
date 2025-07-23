import { Button, Container, Group, Stack, Text, Title } from "@mantine/core";
import { ETable } from "./components/ETable/ETable";

export default function ExperiencesPage(){
    return <Container>
        <Stack gap="xl">

        <Group justify="space-between">
            <Title>Experiences</Title>
            <a href="/experiences/add"><Button>Add my experience</Button></a>
        </Group>
    <ETable />
        </Stack>

    </Container>
}