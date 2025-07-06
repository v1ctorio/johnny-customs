
// Money is saved in the database in CENTS, no decimals and in the local currency.
export interface Log {
  id: string;
  element: string; // name of the thing customs were paid for
  author: string; // Log author slack id

  currency: string; // currency country code 
  declaredValue?: number; // value declared to customs
  paidCustoms: number

  notes?: string; 
  approved?: boolean; 
}


export interface APILog extends Log {
  currencySymbol: string; 
  declaredValueUSD?: number; 
  paidCustomsUSD: number;

}

export async function createLog(formData: FormData) {
  'use server'
  const title = formData.get('title')
  const content = formData.get('content')
 
}
 
export async function deleteLog(formData: FormData) {
  'use server'
  const id = formData.get('id')
  return id
}

export async function updateLog(formData: FormData) {
  'use server'
  const id = formData.get('id')
  const title = formData.get('title')
  const content = formData.get('content')

  return null as any as Log[] 
}

export async function listLog(length?: number, offset: number = 0) {
  'use server'
  return null as any as Log[] | undefined
}