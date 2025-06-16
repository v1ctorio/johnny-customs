import { AppShell, AppShellHeader, AppShellMain, AppShellNavbar } from "@mantine/core";
import DocNavBar from "./NavBar/NavBar";
import Header from "@/components/Header/Header";

export default function DocLayout({
	children,
}: {
	children: any;
}) {

	return (
		<AppShell
		padding="xl"
		header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', }}
		>

			<AppShellHeader>
				<Header/>
			</AppShellHeader>
			
			<AppShellNavbar>
				<DocNavBar active="Main" />
			</AppShellNavbar>

			<AppShellMain 
			>{children}</AppShellMain>

		</AppShell>
	);
}