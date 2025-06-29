import redaxios from 'redaxios'
import { env } from './constants'

const client = redaxios.create({
  baseURL: 'https://sandbox-api.mrcr.io/v1.6',
  headers: {
    'Content-Type': 'application/json',
    'Sdk-Partner-Token': env.SDK_PARTNER_TOKEN,
  },
})

type ForbiddenError = { status: 403 } & (
  | { code: 403020; message: 'IP is blacklisted' }
  | { code: 403031; message: 'Login failed. Check the message field' }
  | { code: 403007; message: 'Transaction lock error. Please contact support' }
)

type ErrorResponse =
  | ForbiddenError
  | {
      status: 401
      code: 401000
      message: 'Authorization failed' & string
    }
  | {
      status: 404
      code: 404
      message: 'User is not found' & string
    }
  | {
      status: 405
      code: 405000
      message: 'Method Not Allowed' & string
    }
  | {
      status: 500
      code: 500
      message: 'Internal server error' & string
    }

export type SilentSignUpResponse =
  | {
      data: {
        uuid: string
        init_token: string
        init_token_type: string
      }
      status: 200
    }
  | ErrorResponse

type SilentSignUpRequestParameters =
  | { email: string }
  | { phone: string }
  | { user_uuid4: string }

/**
 * @see https://oor-redirect.redoc.ly/#section/Silent-Authentication/Silent-Sign-Up
 *
 * @note
 * `init_token` expires after the first time it was passed or after one hour
 */
export async function silentSignUp(
  parameters: SilentSignUpRequestParameters & { language_code?: string },
): Promise<SilentSignUpResponse> {
  const response = await client.post<SilentSignUpResponse>(
    '/sdk-partner/sign-up',
    {
      accept: true,
      ...parameters,
    },
  )

  return response.data
}

type SilentSignInResponse =
  | {
      data: {
        uuid: string
        init_token: string
        init_token_type: string
      }
      status: 200
    }
  | ErrorResponse

/**
 * @see https://oor-redirect.redoc.ly/#section/Silent-Authentication/Silent-Sign-In
 *
 * @note
 * `init_token` expires after the first time it was passed or after one hour
 */
export async function silentSignIn(
  parameters: SilentSignUpRequestParameters,
): Promise<SilentSignInResponse> {
  const response = await client.post<SilentSignInResponse>(
    '/sdk-partner/login',
    parameters,
  )

  return response.data
}
