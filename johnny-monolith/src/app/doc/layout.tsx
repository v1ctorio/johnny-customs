import { AppShell,  } from "@mantine/core";

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

{children}
	

		</AppShell>
	);
}