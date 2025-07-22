'use client'

import { SlackUserButton } from "@/app/experiences/components/SlackUserButton/SlackUserButton";
import { submissionsTable, thingsTable } from "@/db/schema";
import { Box, Flex, Input, InputWrapper, NativeSelect, Stack, Textarea, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

export function AddExpForm({submitterID}:{submitterID:string}) {
	type submitData = typeof submissionsTable.$inferInsert
	const [thingsList,setThingsList] = useState<{label:string,value:string}[]>([])
	const theme = useMantineTheme()
	useEffect(()=>{
		fetch('/api/things')
		.then(a=>a.json())
		.then((a:typeof thingsTable.$inferSelect[])=>{
			setThingsList(a.map(t=>{
				return {
					label:t.name,
					value: t.id
				}
			}))
		})
	},[])
		const form = useForm()
	return(
					<Stack w={800}>

			<form>
				<NativeSelect label="Thing" withAsterisk description="Item you paid customs for." data={thingsList} key={form.key('thing_id')}/>
				<Textarea label="Notes" description="Additional notes. (optional)" key={form.key('notes')}/>
				<InputWrapper label="Submitting as">
				<Box p='sm'>
				<SlackUserButton uID={submitterID} styles={{'root':{'backgroundColor':theme.colors.dark[4],'borderRadius':'10px', padding:''}}} />
				</Box>

				</InputWrapper>
			</form>
			</Stack>
	)
}