import express from 'express'
import mongoose from 'mongoose'
import router from './config/routes.js'
import { port, dbURI } from './config/environment.js'

const app = express()

const startServer = async () => {
  try {
    // Attempt mongodb connection
    await mongoose.connect(dbURI)
    console.log('Mongodb connected')

    // --Middleware--
    // JSON Parser
    app.use(express.json()) // Adds the body from the request as JSON to req.body

    // Logger
    app.use((req, _res, next) => {
      console.log(`🚨 Request received: ${req.method} - ${req.url}`) // Generic log of request received
      next() // Move onto next middleware
    })

    // Routes
    app.use(router)

    // Catch All
    app.use((_req, res) => {
      return res.status(404).json({ message: 'Route Not Found' })
    })

    // If mongodb connects successfully, start node servers
    app.listen(port, () => console.log(`🚀 Server listening on port ${port}`))
  } catch (err) {
    console.log(err)
  }
}
startServer()