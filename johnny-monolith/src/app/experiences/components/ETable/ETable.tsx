"use client"

import classes from './ETable.module.css';
import { APISubmission } from "@/app/lib/submissions";
import { Group, NumberFormatter, Pagination, SegmentedControl, Skeleton, Stack, Table, TableScrollContainer, TableTbody, TableTd, TableTh, TableThead, TableTr, Tooltip, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { SlackUserButton } from '../SlackUserButton/SlackUserButton';
import { IconNotes } from '@tabler/icons-react';


const fiftinData: APISubmission[] = new Array(15)


export function ETable(){

  const [data, setData] = useState(fiftinData)
  const [isLoading, setIsLoading] = useState(true)
  const [activePage, setActivePage] = useState(1)
  const [count, setCount] = useState(0)
  const [selectedCurrency, setCurrency] = useState('USD')

  const theme = useMantineTheme()

  useEffect(()=>{
    fetch(`/api/submissions?page=${activePage}`)
    .then(r => {
        if (!r.ok) {
            throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
    })
      .then(d=>{
        setData(d.submissions)
        setCount(Math.ceil(d.total / 15 ))
        setIsLoading(false)
      })
      .catch(e=>{
        console.error("Error fetching submissions:",e)
     //   alert("Error fetching submissions. Try to log-in with slack first: "+e.message)
      })
  },[activePage])

    const rows = data.map(r=>{
     return <TableTr key={r.id}>
        <TableTd>{r.id}</TableTd>
        <Tooltip label={r.country_full_name}><TableTd>{r.country}</TableTd></Tooltip>
        <TableTd >{r.thing} {r.notes && <Tooltip multiline label={r.notes}><IconNotes style={{verticalAlign:"middle"}} stroke={3} size={12}/></Tooltip>}</TableTd>
        {selectedCurrency==="USD" && <>
        <TableTd><NumberFormatter value={r.declared_value_usd/100} thousandSeparator=" " prefix='$'/></TableTd>
        <TableTd><NumberFormatter value={r.paid_customs_usd/100} thousandSeparator=" " prefix='$'/></TableTd>
        </> }
        {selectedCurrency!=="USD" && <>
        <TableTd><NumberFormatter value={r.declared_value/100} thousandSeparator=" " suffix={` ${r.currency}`}/></TableTd>
        <TableTd><NumberFormatter value={r.paid_customs/100} thousandSeparator=" " suffix={` ${r.currency}`}/></TableTd>
        </> }
        <TableTd> <SlackUserButton showChevron uID={r.submitter}/></TableTd>
     </TableTr>
    })

          if (isLoading) {return (<Stack>
        <TableScrollContainer minWidth={600}>

      <Table striped highlightOnHover>
        <TableThead className={`${classes.header}`}>
          <TableTr>
            <TableTh>ID</TableTh>
            <Tooltip label="Country Code"><TableTh>CC</TableTh></Tooltip>
            <TableTh>Thing</TableTh>
            <TableTh>Declared val.</TableTh>
            <TableTh>Paid</TableTh>
            <TableTh>Author</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>{new Array(15).fill(true).map((_,i)=>{

          return <TableTr key={i}>
{new Array(6).fill(true).map((_,i)=> {
          return <TableTd key={i}><Skeleton height={22.7} styles={{"root":{"margin": "7px 1px"}}} radius="xl" key={i}/></TableTd>
          })}
          </TableTr>
          
          
        })}</TableTbody>
      </Table>
        </TableScrollContainer>

      <Pagination disabled total={data.length} value={activePage} onChange={setActivePage}/>
      </Stack>)}

    return (
      <Stack>
        <TableScrollContainer minWidth={600}>
      <Table striped highlightOnHover >
        <TableThead className={`${classes.header}`}>
          <TableTr>
            <TableTh>ID</TableTh>
            <Tooltip label="Country Code"><TableTh>CC</TableTh></Tooltip>
            <TableTh>Thing</TableTh>
            <TableTh>Declared val.</TableTh>
            <TableTh>Paid</TableTh>
            <TableTh>Author</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>{rows}</TableTbody>
      </Table>
      </TableScrollContainer>
<Group justify='space-between'>
      <Pagination total={count} value={activePage} onChange={setActivePage} w={600}/>
      <SegmentedControl withItemsBorders data={['USD','£¥€']} value={selectedCurrency} onChange={setCurrency} styles={{'indicator':{backgroundColor:theme.colors?.blue[9]}}} radius="xl"/>
</Group>
      </Stack>

    )
}