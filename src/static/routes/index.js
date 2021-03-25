import Router, {RouterFactory} from "./Router.js"

const routerInstance = new Router('defaultRouter', [
    new RouterFactory("index","/"),
    new RouterFactory("CriarConta"),
    new RouterFactory("Personagens"),
])

export default routerInstance