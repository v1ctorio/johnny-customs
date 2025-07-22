'use client'

import { SlackUserButton } from "@/app/experiences/components/SlackUserButton/SlackUserButton";
import { countriesData, countriesData, countriesData, submissionsTable, thingsTable } from "@/db/schema";
import { Autocomplete, Box, Button, Flex, Group, Input, InputWrapper, NativeSelect, Select, Stack, Text, Textarea, TextInput, UnstyledButton, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useMemo, useState } from "react";
import classes from './AddExpForm.module.css'
import { DateInput, DatePickerInput } from "@mantine/dates";

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
	const [CD,setCD] = useState<typeof countriesData.$inferSelect[]>([])

	const [submitNewItem, setSubmitNewItem] = useState(false)

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

		fetch('/api/countriesData')
		.then(r=>r.json())
		.then(r=>{
			setCD(r)
		})
	},[])
		const form = useForm({
			mode: "uncontrolled",
			initialValues: {
				thing: "",
				country: "",
				payment_date: null,
				notes: ""
			},
			validate: {
				thing: t=> t === "" ? "Thing can't be empty" : t.length>64 ? "Thing name should be shorter than 64 characters.": null,
				payment_date: d => d != null ? isNaN(new Date(d as unknown as string).getTime()) ? "Invalid date provided" : null : "Date of payment can't be empty",
			  country: c=>c.length !== 2 ? "Invalid country provided": null
			}
		})


		const [currencyValue, setCurrencyValue] = useState("")

form.watch('country',({value})=>{

	setCurrencyValue(CD.find(c=>c.iso3316_1a2 === value)?.iso4217 || "")
})

	return(
					<Stack w={800}>

			<form onSubmit={form.onSubmit((values) => console.log(values))}>
				

					{submitNewItem ? manualThingInput() : selectThingInput()}


				<Group className={classes.countrymoneygrp}>
					<NativeSelect maw={180} label="Country" classNames={{label:classes.label}}  data={CD.map(c=>{return {label:c.full_name,value:c.iso3316_1a2}})} key={form.key('country')} {...form.getInputProps('country')}/>
				<TextInput disabled variant="filled" label="Currency" value={currencyValue} /*Is client display only. It's not sent to the server since it's assumed there*//>
				</Group>

				{paymentDateInput()}
					
				{notesInput()}

				<Group justify="space-between" align="center">

				{submittingAsCard()}
				<Button size="md" type="submit">Submit</Button>
				</Group>

			</form>
			</Stack>
	)

	function notesInput() {
		return <Textarea classNames={{ label: classes.label }} label="Notes" description="Additional notes that could be useful for other hackclubbers. (optional)" key={form.key('notes')} {...form.getInputProps('notes')} />;
	}

	function paymentDateInput() {
		return <DatePickerInput label="Date of payment" description="Date in which you paid the fees." key={form.key('payment_date')} {...form.getInputProps('payment_date')} classNames={{ label: classes.label }} />;
	}

	function selectThingInput() {
		return <><Select clearable autoSelectOnBlur searchable classNames={{ label: classes.label }} label="Thing" withAsterisk description="Item you paid customs for." data={thingsList} key={form.key('thing_id')} {...form.getInputProps('thing')} />
			<Text size="xs">The item you recived is not in the list?
				<Text span c="blue" style={{ "cursor": "pointer" }} onClick={() => setSubmitNewItem(true)}> Click here to add a new one</Text>
				.</Text></>;
	}

	function manualThingInput() {
		return <><TextInput variant="filled" label="Thing" description="Item you paid customs for." classNames={{ label: classes.label, input: classes.input }} withAsterisk key={form.key('thing')} {...form.getInputProps('thing')} />

			<Text size="xs" c="orange">Are you sure the item you recived is not on the list?
				<Text span c="blue" style={{ "cursor": "pointer" }} onClick={() => setSubmitNewItem(false)}> Click here to see the list again</Text>
				.</Text>
		</>;
	}

	function submittingAsCard() {
		return <InputWrapper label="Submitting as" classNames={{ label: classes.label }}>
			<Box className={classes.subbox}>
				<SlackUserButton uID={submitterID} className={classes.sub} />
			</Box>
		</InputWrapper>;
	}
}