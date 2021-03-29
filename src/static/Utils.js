const Utils = new function(){
    const self = {
        parseFetch: function(promise){
            return new Promise(async (resolve,reject) => {
                try{
                    let request = await promise
                    if(!request.ok){
                        const textError = await request.text();
                        return reject(new Error(textError))
                    }
                    request = await request.json();
                    resolve(request)
                }catch(err){
                    reject(err)
                }
            })
        },
        // urlServer: "http://34.224.1.189:5000",
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
        get urlServer(){
            return self.urlServer
        },
        loading: function(label){
            return {
                show: _ => console.log(`Carregando ${label}...`),
                hide: _ => console.log(`${label} carregado!`),
                get label(){
                    return label
                },
                set label(_label){
                    label = _label
                }
            }
        },
        isEmpty: function(){
            return Object.values(this).length === 0
        }
    }
    return {...publico}
}
export default Utils