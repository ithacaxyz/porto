import { CopyButton } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/CopyButton')({
  component: CopyButtonComponent,
})

const demoAddress = '0x95223290dd7278aa1ddd389cc1e1d165cc1bafe5'
const demoAddressShort = '0x9522…bafe5'
const demoText = 'Copy this text'

function CopyButtonComponent() {
  return (
    <ComponentScreen title="CopyButton">
      <ComponentScreen.Section surface="base" title="Sizes">
        <div className="flex items-center gap-4">
          <CopyButton size="small" value={demoText} />
          <CopyButton size="medium" value={demoText} />
          <CopyButton size="large" value={demoText} />
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section surface="base" title="Variants">
        <div className="flex items-center gap-4">
          <CopyButton value={demoText} variant="strong" />
          <CopyButton value={demoText} variant="primary" />
          <CopyButton value={demoText} variant="distinct" />
          <CopyButton value={demoText} variant="secondary" />
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section surface="base" title="Label">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <CopyButton label="Copy" size="small" value={demoText} />
            <CopyButton
              label="Copy"
              size="small"
              value={demoText}
              variant="primary"
            />
          </div>
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section surface="base" title="Examples">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <CopyButton label={demoAddressShort} value={demoAddress} />
            <CopyButton label="Copy link" value="https://porto.sh" />
          </div>
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
