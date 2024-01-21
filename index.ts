import express from 'express'
import WebSocket from 'ws'
import userRoutes from './src/routes/users'
import { cors } from './src/config/cors'
const app = express()
app.use(express.json())
app.use(cors)
app.use('/users', userRoutes)

const server = app.listen(4000, () => {
  console.log(`Server started on port 4000 :)`)
})

const wss = new WebSocket.Server( { server})

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (message: string) => {
    console.log('Received: %s', message)
  })

  ws.send('Hi there, I am a WebSocket server')
})
