const Utils = new function(){
    const self = {
        parseFetch: function(promise){
            return new Promise(async (resolve,reject) => {
                let request = await promise
                if(!request.ok){
                    const textError = await request.text();
                    return reject(new Error(textError))
                }
                request = await request.json();
                resolve(request)
            })
        },
        urlServer: "http://localhost:5000",
    }
    const publico = {
        fetch: function(url,config){
            return self.parseFetch(fetch(url,{
                ...config,
                ...( config?.body? {body: JSON.stringify(config.body)} : {} ),
                headers:{
                    ...(config?.headers || {}),
                    "Content-Type": "application/json"
                },
            }))
        },
        getServerURL: _ => self.urlServer,
        loading: function(label){
            return {
                show: _ => console.log(`Carregando ${label}...`),
                hide: _ => console.log(`${label} carregado!`),
            }
        }
    }
    return {
        ...publico
    }
}
Object.prototype.isEmpty = function(){
    return Object.values(this).length === 0
}
export default Utils