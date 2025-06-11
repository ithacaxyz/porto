import * as stylex from '@stylexjs/stylex'
import { useState } from 'react'
import { AppLayout } from './components/AppLayout.js'
import { Button } from './components/Button.js'
import { ColorInput } from './components/ColorInput.js'
import { Dropdown } from './components/Dropdown.js'
import {
  Panel,
  PanelSection,
  PanelSectionButtonsRow,
  PanelSubsection,
} from './components/Panel.js'
import { ThumbnailPicker } from './components/ThumbnailPicker.js'
import { fontOptions } from './constants.js'
import { Preview } from './Preview.js'
import type { Theme } from './theming.js'
import { animations, baseThemes, radiuses } from './theming.js'
import type { ConfigMode, Entries, FontOption } from './types.js'
import { animationsLabel, capitalizeFirstLetter, radiusLabel } from './utils.js'

export function App() {
  const [mode, setMode] = useState<ConfigMode>('theming')
  const [theme, setTheme] = useState<Theme>(baseThemes[0])
  const [fonts, setFonts] = useState<{
    body: FontOption['id']
    monospace: FontOption['id']
  }>({
    body: 'system',
    monospace: 'system',
  })
  return (
    <AppLayout
      primary={<Preview theme={theme} />}
      secondary={
        <Panel
          onTabsChange={(id) => {
            setMode(id.replace('tab-', '') as ConfigMode)
          }}
          secondaryAction={
            <Button label="Export" size="medium" variant="fill" />
          }
          selectedTab={`tab-${mode}`}
          tabs={[
            { id: 'tab-general', label: 'General', panelId: 'panel-general' },
            { id: 'tab-theming', label: 'Theming', panelId: 'panel-theming' },
          ]}
        >
          {mode === 'theming' && (
            <>
              <PanelSectionBaseTheme
                onBaseThemeChange={(id) => {
                  const theme = baseThemes.find((theme) => theme.id === id)
                  if (theme) {
                    setTheme({
                      ...theme,
                      parent: id,
                    })
                  }
                }}
                selected={theme.parent ?? theme.id}
                themes={baseThemes}
              />
              <PanelSection heading="Borders">
                <PanelSectionButtonsRow>
                  {radiuses.map((radius) => (
                    <Button
                      key={radius}
                      label={radiusLabel(radius)}
                      onPress={() => {
                        setTheme({ ...theme, radius })
                      }}
                      ratio="square"
                      selected={theme.radius === radius}
                      size="large"
                      variant="outline"
                    />
                  ))}
                </PanelSectionButtonsRow>
              </PanelSection>
              <PanelSection heading="Animations">
                <PanelSectionButtonsRow>
                  {animations.map((animations) => (
                    <Button
                      key={animations}
                      label={animationsLabel(animations)}
                      onPress={() => {
                        setTheme({ ...theme, animations })
                      }}
                      selected={theme.animations === animations}
                      size="large"
                      variant="outline"
                    />
                  ))}
                </PanelSectionButtonsRow>
              </PanelSection>
              <PanelSectionFonts
                onFontsChange={setFonts}
                selectedFonts={fonts}
              />
              <PanelSectionColors />
            </>
          )}
        </Panel>
      }
    />
  )
}

function PanelSectionBaseTheme({
  onBaseThemeChange,
  selected = 'light',
  themes,
}: {
  onBaseThemeChange: (themeId: string) => void
  themes: readonly Theme[]
  selected: Theme['id']
}) {
  return (
    <PanelSection heading="Base theme">
      <ThumbnailPicker
        items={themes.map((theme) => ({
          id: theme.id,
          label: theme.name,
          thumbnail: theme.previewUrl,
        }))}
        onChange={(item) => {
          const theme = themes.find((theme) => theme.id === item)
          if (!theme) {
            return
          }
          onBaseThemeChange(theme.id)
        }}
        selected={selected}
      />
    </PanelSection>
  )
}

const panelFontsStyles = stylex.create({
  preview: {
    background: '#F0F0F0',
    border: '1px solid #E8E8E8',
    borderRadius: 12,
    color: '#646464',
    padding: 12,
  },
  previewMonospace: {
    display: 'flex',
    justifyContent: 'space-between',
  },
})

function PanelSectionFonts({
  onFontsChange,
  selectedFonts,
}: {
  onFontsChange: (fonts: {
    body: FontOption['id']
    monospace: FontOption['id']
  }) => void
  selectedFonts: {
    body: FontOption['id']
    monospace: FontOption['id']
  }
}) {
  return (
    <PanelSection heading="Fonts">
      <PanelSubsection heading="Body">
        <Dropdown
          items={fontOptions}
          onSelect={(id) => {
            onFontsChange({ ...selectedFonts, body: id })
          }}
          selected={selectedFonts.body}
        />
        <div {...stylex.props(panelFontsStyles.preview)}>
          Tempor dolore et pariatur aute cupidatat dolore Lorem qui. Officia
          dolore ullamco proident laborum tempor qui. Proident adipisicing
          nostrud quis voluptate exercitation mollit consectetur ea sint amet
          excepteur. Est culpa aute aute occaecat sunt ex exercitation laboris
          voluptate proident sunt ut veniam.
        </div>
      </PanelSubsection>
      <PanelSubsection heading="Monospace">
        <Dropdown
          items={fontOptions}
          onSelect={(id) => {
            onFontsChange({ ...selectedFonts, monospace: id })
          }}
          selected={selectedFonts.monospace}
        />
        <div
          {...stylex.props(
            panelFontsStyles.preview,
            panelFontsStyles.previewMonospace,
          )}
        >
          <div>Network fee</div>
          <div>123,456.78</div>
        </div>
      </PanelSubsection>
    </PanelSection>
  )
}

const lightTheme = {
  content: {
    accent: '#0090FF',
    border: '#E8E8E8',
    default: '#202020',
    faint: '#D9D9D9',
    focus: '#0090FF',
    muted: '#8D8D8D',
    negative: '#E5484D',
    positive: '#30A46C',
    warning: '#E2A336',
  },
  layers: {
    accent: '#E6F4FE',
    base: '#F9F9F9',
    border: '#D9D9D9',
    inset: '#F0F0F0',
    negative: '#FEEBEC',
    positive: '#E6F6EB',
    raised: '#CFCFCF',
    warning: '#FFF7C2',
  },
} as const

const panelSectionColorsStyles = stylex.create({
  colorRow: {
    alignItems: 'center',
    display: 'flex',
    gap: 12,
    height: 40,
    justifyContent: 'space-between',
    width: '100%',
  },
  label: {
    fontSize: 14,
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
})

function PanelSectionColors() {
  const [palette, setPalette] = useState(() => ({ ...lightTheme }))
  return (
    <PanelSection heading="Colors">
      {(Object.entries(palette) as Entries<typeof palette>).map(
        ([groupName, group]) => (
          <PanelSubsection
            heading={capitalizeFirstLetter(groupName)}
            key={groupName}
          >
            <div {...stylex.props(panelSectionColorsStyles.main)}>
              {Object.entries(group).map(([name, hex]) => (
                <div
                  key={name}
                  {...stylex.props(panelSectionColorsStyles.colorRow)}
                >
                  <div {...stylex.props(panelSectionColorsStyles.label)}>
                    {capitalizeFirstLetter(name)}
                  </div>
                  <ColorInput
                    onChange={(newHex) => {
                      if (newHex) {
                        setPalette((palette) => ({
                          ...palette,
                          [groupName]: {
                            ...palette[groupName],
                            [name]: newHex,
                          },
                        }))
                      }
                    }}
                    value={hex}
                  />
                </div>
              ))}
            </div>
          </PanelSubsection>
        ),
      )}
    </PanelSection>
  )
}
