// YES, you need to hardcode the JSON in here and data is duplicated, YES you techincally could do this with file based routing and frontmatter. 
// I have been trying for an hour and haven't managed to do it efficiently so I'm going to focus on other stuff.

import Header from "@/components/Header/Header";
import { AppShellHeader, AppShellMain, AppShellNavbar } from "@mantine/core";
import DocNavBar from "../NavBar/NavBar";
import {pages} from "../pages"

export interface countryData {
  country_full_name: string; // Country full name in the native language and script. If more than one or doubt, fallback to english name 
  country_code: string; // ISO 3166-1 A-2 country code (es, us, uk, ar...) https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes
	currency: string; // ISO 4271 mainly used currency code https://en.wikipedia.org/wiki/ISO_4217#Active_codes_(list_one)
  flag: string; // Country national flag https://emojipedia.org/flags
}





export async function generateStaticParams() {

	return pages.map(c => ({
		slug: c.country_code
	}))
	
}

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
				<DocNavBar active={slug} countries={pages as any}/>
			</AppShellNavbar>

			<AppShellMain 
			>

                <CountryDocumentation/>
            </AppShellMain>
            </>
}
