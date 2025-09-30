import * as z from 'zod'

export async function lookupAaguid(params: { aaguid: string }) {
  const response = await fetch(
    'https://raw.githubusercontent.com/passkeydeveloper/passkey-authenticator-aaguids/refs/heads/main/combined_aaguid.json',
  )
  const data = await response.json()

  const parsed = AaguidSchema.safeParse(data)
  if (!parsed.success) throw new Error('Invalid AAGUID data')

  return parsed.data?.[params.aaguid]
}

const AaguidSchema = z.record(
  z
    .string()
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i),
  z.object({
    icon_dark: z.string().nullish(),
    icon_light: z.string().nullish(),
    name: z.string(),
  }),
)

export type AAGUID = z.infer<typeof AaguidSchema>
