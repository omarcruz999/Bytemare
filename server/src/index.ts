// server/src/index.ts
import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import opportunityRoutes from './routes/opportunityRoutes'
import volunteerRoutes from './routes/volunteerRoutes'
import organizationRoutes from './routes/organizationRoutes'

// Load local env first, then fall back to regular .env
dotenv.config({ path: '.env.local' })
dotenv.config()
const app = express()

// split these into two calls so TS picks the right overloads
app.use(cors())
app.use(express.json())

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    // Get connection info
    const conn = mongoose.connection;
    console.log(`✅ MongoDB connected: ${conn.host}`);
    console.log(`✅ Database name: ${conn.name}`);
    console.log(`✅ Connection state: ${conn.readyState === 1 ? 'connected' : 'disconnected'}`);
    
    // Check if we're connected to Atlas
    const isAtlas = conn.host.includes('mongodb.net');
    console.log(`✅ Connected to: ${isAtlas ? 'MongoDB Atlas (cloud)' : 'Local MongoDB'}`);
  })
  .catch(err => console.error('❌', err))

app.get('/', (req: Request, res: Response) => {
  res.send('API is running')
})

// Routes
app.use('/api/opportunities', opportunityRoutes)
app.use('/api/volunteers', volunteerRoutes)
app.use('/api/organizations', organizationRoutes)

const PORT = process.env.PORT ?? 5000
app.listen(PORT, () =>
  console.log(`🚀 Server listening on http://localhost:${PORT}`),
)
