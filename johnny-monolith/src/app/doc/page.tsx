import Header from "@/components/Header/Header";
import { AppShellHeader, AppShellMain, AppShellNavbar, Text, Title } from "@mantine/core";
import DocNavBar from "./NavBar/NavBar";
import { pages } from "./[slug]/page";

export default async function Page(){


		return <>
				<AppShellHeader>
				<Header/>
			</AppShellHeader>
			
			<AppShellNavbar>
				<DocNavBar active="main" countries={pages}/>
			</AppShellNavbar>

			<AppShellMain
			>

			<>
			<Title>Per-country documentation</Title>
			<Text>Welcome to Johnny-customs docs. These are tips and info regarding customs in your country. Pick your country on the left navbar</Text>
			</>
						</AppShellMain>
						</>
}