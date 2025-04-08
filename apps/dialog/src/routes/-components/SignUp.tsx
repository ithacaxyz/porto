import { Button } from '@porto/apps/components'
import { useState } from 'react'

import * as Dialog from '~/lib/Dialog'
import { Layout } from '~/routes/-components/Layout'
import { Permissions, PermissionsProps } from '~/routes/-components/Permissions'
import ChevronRight from '~icons/lucide/chevron-right'
import LucideLogIn from '~icons/lucide/log-in'
import Question from '~icons/mingcute/question-line'

export function SignUp(props: SignUp.Props) {
  const { enableSignIn, loading, onApprove, onReject, permissions } = props

  const [showLearn, setShowLearn] = useState(false)

  const hostname = Dialog.useStore((state) => state.referrer?.origin.hostname)

  if (showLearn) return <SignUp.Learn onDone={() => setShowLearn(false)} />
  return (
    <Layout loading={loading} loadingTitle="Signing up...">
      <Layout.Header className="flex-grow">
        <Layout.Header.Default
          content={
            <>
              Create a new passkey wallet to start using{' '}
              <span className="font-medium">{hostname}</span>.
            </>
          }
          icon={LucideLogIn}
          title="Sign up"
        />
      </Layout.Header>
      <Permissions permissions={permissions} />
      <Layout.Footer>
        <Layout.Footer.Actions>
          {enableSignIn ? (
            <Button
              onClick={() => onApprove({ selectAccount: true, signIn: true })}
              type="button"
            >
              Sign in
            </Button>
          ) : (
            <Button onClick={onReject} type="button">
              No thanks
            </Button>
          )}

          <Button
            className="flex-grow"
            onClick={() => onApprove({ signIn: false })}
            type="button"
            variant="accent"
          >
            Sign up
          </Button>
        </Layout.Footer.Actions>

        <button
          className="flex w-full cursor-pointer items-center justify-between border-primary border-t px-3 pt-3"
          onClick={() => setShowLearn(true)}
          type="button"
        >
          <div className="flex items-center gap-1">
            <Question />
            <span className="font-medium text-[14px]">
              Learn about passkeys
            </span>
          </div>
          <div className="text-secondary">
            <ChevronRight />
          </div>
        </button>
      </Layout.Footer>
    </Layout>
  )
}

export namespace SignUp {
  export type Props = {
    enableSignIn?: boolean
    loading?: boolean
    onApprove: (p: { signIn?: boolean; selectAccount?: boolean }) => void
    onReject: () => void
    permissions?: PermissionsProps
  }

  export function Learn({ onDone }: { onDone: () => void }) {
    return (
      <Layout>
        <Layout.Header className="flex-grow space-y-2">
          <PasskeyDiagramCard />

          <Layout.Header.Default
            content={
              <div className="space-y-2">
                <div>
                  Passkeys let you sign in to your wallet in seconds. Passkeys
                  are the safest way to authenticate on the internet.
                </div>
                <div className="text-secondary">
                  Your passkeys are protected by your device, browser, or
                  password manager like 1Password.
                </div>
              </div>
            }
            title="About Passkeys"
          />
        </Layout.Header>

        <Layout.Footer>
          <Layout.Footer.Actions>
            <Button className="flex-grow" onClick={onDone} type="button">
              Back
            </Button>
          </Layout.Footer.Actions>
        </Layout.Footer>
      </Layout>
    )
  }
}

export function PasskeyDiagramCard() {
  return (
    <svg fill="none" viewBox="0 0 258 75" xmlns="http://www.w3.org/2000/svg">
      <title>Passkeys</title>
      <rect className="fill-gray4" height="75" rx="10" width="258" />
      <path
        className="stroke-gray7"
        d="M121 37.5H137M137 37.5L130.5 31M137 37.5L130.5 44"
        stroke-linecap="round"
        stroke-width="2"
      />
      <rect
        className="fill-gray2"
        height="53"
        rx="8"
        width="88"
        x="156"
        y="10"
      />
      <rect
        className="fill-green9"
        height="12"
        rx="6"
        width="38"
        x="201"
        y="45"
      />
      <path
        d="M216.925 53.0996C215.999 53.0996 215.401 52.6133 215.34 51.9248L215.337 51.8926H215.864L215.867 51.9248C215.905 52.3467 216.345 52.6133 216.954 52.6133C217.528 52.6133 217.947 52.3174 217.947 51.8867V51.8838C217.947 51.5322 217.704 51.292 217.124 51.1631L216.655 51.0605C215.809 50.873 215.442 50.4834 215.442 49.8711V49.8682C215.445 49.168 216.058 48.6729 216.931 48.6729C217.774 48.6729 218.363 49.1709 218.407 49.8008L218.41 49.8418H217.883L217.877 49.8037C217.818 49.4316 217.467 49.1562 216.916 49.1592C216.389 49.1621 215.981 49.4111 215.981 49.8535V49.8564C215.981 50.1934 216.213 50.4219 216.787 50.5479L217.256 50.6533C218.138 50.8496 218.486 51.2041 218.486 51.8135V51.8164C218.486 52.6074 217.868 53.0996 216.925 53.0996ZM219.402 49.2324C219.209 49.2324 219.051 49.0742 219.051 48.8809C219.051 48.6875 219.209 48.5293 219.402 48.5293C219.596 48.5293 219.754 48.6875 219.754 48.8809C219.754 49.0742 219.596 49.2324 219.402 49.2324ZM219.145 53V49.8418H219.654V53H219.145ZM221.748 54.1133C220.986 54.1133 220.5 53.7705 220.421 53.252L220.427 53.249H220.954L220.957 53.252C221.013 53.4922 221.294 53.6621 221.748 53.6621C222.313 53.6621 222.65 53.3955 222.65 52.9297V52.291H222.603C222.404 52.6396 222.047 52.8359 221.613 52.8359C220.796 52.8359 220.289 52.2031 220.289 51.3184V51.3125C220.289 50.4277 220.799 49.7861 221.625 49.7861C222.07 49.7861 222.416 50.0059 222.609 50.3633H222.644V49.8418H223.154V52.9561C223.154 53.6621 222.609 54.1133 221.748 54.1133ZM221.725 52.3848C222.31 52.3848 222.662 51.9453 222.662 51.3184V51.3125C222.662 50.6855 222.308 50.2373 221.725 50.2373C221.139 50.2373 220.81 50.6855 220.81 51.3125V51.3184C220.81 51.9453 221.139 52.3848 221.725 52.3848ZM223.935 53V49.8418H224.445V50.3164H224.492C224.65 49.9824 224.946 49.7861 225.412 49.7861C226.121 49.7861 226.517 50.2051 226.517 50.9551V53H226.007V51.0781C226.007 50.5098 225.772 50.2373 225.268 50.2373C224.765 50.2373 224.445 50.5771 224.445 51.1309V53H223.935ZM229.06 49.2324C228.867 49.2324 228.709 49.0742 228.709 48.8809C228.709 48.6875 228.867 48.5293 229.06 48.5293C229.254 48.5293 229.412 48.6875 229.412 48.8809C229.412 49.0742 229.254 49.2324 229.06 49.2324ZM228.803 53V49.8418H229.312V53H228.803ZM230.105 53V49.8418H230.615V50.3164H230.662C230.82 49.9824 231.116 49.7861 231.582 49.7861C232.291 49.7861 232.686 50.2051 232.686 50.9551V53H232.177V51.0781C232.177 50.5098 231.942 50.2373 231.438 50.2373C230.934 50.2373 230.615 50.5771 230.615 51.1309V53H230.105Z"
        fill="white"
      />
      <g clipPath="url(#clip0_497_104)">
        <path
          d="M206.309 49.6457V48.9771C206.309 48.5995 206.599 48.3086 206.977 48.3086H207.646C207.731 48.3086 207.8 48.2395 207.8 48.1543C207.8 48.0691 207.731 48 207.646 48H206.977C206.429 48 206 48.4291 206 48.9771V49.6457C206 49.7309 206.069 49.8 206.154 49.8C206.239 49.8 206.309 49.7309 206.309 49.6457Z"
          fill="white"
        />
        <path
          d="M211.691 49.6457V48.9771C211.691 48.5995 211.401 48.3086 211.023 48.3086H210.354C210.269 48.3086 210.2 48.2395 210.2 48.1543C210.2 48.0691 210.269 48 210.354 48H211.023C211.571 48 212 48.4291 212 48.9771V49.6457C212 49.7309 211.931 49.8 211.846 49.8C211.761 49.8 211.691 49.7309 211.691 49.6457Z"
          fill="white"
        />
        <path
          d="M206.309 52.3543V53.0229C206.309 53.4005 206.599 53.6914 206.977 53.6914H207.646C207.731 53.6914 207.8 53.7605 207.8 53.8457C207.8 53.9309 207.731 54 207.646 54H206.977C206.429 54 206 53.5709 206 53.0229V52.3543C206 52.2691 206.069 52.2 206.154 52.2C206.239 52.2 206.309 52.2691 206.309 52.3543Z"
          fill="white"
        />
        <path
          d="M211.691 52.3543V53.0229C211.691 53.4005 211.401 53.6914 211.023 53.6914H210.354C210.269 53.6914 210.2 53.7605 210.2 53.8457C210.2 53.9309 210.269 54 210.354 54H211.023C211.571 54 212 53.5709 212 53.0229V52.3543C212 52.2691 211.931 52.2 211.846 52.2C211.761 52.2 211.691 52.2691 211.691 52.3543Z"
          fill="white"
        />
        <path
          d="M207.631 50.2659V50.6948C207.631 50.7835 207.699 50.8555 207.781 50.8555C207.864 50.8555 207.931 50.7835 207.931 50.6948V50.2659C207.931 50.1772 207.864 50.1052 207.781 50.1052C207.699 50.1052 207.631 50.1772 207.631 50.2659Z"
          fill="white"
        />
        <path
          d="M210.105 50.2659V50.6948C210.105 50.7835 210.173 50.8555 210.255 50.8555C210.338 50.8555 210.405 50.7835 210.405 50.6948V50.2659C210.405 50.1772 210.338 50.1052 210.255 50.1052C210.173 50.1052 210.105 50.1772 210.105 50.2659Z"
          fill="white"
        />
        <path
          d="M207.945 52.4312C208.237 52.7042 208.592 52.842 209 52.842C209.408 52.842 209.762 52.7042 210.055 52.4312C210.119 52.3717 210.122 52.2717 210.063 52.208C210.003 52.1442 209.903 52.1408 209.839 52.2003C209.606 52.4185 209.328 52.5263 209 52.5263C208.671 52.5263 208.394 52.4185 208.16 52.2003C208.096 52.1408 207.996 52.1442 207.937 52.208C207.877 52.2717 207.881 52.3717 207.945 52.4312Z"
          fill="white"
        />
        <path
          d="M209 50.2631V51.3684C209 51.4391 208.965 51.4736 208.894 51.4736H208.789C208.702 51.4736 208.631 51.5443 208.631 51.6315C208.631 51.7187 208.702 51.7894 208.789 51.7894H208.894C209.14 51.7894 209.316 51.6136 209.316 51.3684V50.2631C209.316 50.1759 209.245 50.1052 209.158 50.1052C209.07 50.1052 209 50.1759 209 50.2631Z"
          fill="white"
        />
      </g>
      <rect
        className="fill-gray1 stroke-gray4"
        height="11"
        rx="5.5"
        width="34"
        x="163.5"
        y="45.5"
      />
      <rect
        className="fill-gray6"
        height="5"
        rx="2.5"
        width="38.4255"
        x="162.819"
        y="17"
      />
      <rect
        className="fill-gray6"
        height="5"
        rx="2.5"
        width="59.0106"
        x="162.819"
        y="27"
      />
      <rect
        className="fill-gray2"
        height="16"
        rx="8"
        width="83"
        x="13"
        y="10"
      />
      <rect
        className="fill-gray2"
        height="16"
        rx="8"
        width="83"
        x="13"
        y="30"
      />
      <rect
        className="fill-gray6"
        height="16"
        rx="8"
        width="83"
        x="13"
        y="50"
      />
      <rect className="fill-gray6" height="6" rx="3" width="16" x="19" y="15" />
      <rect className="fill-gray6" height="6" rx="3" width="21" x="49" y="15" />
      <rect className="fill-gray6" height="6" rx="3" width="9" x="72" y="15" />
      <path
        className="fill-gray7"
        d="M42.1425 22C39.6069 22 38 20.447 38 18.0024V17.9928C38 15.6249 39.6511 14 42.059 14C44.3833 14 46 15.4476 46 17.5231V17.5327C46 19.0905 45.2826 20.0827 44.1523 20.0827C43.5872 20.0827 43.1548 19.7711 43.0762 19.3062L43.0713 19.2774H42.9926C42.7813 19.7663 42.3391 20.0395 41.7641 20.0395C40.742 20.0395 40.0541 19.2199 40.0541 18.0072V17.9976C40.0541 16.8376 40.7568 16.0228 41.7641 16.0228C42.2801 16.0228 42.7224 16.2816 42.914 16.6986H42.9926V16.1138H43.7346V18.9275C43.7346 19.263 43.9361 19.4596 44.2899 19.4596C44.9091 19.4596 45.3071 18.6974 45.3071 17.5231V17.5135C45.3071 15.7879 43.9607 14.604 41.9951 14.604C40.0737 14.604 38.6929 16.0324 38.6929 18.0216V18.0312C38.6929 20.0731 40.0491 21.3913 42.1523 21.3913C42.8256 21.3913 43.4889 21.3002 43.7985 21.1612V21.7651C43.3563 21.9137 42.7617 22 42.1425 22ZM41.8771 19.3637C42.5504 19.3637 42.9828 18.8412 42.9828 18.0264V18.0168C42.9828 17.2019 42.5553 16.6842 41.887 16.6842C41.2285 16.6842 40.8403 17.1827 40.8403 18.0168V18.0264C40.8403 18.8556 41.2334 19.3637 41.8771 19.3637Z"
      />
      <path
        className="fill-gray7"
        d="M20.4185 39.5254L20.4561 38.6504L19.7314 39.1084L19.499 38.7461L20.292 38.3257L19.499 37.9087L19.7314 37.5464L20.4561 38.0044L20.4185 37.1294H20.8867L20.8491 38.001L21.5703 37.5464L21.8027 37.9087L21.0098 38.3257L21.8027 38.7461L21.5703 39.1084L20.8491 38.6538L20.8867 39.5254H20.4185ZM23.5242 39.5254L23.5618 38.6504L22.8372 39.1084L22.6048 38.7461L23.3977 38.3257L22.6048 37.9087L22.8372 37.5464L23.5618 38.0044L23.5242 37.1294H23.9925L23.9549 38.001L24.6761 37.5464L24.9085 37.9087L24.1155 38.3257L24.9085 38.7461L24.6761 39.1084L23.9549 38.6538L23.9925 39.5254H23.5242ZM26.63 39.5254L26.6676 38.6504L25.943 39.1084L25.7105 38.7461L26.5035 38.3257L25.7105 37.9087L25.943 37.5464L26.6676 38.0044L26.63 37.1294H27.0982L27.0606 38.001L27.7818 37.5464L28.0142 37.9087L27.2213 38.3257L28.0142 38.7461L27.7818 39.1084L27.0606 38.6538L27.0982 39.5254H26.63ZM29.7357 39.5254L29.7733 38.6504L29.0487 39.1084L28.8163 38.7461L29.6093 38.3257L28.8163 37.9087L29.0487 37.5464L29.7733 38.0044L29.7357 37.1294H30.204L30.1664 38.001L30.8876 37.5464L31.12 37.9087L30.327 38.3257L31.12 38.7461L30.8876 39.1084L30.1664 38.6538L30.204 39.5254H29.7357ZM32.8415 39.5254L32.8791 38.6504L32.1545 39.1084L31.9221 38.7461L32.715 38.3257L31.9221 37.9087L32.1545 37.5464L32.8791 38.0044L32.8415 37.1294H33.3097L33.2722 38.001L33.9933 37.5464L34.2258 37.9087L33.4328 38.3257L34.2258 38.7461L33.9933 39.1084L33.2722 38.6538L33.3097 39.5254H32.8415ZM35.9472 39.5254L35.9848 38.6504L35.2602 39.1084L35.0278 38.7461L35.8208 38.3257L35.0278 37.9087L35.2602 37.5464L35.9848 38.0044L35.9472 37.1294H36.4155L36.3779 38.001L37.0991 37.5464L37.3315 37.9087L36.5386 38.3257L37.3315 38.7461L37.0991 39.1084L36.3779 38.6538L36.4155 39.5254H35.9472ZM39.053 39.5254L39.0906 38.6504L38.366 39.1084L38.1336 38.7461L38.9265 38.3257L38.1336 37.9087L38.366 37.5464L39.0906 38.0044L39.053 37.1294H39.5213L39.4837 38.001L40.2049 37.5464L40.4373 37.9087L39.6443 38.3257L40.4373 38.7461L40.2049 39.1084L39.4837 38.6538L39.5213 39.5254H39.053ZM42.1588 39.5254L42.1964 38.6504L41.4718 39.1084L41.2393 38.7461L42.0323 38.3257L41.2393 37.9087L41.4718 37.5464L42.1964 38.0044L42.1588 37.1294H42.627L42.5894 38.001L43.3106 37.5464L43.543 37.9087L42.7501 38.3257L43.543 38.7461L43.3106 39.1084L42.5894 38.6538L42.627 39.5254H42.1588ZM45.2645 39.5254L45.3021 38.6504L44.5775 39.1084L44.3451 38.7461L45.1381 38.3257L44.3451 37.9087L44.5775 37.5464L45.3021 38.0044L45.2645 37.1294H45.7328L45.6952 38.001L46.4164 37.5464L46.6488 37.9087L45.8558 38.3257L46.6488 38.7461L46.4164 39.1084L45.6952 38.6538L45.7328 39.5254H45.2645ZM48.3703 39.5254L48.4079 38.6504L47.6833 39.1084L47.4508 38.7461L48.2438 38.3257L47.4508 37.9087L47.6833 37.5464L48.4079 38.0044L48.3703 37.1294H48.8385L48.8009 38.001L49.5221 37.5464L49.7546 37.9087L48.9616 38.3257L49.7546 38.7461L49.5221 39.1084L48.8009 38.6538L48.8385 39.5254H48.3703ZM51.476 39.5254L51.5136 38.6504L50.789 39.1084L50.5566 38.7461L51.3496 38.3257L50.5566 37.9087L50.789 37.5464L51.5136 38.0044L51.476 37.1294H51.9443L51.9067 38.001L52.6279 37.5464L52.8603 37.9087L52.0673 38.3257L52.8603 38.7461L52.6279 39.1084L51.9067 38.6538L51.9443 39.5254H51.476ZM54.5818 39.5254L54.6194 38.6504L53.8948 39.1084L53.6624 38.7461L54.4553 38.3257L53.6624 37.9087L53.8948 37.5464L54.6194 38.0044L54.5818 37.1294H55.0501L55.0125 38.001L55.7337 37.5464L55.9661 37.9087L55.1731 38.3257L55.9661 38.7461L55.7337 39.1084L55.0125 38.6538L55.0501 39.5254H54.5818ZM57.6875 39.5254L57.7251 38.6504L57.0005 39.1084L56.7681 38.7461L57.5611 38.3257L56.7681 37.9087L57.0005 37.5464L57.7251 38.0044L57.6875 37.1294H58.1558L58.1182 38.001L58.8394 37.5464L59.0718 37.9087L58.2789 38.3257L59.0718 38.7461L58.8394 39.1084L58.1182 38.6538L58.1558 39.5254H57.6875ZM60.7933 39.5254L60.8309 38.6504L60.1063 39.1084L59.8739 38.7461L60.6668 38.3257L59.8739 37.9087L60.1063 37.5464L60.8309 38.0044L60.7933 37.1294H61.2616L61.224 38.001L61.9452 37.5464L62.1776 37.9087L61.3846 38.3257L62.1776 38.7461L61.9452 39.1084L61.224 38.6538L61.2616 39.5254H60.7933ZM63.8991 39.5254L63.9367 38.6504L63.2121 39.1084L62.9796 38.7461L63.7726 38.3257L62.9796 37.9087L63.2121 37.5464L63.9367 38.0044L63.8991 37.1294H64.3673L64.3297 38.001L65.0509 37.5464L65.2833 37.9087L64.4904 38.3257L65.2833 38.7461L65.0509 39.1084L64.3297 38.6538L64.3673 39.5254H63.8991ZM67.0048 39.5254L67.0424 38.6504L66.3178 39.1084L66.0854 38.7461L66.8784 38.3257L66.0854 37.9087L66.3178 37.5464L67.0424 38.0044L67.0048 37.1294H67.4731L67.4355 38.001L68.1567 37.5464L68.3891 37.9087L67.5961 38.3257L68.3891 38.7461L68.1567 39.1084L67.4355 38.6538L67.4731 39.5254H67.0048ZM70.1106 39.5254L70.1482 38.6504L69.4236 39.1084L69.1911 38.7461L69.9841 38.3257L69.1911 37.9087L69.4236 37.5464L70.1482 38.0044L70.1106 37.1294H70.5788L70.5412 38.001L71.2624 37.5464L71.4949 37.9087L70.7019 38.3257L71.4949 38.7461L71.2624 39.1084L70.5412 38.6538L70.5788 39.5254H70.1106ZM73.2163 39.5254L73.2539 38.6504L72.5293 39.1084L72.2969 38.7461L73.0899 38.3257L72.2969 37.9087L72.5293 37.5464L73.2539 38.0044L73.2163 37.1294H73.6846L73.647 38.001L74.3682 37.5464L74.6006 37.9087L73.8076 38.3257L74.6006 38.7461L74.3682 39.1084L73.647 38.6538L73.6846 39.5254H73.2163Z"
      />
      <path
        className="fill-gray11"
        d="M46.9248 60.0996C45.999 60.0996 45.4014 59.6133 45.3398 58.9248L45.3369 58.8926H45.8643L45.8672 58.9248C45.9053 59.3467 46.3447 59.6133 46.9541 59.6133C47.5283 59.6133 47.9473 59.3174 47.9473 58.8867V58.8838C47.9473 58.5322 47.7041 58.292 47.124 58.1631L46.6553 58.0605C45.8086 57.873 45.4424 57.4834 45.4424 56.8711V56.8682C45.4453 56.168 46.0576 55.6729 46.9307 55.6729C47.7744 55.6729 48.3633 56.1709 48.4072 56.8008L48.4102 56.8418H47.8828L47.877 56.8037C47.8184 56.4316 47.4668 56.1562 46.916 56.1592C46.3887 56.1621 45.9814 56.4111 45.9814 56.8535V56.8564C45.9814 57.1934 46.2129 57.4219 46.7871 57.5479L47.2559 57.6533C48.1377 57.8496 48.4863 58.2041 48.4863 58.8135V58.8164C48.4863 59.6074 47.8682 60.0996 46.9248 60.0996ZM49.4023 56.2324C49.209 56.2324 49.0508 56.0742 49.0508 55.8809C49.0508 55.6875 49.209 55.5293 49.4023 55.5293C49.5957 55.5293 49.7539 55.6875 49.7539 55.8809C49.7539 56.0742 49.5957 56.2324 49.4023 56.2324ZM49.1445 60V56.8418H49.6543V60H49.1445ZM51.748 61.1133C50.9863 61.1133 50.4999 60.7705 50.4208 60.252L50.4267 60.249H50.954L50.957 60.252C51.0126 60.4922 51.2939 60.6621 51.748 60.6621C52.3134 60.6621 52.6503 60.3955 52.6503 59.9297V59.291H52.6035C52.4042 59.6396 52.0468 59.8359 51.6132 59.8359C50.7958 59.8359 50.289 59.2031 50.289 58.3184V58.3125C50.289 57.4277 50.7988 56.7861 51.6249 56.7861C52.0703 56.7861 52.416 57.0059 52.6093 57.3633H52.6445V56.8418H53.1542V59.9561C53.1542 60.6621 52.6093 61.1133 51.748 61.1133ZM51.7245 59.3848C52.3105 59.3848 52.662 58.9453 52.662 58.3184V58.3125C52.662 57.6855 52.3076 57.2373 51.7245 57.2373C51.1386 57.2373 50.8105 57.6855 50.8105 58.3125V58.3184C50.8105 58.9453 51.1386 59.3848 51.7245 59.3848ZM53.9355 60V56.8418H54.4452V57.3164H54.4921C54.6503 56.9824 54.9462 56.7861 55.412 56.7861C56.121 56.7861 56.5165 57.2051 56.5165 57.9551V60H56.0067V58.0781C56.0067 57.5098 55.7724 57.2373 55.2685 57.2373C54.7646 57.2373 54.4452 57.5771 54.4452 58.1309V60H53.9355ZM59.0604 56.2324C58.867 56.2324 58.7088 56.0742 58.7088 55.8809C58.7088 55.6875 58.867 55.5293 59.0604 55.5293C59.2537 55.5293 59.412 55.6875 59.412 55.8809C59.412 56.0742 59.2537 56.2324 59.0604 56.2324ZM58.8026 60V56.8418H59.3123V60H58.8026ZM60.1053 60V56.8418H60.615V57.3164H60.6619C60.8201 56.9824 61.116 56.7861 61.5818 56.7861C62.2908 56.7861 62.6863 57.2051 62.6863 57.9551V60H62.1766V58.0781C62.1766 57.5098 61.9422 57.2373 61.4383 57.2373C60.9344 57.2373 60.615 57.5771 60.615 58.1309V60H60.1053Z"
      />
      <defs>
        <clipPath id="clip0_497_104">
          <rect
            fill="white"
            height="6"
            transform="translate(206 48)"
            width="6"
          />
        </clipPath>
      </defs>
    </svg>
  )
}
