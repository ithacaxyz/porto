import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { MerchantRpc } from 'porto/server'
import ViteExpress from 'vite-express'

const app = express()

app.use(cors())

app.all(
  '/rpc',
  MerchantRpc.requestListener({
    address: process.env.MERCHANT_ADDRESS,
    key: process.env.MERCHANT_PRIVATE_KEY,
  }),
)

ViteExpress.listen(app, 5173)
