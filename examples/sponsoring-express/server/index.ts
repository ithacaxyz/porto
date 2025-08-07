import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { Route } from 'porto/server'
import ViteExpress from 'vite-express'

const app = express()

app.use(cors())

app.all(
  '/api',
  Route.merchant({
    address: process.env.MERCHANT_ADDRESS as `0x${string}`,
    key: process.env.MERCHANT_PRIVATE_KEY as `0x${string}`,
  }).listener,
)

ViteExpress.listen(app, 5173)
