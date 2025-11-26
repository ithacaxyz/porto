import { Mode } from 'porto'
import { porto } from 'porto/wagmi'
import { createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    porto({
      mode: Mode.dialog({
        // Feature flags - control UI element visibility
        features: {
          bugReporting: false,
          createAccount: true,
          emailInput: true,
          signUpLink: false,
        },

        // Custom text labels
        labels: {
          bugReportEmail: 'support@myapp.com',
          createAccount: 'Create MyApp account',
          exampleEmail: 'example@myapp.com',
          signIn: 'Sign in with MyApp',
          signInAlt: 'Continue with MyApp',
          signInPrompt: 'Use MyApp to sign in to',
          signUp: 'Sign up with MyApp',
          signUpLink: 'Register',
          switchAccount: 'Change',
        },

        // Custom theme colors
        theme: {
          badgeBackground: '#ffffff',
          badgeContent: '#ff007a',
          badgeInfoBackground: '#fce3ef',
          badgeInfoContent: '#ff007a',
          badgeStrongBackground: '#ffffff',
          badgeStrongContent: '#ff007a',
          baseBackground: '#fcfcfc',
          baseBorder: '#f0f0f0',
          baseContent: '#202020',
          baseContentSecondary: '#8d8d8d',
          baseHoveredBackground: '#f0f0f0',
          colorScheme: 'light',
          fieldBackground: '#f0f0f0',
          fieldBorder: '#f0f0f0',
          fieldContent: '#202020',
          fieldErrorBorder: '#f0f',
          fieldFocusedBackground: '#f0f0f0',
          fieldFocusedContent: '#202020',
          focus: '#ff007a',
          frameBackground: '#ff007a',
          frameBorder: 'transparent',
          frameContent: '#202020',
          frameRadius: 14,
          link: '#ff007a',
          negativeBackground: '#f0f',
          negativeContent: '#f0f',
          positiveBackground: '#f0f',
          positiveContent: '#f0f',
          primaryBackground: '#ff007a',
          primaryBorder: '#ff007a',
          primaryContent: '#ffffff',
          primaryHoveredBackground: '#ff2994',
          primaryHoveredBorder: '#ff2994',
          separator: '#f0f0f0',
        },
      }),
    }),
  ],
  multiInjectedProviderDiscovery: false,
  pollingInterval: 1_000,
  transports: {
    [baseSepolia.id]: http(),
  },
})
