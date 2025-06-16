// YES, you need to hardcode the JSON in here and data is duplicated, YES you techincally could do this with file based routing and frontmatter. 
// I have been trying for an hour and haven't managed to do it efficiently so I'm going to focus on other stuff.

import Header from "@/components/Header/Header";
import { AppShellHeader, AppShellMain, AppShellNavbar } from "@mantine/core";
import DocNavBar from "../NavBar/NavBar";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}){

	const {slug} = await params
	const {default: CountryDocumentation} = await import(`@/docs/countries/${slug}.mdx`)

    return <>
    		<AppShellHeader>
				<Header/>
			</AppShellHeader>
			
			<AppShellNavbar>
				<DocNavBar active="slug"/>
			</AppShellNavbar>

			<AppShellMain 
			>

                <CountryDocumentation/>
            </AppShellMain>
            </>
}

export const dynamicParams = false