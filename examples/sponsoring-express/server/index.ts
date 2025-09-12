import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { Route, Router } from 'porto/server'
import ViteExpress from 'vite-express'

const app = express()
const porto = Router({ basePath: '/porto' }).route(
  '/merchant',
  Route.merchant({
    address: process.env.MERCHANT_ADDRESS as `0x${string}`,
    key: process.env.MERCHANT_PRIVATE_KEY as `0x${string}`,
  }),
)

app.use(cors())
app.use(porto.listener)

ViteExpress.listen(app, 5173)
