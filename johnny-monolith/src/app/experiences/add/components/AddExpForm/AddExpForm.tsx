'use client'

import { SlackUserButton } from "@/app/experiences/components/SlackUserButton/SlackUserButton";
import { submissionsTable, thingsTable } from "@/db/schema";
import { Autocomplete, Box, Flex, Input, InputWrapper, NativeSelect, Select, Stack, Text, Textarea, UnstyledButton, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

export function AddExpForm({submitterID}:{submitterID:string}) {
	type submitData = {
    payment_date: string;
    submitter: string;
    country: string;
    declared_value: number;
    paid_customs: number;
    thing_id: string;
    submission_time?: Date | undefined;
    approved?: boolean | undefined;
    notes?: string | null | undefined;
}

	type submitData = typeof submissionsTable.$inferInsert
	const [thingsList,setThingsList] = useState<{label:string,value:string}[]>([])

	const [submitNewItem, setSubmitNewItem] = useState(false)

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
				<Select clearable auto label="Thing" withAsterisk description="Item you paid customs for." data={thingsList} key={form.key('thing_id')}/>
				{!submitNewItem && <Text size="xs">The item you recived is not in the list? <Text span c="blue" style={{"cursor":"pointer"}} onClick={()=> setSubmitNewItem(true) }>Click here to add a new one</Text>.</Text>}
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