type money = string

export default interface submission {
    author: string // Slack ID
    item: string; //What item did you pay customs for
    country_code: string
    declared_value: money 
    declared_value_usd: money
    paid_customs: money
    paid_customs_usd: money
    submission_date: number //UNIX timestamp
    additional_information: string //notes 
}

