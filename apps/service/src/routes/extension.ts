import { Schema } from '@effect/schema'
import { Hono } from 'hono'

export const extensionApp = new Hono<{ Bindings: Cloudflare.Env }>()

extensionApp.get('/:version?', async (context) => {
  const url = new URL(
    '/repos/ithacaxyz/porto/releases/latest',
    'https://ungh.cc',
  )
  const response = await fetch(url)
  const data = await response.json()
  const { release } = await Schema.decodeUnknownPromise(ReleaseSchema)(data)
  // extract that starts with `https://github.com/ithacaxyz/porto/actions/runs` from release.markdown
  let downloadUrl = release.markdown.match(
    /https:\/\/github\.com\/ithacaxyz\/porto\/actions\/runs\/(.*)/,
  )?.[1]
  if (!downloadUrl)
    return context.json({ error: 'Download URL not found' }, 404)

  downloadUrl = downloadUrl.replaceAll(')', '')
  return context.redirect(
    `https://github.com/ithacaxyz/porto/actions/runs/${downloadUrl}`,
    302,
  )
})

const ReleaseSchema = Schema.Struct({
  release: Schema.Struct({
    assets: Schema.Array(Schema.Unknown),
    author: Schema.String,
    createdAt: Schema.String,
    draft: Schema.Boolean,
    html: Schema.String,
    id: Schema.Number,
    markdown: Schema.String,
    name: Schema.String,
    prerelease: Schema.Boolean,
    publishedAt: Schema.String,
    tag: Schema.String,
  }),
})
