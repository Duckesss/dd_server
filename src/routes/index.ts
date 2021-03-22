import { Router } from 'express'
const routes = Router()

routes.get('/ping', (req, res) => {
  return res.status(200).json({ pong: 1 })
})

export default routes
