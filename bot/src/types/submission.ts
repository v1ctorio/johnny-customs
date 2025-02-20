type money = string

export default interface submission {
    item: string; //What item did you pay customs for
    country_code: string
    declared_value: money 
    declared_value_usd: money
    paid_customs: money
    paid_customs_usd: money
}

