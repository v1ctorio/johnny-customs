'use client'

import { SlackUserButton } from "@/app/experiences/components/SlackUserButton/SlackUserButton";
import { countriesData, thingsTable } from "@/db/schema";
import { Box, Button,Group,InputWrapper, NativeSelect, NumberInput, Select, Space, Stack, Text, Textarea, TextInput, UnstyledButton } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import classes from './AddExpForm.module.css'
import { DatePickerInput } from "@mantine/dates";
import { useSession,signIn } from "next-auth/react";

export function AddExpForm({submitterID}:{submitterID:string}) {


	const [thingsList,setThingsList] = useState<{label:string,value:string}[]>([])
	const [CD,setCD] = useState<typeof countriesData.$inferSelect[]>([])

		const { data: session } = useSession()
	
	const [submitNewItem, setSubmitNewItem] = useState(false)

	const isLoggedIn = !!session
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
				thing_id: "",
				thing_name: "",
				country: "",
				declared_value: 0,
				paid_customs: 0,
				payment_date: null,
				notes: ""
			},
			validate: {
				thing_name: t=> !submitNewItem ? null : t === "" ? "Thing can't be empty" : t.length>64 ? "Thing name must be shorter than 64 characters.": null,
				thing_id: t=> submitNewItem ? null : t === "" ? "Thing can't be empty" : t.length>34 ? "Thing name can't be longer than 32 characters.": null,
				payment_date: d => d != null ? isNaN(new Date(d as unknown as string).getTime()) ? "Invalid date provided" : null : "Date of payment can't be empty",
			  country: c=>c.length !== 2 ? "Invalid country provided": null,
				declared_value: n=>isNaN(n) ? "Invalid amount": null,
				paid_customs: n=>isNaN(n) ? "Invalid amount": null
			},

		})


		const [currencyValue, setCurrencyValue] = useState("AFN")

form.watch('country',({value})=>{

	setCurrencyValue(CD.find(c=>c.iso3316_1a2 === value)?.iso4217 || "")
})

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
		fetch('/api/submissions/new',{body:JSON.stringify({...values, create_new_thing: submitNewItem}),method:"POST"})
  };

	return(
					<Stack w={800}>

			<form onSubmit={form.onSubmit(handleSubmit)}>
				

					{submitNewItem ? manualThingInput() : selectThingInput()}


				{countryAndMoneyGroup()}

				{paymentDateInput()}
					
				{notesInput()}

				<Space h="md"/>

				<Group justify="space-between" align="center">

				{submittingAsCard()}
				<Button disabled={!session} size="md" type="submit">Submit</Button>
				</Group>

			</form>
			</Stack>
	)

	function countryAndMoneyGroup() {
		return <Group className={classes.countrymoneygrp}>
			<NativeSelect disabled={!isLoggedIn} classNames={{ input: classes.input, label: classes.label }} withAsterisk maw={150} label="Country" data={CD.map(c => { return { label: c.full_name, value: c.iso3316_1a2 }; })} key={form.key('country')} {...form.getInputProps('country')} />

			<NumberInput disabled={!isLoggedIn} withAsterisk decimalScale={2} allowNegative={false} classNames={{ label: classes.label, input: classes.ninput }} label="Declared value" suffix={' ' + currencyValue} key={form.key('declared_value')} {...form.getInputProps('declared_value')} />
			<NumberInput disabled={!isLoggedIn} withAsterisk decimalScale={2} allowNegative={false} classNames={{ label: classes.label, input: classes.ninput }} label="Paid fees" suffix={' ' + currencyValue} key={form.key('paid_customs')} {...form.getInputProps('paid_customs')} />
			<TextInput style={{marginLeft:"auto",marginRight:"0px"}} classNames={{ label: classes.label }} disabled variant="filled" label="Currency" styles={{ input: { textAlign: "center" } }} value={currencyValue} maw="70px" /*Is client display only. It's not sent to the server since it's assumed there*/ />

		</Group>;
	}

	function notesInput() {
		return <Textarea disabled={!isLoggedIn} classNames={{ label: classes.label }} label="Notes" description="Additional notes that could be useful for other hackclubbers. (optional)" key={form.key('notes')} {...form.getInputProps('notes')} />;
	}

	function paymentDateInput() {
		return <DatePickerInput disabled={!isLoggedIn} label="Date of payment" description="Date in which you paid the fees." key={form.key('payment_date')} {...form.getInputProps('payment_date')} classNames={{ label: classes.label }} />;
	}

	function selectThingInput() {
		return <><Select disabled={!isLoggedIn} clearable autoSelectOnBlur searchable classNames={{ label: classes.label }} label="Thing" withAsterisk description="Item you paid customs for." data={thingsList} key={form.key('thing_id')} {...form.getInputProps('thing_id')} />
			<Text size="xs">The item you recived is not in the list?
				<Text span c="blue" style={{ "cursor": "pointer" }} onClick={() => setSubmitNewItem(true)}> Click here to add a new one</Text>
				.</Text></>;
	}

	function manualThingInput() {
		return <><TextInput disabled={!isLoggedIn} variant="filled" label="Thing" description="Item you paid customs for." classNames={{ label: classes.label, input: classes.input+' '+classes.warning }} withAsterisk key={form.key('thing_name')} {...form.getInputProps('thing_name')} />

			<Text size="xs" c="orange">Are you sure the item you recived is not on the list?
				<Text span c="blue" style={{ "cursor": "pointer" }} onClick={() => setSubmitNewItem(false)}> Click here to see the list again</Text>
				.</Text>
		</>;
	}

	function submittingAsCard() {
		// eslint-disable-next-line curly
		if (isLoggedIn) return <InputWrapper label="Submitting as" classNames={{ label: classes.label }}>
			<Box className={classes.subbox}>
				<SlackUserButton innerPadding="sm" uID={submitterID} className={classes.sub} />
			</Box>
		</InputWrapper>;
		return <InputWrapper label="Submitting as" classNames={{ label: classes.label }}> <Box className={classes.subbox}><UnstyledButton p="sm" onClick={()=>signIn("slack")} className={classes.sub} style={{display:"block",width:"100%"}}><Text size="xs">
			Log-in with <b>Slack</b> to be able to submit your experience.
			</Text></UnstyledButton></Box></InputWrapper>
	}
}