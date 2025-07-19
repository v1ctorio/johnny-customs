"use client"

import classes from './ETable.module.css';
import { APISubmission } from "@/app/lib/submissions";
import { Pagination, Stack, Table, TableTd, TableTh, TableThead, TableTr } from "@mantine/core";
import { useState } from "react";

const mockData: APISubmission[] = [
  {
    id: "1",
    thing: "Framework Laptop 13",
    thing_id: "framework-13",
    author: "U123456789",
    country: "ES",
    currency: "€",
    declaredValue: 125000,
    paidCustoms: 25000,
    notes: "Standard laptop import, no issues with customs",
    approved: true,
    declaredValueUSD: 135000,
    paidCustomsUSD: 27000
  },
  {
    id: "2",
    thing: "Steam Deck OLED",
    thing_id: "steamdeck-oled",
    author: "U987654321",
    country: "FR",
    currency: "€",
    declaredValue: 65000,
    paidCustoms: 13000,
    notes: "Gaming device import, required additional documentation",
    approved: false,
    declaredValueUSD: 70200,
    paidCustomsUSD: 14040
  },
  {
    id: "3",
    thing: "MacBook Pro M3",
    thing_id: "mbp-m3",
    author: "U456789123",
    country: "CA",
    currency: "$",
    declaredValue: 220000,
    paidCustoms: 44000,
    notes: "High-value electronics, expedited processing requested",
    approved: true,
    declaredValueUSD: 237600,
    paidCustomsUSD: 47520}]


export function ETable({useUSD}:{useUSD?: boolean}){

  const [data, setData] = useState(mockData)

    const rows = data.map(r=>{
     return <TableTr key={r.id}>
        <TableTd>{r.id}</TableTd>
        <TableTd>{r.thing}</TableTd>
        {useUSD && <>
        <TableTd>${r.declaredValueUSD}</TableTd>
        <TableTd>${r.paidCustomsUSD}</TableTd>
        </> }
        {!useUSD && <>
        <TableTd>{r.declaredValue} {r.currency}</TableTd>
        <TableTd>{r.paidCustoms} {r.currency}</TableTd>
        </> }
        <TableTd>{r.author}</TableTd>
     </TableTr>
    })

    return (
      <Stack>
      <Table miw={600} maw={1400} striped highlightOnHover>
        <TableThead className={`${classes.header}`}>
          <TableTr>
            <TableTh>ID</TableTh>
            <TableTh>Thing</TableTh>
            <TableTh>Declared val.</TableTh>
            <TableTh>Paid</TableTh>
            <TableTh>Author</TableTh>
          </TableTr>
        </TableThead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Pagination total={data.length}/>
      </Stack>
    )
}