import express from 'express'
import routes from './routes'
// import{loggerMiddleware} from "./middlewares/Logger";
import cors from 'cors'
class App {
    public express: express.Application
    constructor () {
      this.express = express()
      this.middlewares()
      this.routes()
    }

    private middlewares () {
      this.express.use(express.json())
      this.express.use(cors())
      this.express.use(express.static('./src/static'))
    }

    private routes () {
      this.express.use(routes)
    }
}

export default new App().express
