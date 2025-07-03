export interface MercuryoCallback {
  data: {
    id: string
    type: string
    amount: string
    network: string
    eventId: string
    currency: string
    updated_at: string
    created_at: string
    fiat_amount: string
    created_at_ts: number
    updated_at_ts: number
    fiat_currency: string
    payment_method: string
    status:
      | 'new'
      | 'paid'
      | 'pending'
      | 'cancelled'
      | 'scheduled'
      | 'order_failed'
      | 'failed_exchange'
      | 'order_verified_not_complete'
    fee: string
    rate: string
    partner_fee: string
    card: { number: string }
    card_masked_pan: string | null
    contract_address: string | null
    merchant_transaction_id: string | null
    user: { uuid4: string; email: string; country_code: string }
  }
}
