import { Button, Input, OtpInput, TextButton } from '@porto/ui'
import * as React from 'react'
import { Layout } from '~/routes/-components/Layout'
import LucideAsterisk from '~icons/lucide/asterisk'
import LucideMailPlus from '~icons/lucide/mail-plus'

export function PayWithCard(props: PayWithCard.Props) {
  const { onBack, onComplete } = props

  const [screen, setScreen] = React.useState<'phone-email' | 'otp'>(
    'phone-email',
  )
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [otpCode, setOtpCode] = React.useState('')
  const [otpCompleted, setOtpCompleted] = React.useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const phone = formData.get('phone')
    if (email && phone) setScreen('otp')
  }

  const handleOtpFill = (code: string) => {
    setOtpCode(code)
    setOtpCompleted(true)
  }

  React.useEffect(() => {
    if (otpCompleted) {
      const timeout = setTimeout(onComplete, 500)
      return () => clearTimeout(timeout)
    }
  }, [otpCompleted, onComplete])

  if (screen === 'otp')
    return (
      <Layout>
        <Layout.Header>
          <Layout.Header.Default
            content="We sent a verification code to your phone number, please enter it below."
            icon={LucideAsterisk}
            title="Enter code"
          />
        </Layout.Header>
        <Layout.Content>
          <OtpInput
            length={6}
            mode="fill"
            onChange={() => setOtpCompleted(false)}
            onFill={handleOtpFill}
            status={otpCompleted ? 'valid' : 'default'}
            value={otpCode}
          />
        </Layout.Content>
        <Layout.Footer>
          <Layout.Footer.Actions>
            <Button onClick={() => setScreen('phone-email')} width="grow">
              Back
            </Button>
          </Layout.Footer.Actions>
        </Layout.Footer>
        <p className="px-3 pb-3 text-center text-[12px] text-th_base-secondary">
          Didn't receive the code?{' '}
          <TextButton color="link">Resend it</TextButton>
        </p>
      </Layout>
    )

  return (
    <Layout>
      <Layout.Header>
        <Layout.Header.Default
          content="To pay with card, you will need to add your phone number & email address."
          icon={LucideMailPlus}
          title="Add phone & email"
        />
      </Layout.Header>
      <form onSubmit={handleSubmit}>
        <Layout.Content>
          <div className="flex flex-col gap-3">
            <Input
              adornments={{
                end: email ? { type: 'valid' } : { type: 'required' },
              }}
              name="email"
              onChange={setEmail}
              placeholder="example@ithaca.xyz"
              required
              type="email"
              value={email}
            />
            <Input
              adornments={{
                end: phone ? { type: 'valid' } : { type: 'required' },
                start: { label: '+1', type: 'solid' },
              }}
              name="phone"
              onChange={setPhone}
              placeholder="(650) 555-1234"
              required
              type="tel"
              value={phone}
            />
          </div>
        </Layout.Content>
        <Layout.Footer>
          <Layout.Footer.Actions>
            <Button onClick={onBack} variant="secondary" width="grow">
              Back
            </Button>
            <Button
              disabled={!email || !phone}
              type="submit"
              variant="primary"
              width="grow"
            >
              Continue
            </Button>
          </Layout.Footer.Actions>
        </Layout.Footer>
        <p className="px-3 pb-3 text-center text-[12px] text-th_base-secondary">
          You will receive a verification code to your phone. We won't send you
          any spam!
        </p>
      </form>
    </Layout>
  )
}

export namespace PayWithCard {
  export type Props = {
    onBack: () => void
    onComplete: () => void
  }
}
