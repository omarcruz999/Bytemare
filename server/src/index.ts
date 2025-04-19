// server/src/index.ts
import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

// split these into two calls so TS picks the right overloads
app.use(cors())
app.use(express.json())

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌', err))

app.get('/', (req: Request, res: Response) => {
  res.send('API is running')
})

const PORT = process.env.PORT ?? 5000
app.listen(PORT, () =>
  console.log(`🚀 Server listening on http://localhost:${PORT}`),
)
