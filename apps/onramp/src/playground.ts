import axios from 'redaxios'
import { env } from './constants'

export const unixTimestamp = () => Math.floor(Date.now() / 1_000)

/**
 * @note
 * all the requests here are informational,
 * meaning they are not required for a successful onramp transaction
 */

// Interface definitions
interface Currency {
  code: string
  name: string
  networks: Array<Network>
}

interface Network {
  network: string
  networkName: string
}

interface GeoLocation {
  country: {
    code: string
    phone_prefix: 1
    enabled: boolean
  }
}

type CurrencyLimit = {
  USD: {
    min: number
    max: number
  }
  USDC: {
    min: number
    max: number
  }
}

interface SignUpResponse {
  init_token: string
  init_token_type: string
}

interface Transaction {
  id: string
  status: string
  amount: number
  fiatCurrency: string
  cryptoCurrency: string
  timestamp: number
}

// API client with default headers
const apiClient = axios.create({
  baseURL: `${env.MERCURYO_SANDBOX_BASE_URL}/v1.6`,
  headers: {
    'Content-Type': 'application/json',
    'Sdk-Partner-Token': env.SDK_PARTNER_TOKEN,
  },
})

/**
 * Get available currencies for onramp
 */
async function getAvailableCurrencies(): Promise<Currency[]> {
  try {
    const response = await apiClient.get('/lib/currencies')
    const data = response.data.data
    return data
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error('Error fetching available currencies:', errorMessage)
    throw error
  }
}

/**
 * Check user location based on IP
 */
async function checkUserLocation(): Promise<GeoLocation> {
  try {
    const response = await apiClient.get('/public/data-by-ip')
    const data = response.data.data
    console.info('checkUserLocation', data)
    return data
  } catch (error) {
    console.error('Error checking user location:', error)
    throw error
  }
}

/**
 * Get currency limits
 */
async function getCurrencyLimits({
  to,
  type,
  from,
  amount,
  is_total,
  widgetId,
}: {
  to: string
  from: string
  type?: string
  amount?: number
  widgetId: string
  is_total?: boolean
}): Promise<CurrencyLimit> {
  try {
    // console.info('getCurrencyLimits', { widgetId, from, to, type, is_total, amount })
    const response = await apiClient.get('/public/currency-limits', {
      params: { amount, from, is_total, to, type, widget_id: widgetId },
    })
    const data = response.data.data
    return data
  } catch (error) {
    console.error(
      'Error fetching currency limits:',
      // @ts-ignore
      error?.response?.data,
    )
    throw error
  }
}

interface BuyRateResponse {
  buy_token: string
  currency: string
  amount: string
  fiat_amount: string
  fiat_currency: string
  rate: string
  reverse_rate: string
  fee: Record<string, string>
  subtotal: Record<string, string>
  total: Record<string, string>
  kyc_limit_exceeded: boolean
  kyc_limits: boolean
  total_denominated: string
  fee_parameters: {
    fee_percent: string
    fee_min_original: string
    currency_original: string
    consent_required: string
    network_fees: Record<string, string>
    processing_fees: Record<string, string>
    def_parameters: {
      is_us: boolean
      top_fee: string
      exchanges: Array<string>
      fee: { amount: string; source: string }
      min_fee: { amount: string; source: string }
    }
    additional_currencies_rates: Record<string, string>
  }
  consent_required: string
}

async function getBuyRate({
  to,
  type,
  from,
  amount,
  address,
  widgetId,
  paymentMethod,
}: {
  to: string
  type: string
  from: string
  amount: number
  address?: string
  widgetId: string
  paymentMethod: string
}): Promise<BuyRateResponse> {
  try {
    const response = await apiClient.get('/widget/buy/rate', {
      params: {
        address,
        amount,
        from,
        payment_method: paymentMethod,
        to,
        type,
        widget_id: widgetId,
      },
    })
    const data = response.data.data
    console.info('getBuyRate', data)
    return data
  } catch (error) {
    console.error('Error fetching buy rate:', error)
    throw error
  }
}

/**
 * Register a user (KYCless)
 * @param email - User's email address
 */
async function registerUser(email: string): Promise<SignUpResponse> {
  try {
    const response = await apiClient.post('/sdk-partner/sign-up', {
      accept: true,
      email,
    })
    const data = response.data.data
    console.info('registerUser', data)
    return data
  } catch (error) {
    console.error('Error registering user:', error)
    throw error
  }
}

/**
 * Get transactions for a user
 * @param initToken - User's init token
 */
async function getUserTransactions(initToken: string): Promise<Transaction[]> {
  try {
    const response = await apiClient.get('/sdk-partner/transactions', {
      headers: { 'Init-Token': initToken },
    })
    const data = response.data.data
    console.info('getUserTransactions', data)
    return data
  } catch (error) {
    console.error('Error fetching user transactions:', error)
    throw error
  }
}

/**
 * Initialize widget in container
 * @param containerId - DOM element ID where widget will be mounted
 * @param initToken - User's init token
 * @param initTokenType - User's init token type
 */
function initializeWidget(
  containerId: string,
  initToken: string,
  initTokenType: string,
): void {
  // This would typically be called in a browser environment
  console.info(/* javascript */ `
    // Browser-side code to initialize widget:
    window.mercuryoWidget.run({
      widgetId: env.WIDGET_ID,
      host: document.getElementById('${containerId}'),
      init_token: '${initToken}',
      init_token_type: '${initTokenType}',
    });
  `)
}

/**
 * Main function to orchestrate the KYCless onramp flow
 */
async function startKYClessOnramp({
  email,
  fiatAmount,
  fiatCurrency,
  cryptoCurrency,
}: {
  email: string
  network: string
  fiatAmount: number
  containerId: string
  fiatCurrency: string
  cryptoCurrency: string
}): Promise<void> {
  try {
    // 1. Check user location
    const location = await checkUserLocation()
    if (!location.country.enabled) {
      throw new Error(
        `User from ${location.country.code} is not allowed to use this service`,
      )
    }

    // 2. Check currency limits
    const limits = await getCurrencyLimits({
      amount: fiatAmount,
      from: fiatCurrency,
      to: cryptoCurrency,
      widgetId: env.WIDGET_ID,
    })
    if (fiatAmount < limits.USD.min || fiatAmount > limits.USD.max) {
      throw new Error(
        `Amount must be between ${limits.USD.min} and ${limits.USD.max} ${fiatCurrency}`,
      )
    }

    // 3. Get estimated crypto amount
    const cryptoAmount = await getBuyRate({
      amount: fiatAmount,
      from: fiatCurrency,
      paymentMethod: 'apple',
      to: cryptoCurrency,
      type: 'buy',
      widgetId: env.WIDGET_ID,
    })
    console.info(
      `Estimated crypto amount: ${cryptoAmount.amount} ${cryptoCurrency}`,
    )

    const { init_token, init_token_type } = await registerUser(email)
    console.info(`User registered with init_token: ${init_token}`)

    console.info('KYCless onramp flow initialized successfully')
    console.info(
      // `Note: Unverified users can buy crypto up to ${limits.USD.max} ${fiatCurrency}`,
    )
  } catch (error) {
    console.error('Error in KYCless onramp flow:', error)
    throw error
  }
}

// Example usage
async function main() {
  try {
    // const currencies = await getAvailableCurrencies()
    // console.info('Available cryptocurrencies:', currencies)
    //
    await startKYClessOnramp({
      containerId: 'mercuryo-widget-container',
      cryptoCurrency: 'USDC',
      email: `user-${unixTimestamp()}@porto.sh`,
      fiatAmount: 100,
      fiatCurrency: 'USD',
      network: 'polygon',
    })
  } catch (error) {
    console.error('Application error:', error)
  }
}

main()
  .then(() => {
    console.info('Application finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Application error:', error)
    process.exit(1)
  })
