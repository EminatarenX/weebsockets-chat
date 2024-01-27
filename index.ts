import express from 'express'
import {Server as SocketServer} from 'socket.io'
import userRoutes from './src/routes/users'
import { UserWebSocketAdapter } from './src/adapters/UserWebSocketAdapter'
import { cors } from './src/config/cors'
const app = express()
app.use(express.json())
app.use(cors)
app.use('/users', userRoutes)

const server = app.listen(4000, () => {
  console.log(`Server started on port 4000 :)`)
})

const io = new SocketServer(server,{
  pingTimeout: 60000,
  cors: {
    origin: '*',
  }
})

const userWebsocketAdapter = new UserWebSocketAdapter(io)
userWebsocketAdapter.handleEvents()