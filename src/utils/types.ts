type Merchant = {
  id?: number
  name: string
  email: string
  webhook_url?: string | null
  status?: 'active' | 'stopped'
}
