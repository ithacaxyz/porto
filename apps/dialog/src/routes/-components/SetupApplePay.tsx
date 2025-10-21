import { Button, Input, OtpInput, TextButton } from '@porto/ui'
import { useMutation } from '@tanstack/react-query'
import { Hooks } from 'porto/remote'
import { RelayActions } from 'porto/viem'
import * as React from 'react'
import type { Address, BaseError } from 'viem'
import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import LucideAsterisk from '~icons/lucide/asterisk'

export function SetupApplePay(props: SetupApplePay.Props) {
  const {
    address,
    showEmail = true,
    showPhone = true,
    onBack,
    onComplete,
  } = props

  const [screen, setScreen] = React.useState<'phone-email' | 'otp'>(
    'phone-email',
  )
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [otpCode, setOtpCode] = React.useState('')
  const [otpCompleted, setOtpCompleted] = React.useState(false)
  const [noResend, setNoResend] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const isValidEmail = email && /.+@.+/.test(email)
  const isValidPhone =
    phone && /^\+1\s?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/.test(phone)
  const isValid =
    (showEmail ? isValidEmail : true) && (showPhone ? isValidPhone : true)

  const client = Hooks.useRelayClient(porto)
  const setInfo = useMutation<
    void,
    BaseError,
    {
      email: string | undefined
      phone: string | undefined
    }
  >({
    async mutationFn(data) {
      const promises = []
      if (data.email)
        promises.push(
          RelayActions.setEmail(client, {
            email: data.email,
            walletAddress: address,
          }),
        )
      if (data.phone)
        promises.push(
          RelayActions.setPhone(client, {
            phone: data.phone,
            walletAddress: address,
          }),
        )
      await Promise.all(promises)
    },
  })
  const verifyPhone = useMutation<
    void,
    BaseError,
    {
      code: string
      phone: string
    }
  >({
    async mutationFn(data) {
      await RelayActions.verifyPhone(client, {
        code: data.code,
        phone: data.phone,
        walletAddress: address,
      })
    },
  })
  const resendVerifyPhone = useMutation({
    async mutationFn(data: { phone: string }) {
      await RelayActions.resendVerifyPhone(client, {
        phone: data.phone,
        walletAddress: address,
      })
    },
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isValid) return
    setInfo.mutate(
      { email, phone },
      {
        onError(error) {
          console.log('onError', error)
        },
        onSuccess() {
          if (showPhone) setScreen('otp')
          else if (showEmail) onComplete()
        },
      },
    )
  }

  const handleOtpChange = React.useCallback((code: string) => {
    setOtpCode(code)
    if (code.length < 6) {
      setOtpCompleted(false)
    }
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  const handleOtpFill = React.useCallback(
    (code: string) => {
      setOtpCode(code)
      containerRef.current?.focus()
      verifyPhone.mutate(
        { code, phone },
        {
          onError() {
            setOtpCompleted(false)
          },
          onSuccess() {
            setOtpCompleted(true)
            onComplete()
          },
        },
      )
    },
    [phone, onComplete],
  )

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
          <div className="outline-none" ref={containerRef} tabIndex={-1}>
            <OtpInput
              autoFocus
              disabled={otpCompleted}
              key={screen}
              length={6}
              mode="fill"
              onChange={handleOtpChange}
              onFill={handleOtpFill}
              status={otpCompleted ? 'valid' : 'default'}
              value={otpCode}
            />
          </div>
        </Layout.Content>
        <Layout.Footer>
          <Layout.Footer.Actions>
            <Button
              disabled={verifyPhone.isPending || otpCompleted}
              onClick={() => setScreen('phone-email')}
              variant={otpCompleted ? 'primary' : 'secondary'}
              width="grow"
            >
              {verifyPhone.isPending
                ? 'Verifying code…'
                : otpCompleted
                  ? 'Correct!'
                  : 'Back'}
            </Button>
          </Layout.Footer.Actions>
        </Layout.Footer>
        {verifyPhone.error?.details && (
          <div className="px-3 pb-3 text-center text-[14px] text-th_base-negative">
            {verifyPhone.error.details}
          </div>
        )}
        <p className="px-3 pb-3 text-center text-[12px] text-th_base-secondary">
          Didn't receive the code?{' '}
          <TextButton
            color="link"
            disabled={noResend}
            onClick={() => {
              setNoResend(true)
              resendVerifyPhone.mutate(
                { phone },
                {
                  onError() {
                    setNoResend(false)
                  },
                  onSuccess() {
                    setTimeout(() => setNoResend(false), 10_000)
                  },
                },
              )
            }}
          >
            Resend it
          </TextButton>
        </p>
      </Layout>
    )

  return (
    <Layout>
      <Layout.Header>
        <div className="flex flex-col gap-3 pb-1">
          <div className="flex items-center gap-2">
            <SetupApplePay.AppleIcon />
            <div className="font-medium text-[18px] text-th_base">
              Set up Apple Pay
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            {!showEmail && showPhone ? (
              <div className="text-[15px] text-th_base leading-[22px]">
                To pay with card, you will need to add your phone number.
              </div>
            ) : showEmail && !showPhone ? (
              <div className="text-[15px] text-th_base leading-[22px]">
                To pay with card, you will need to add your email address.
              </div>
            ) : (
              <div className="text-[15px] text-th_base leading-[22px]">
                To pay with card, you will need to add your phone number & email
                address.
              </div>
            )}
          </div>
        </div>
      </Layout.Header>
      <form noValidate onSubmit={handleSubmit}>
        <Layout.Content>
          <div className="flex flex-col gap-3">
            {showEmail && (
              <Input
                adornments={{
                  end: isValidEmail && { type: 'valid' },
                }}
                autoFocus
                inputMode="email"
                name="email"
                onChange={setEmail}
                placeholder="example@ithaca.xyz"
                type="text"
                value={email}
              />
            )}
            {showPhone && (
              <Input
                adornments={{
                  end: isValidPhone && { type: 'valid' },
                  // FIXME: This was causing `pattern` to not work (since it was removing `+1` from input value)
                  // start: {
                  //   prefixes: ['+1'],
                  //   type: 'phone-prefix',
                  // },
                }}
                inputMode="numeric"
                name="phone"
                onChange={setPhone}
                pattern="\+1\s?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}"
                placeholder="+1 (650) 555-1234"
                type="tel"
                value={phone}
              />
            )}
          </div>
        </Layout.Content>
        <Layout.Footer>
          <Layout.Footer.Actions>
            <Button onClick={onBack} variant="secondary" width="grow">
              Back
            </Button>
            <Button
              disabled={!isValid || setInfo.isPending}
              loading={setInfo.isPending}
              type="submit"
              variant="primary"
              width="grow"
            >
              Continue
            </Button>
          </Layout.Footer.Actions>
        </Layout.Footer>
        {setInfo.error?.details && (
          <div className="px-3 pb-3 text-center text-[14px] text-th_base-negative">
            {setInfo.error.details}
          </div>
        )}
        <p className="px-3 pb-3 text-center text-[12px] text-th_base-secondary">
          By using this onramp, you agree to Coinbase's{' '}
          <a
            className="underline"
            href="https://www.coinbase.com/legal/user_agreement"
            rel="noopener noreferrer"
            target="_blank"
          >
            User Agreement
          </a>
          ,{' '}
          <a
            className="underline"
            href="https://www.coinbase.com/legal/guest-checkout/us"
            rel="noopener noreferrer"
            target="_blank"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            className="underline"
            href="https://www.coinbase.com/legal/privacy"
            rel="noopener noreferrer"
            target="_blank"
          >
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </Layout>
  )
}

export namespace SetupApplePay {
  export type Props = {
    address: Address
    showEmail: boolean | undefined
    showPhone: boolean | undefined
    onBack: () => void
    onComplete: () => void
  }

  export function AppleIcon() {
    return (
      <div className="grid size-[32px] place-items-center rounded-full bg-th_secondary text-th_secondary">
        <svg height="16" role="presentation" width="14">
          <path
            d="M9.356 2.898c-.536.61-1.444 1.064-2.165 1.064a1.3 1.3 0 0 1-.217-.02 1.3 1.3 0 0 1-.03-.27c0-.774.422-1.547.876-2.03C8.397 1.001 9.366.528 10.17.5c.02.087.031.193.031.3 0 .773-.35 1.538-.845 2.098m.567 1.229c.453 0 2.092.038 3.165 1.49-.093.067-1.722.927-1.722 2.852 0 2.224 2.072 3.018 2.134 3.037-.01.048-.33 1.073-1.093 2.127-.68.92-1.402 1.848-2.484 1.848-1.093 0-1.371-.6-2.619-.6-1.227 0-1.66.619-2.65.619-1 0-1.69-.86-2.484-1.905C1.242 12.357.5 10.442.5 8.624c0-2.911 2.02-4.459 4.01-4.459 1.052 0 1.928.648 2.598.648.63 0 1.608-.686 2.815-.686"
            fill="currentColor"
          />
        </svg>
      </div>
    )
  }
}
