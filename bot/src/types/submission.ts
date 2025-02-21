import type { Countries } from "country-to-currency";

type money = number

export default interface submission {
    author: string // Slack ID
    item: string; //What item did you pay customs for
    country_code: Countries //ISO 3166-1 alpha-2 country code
    declared_value: money
    declared_value_usd: money
    paid_customs: money
    paid_customs_usd: money
    submission_date: number //UNIX timestamp
    additional_information: string //notes 
}
