const parseFetch = function(promise){
    return new Promise(async (resolve,reject) => {
        let request = await promise
        if(!request.ok){
            const textError = await request.text();
            return reject(new Error(textError))
        }
        request = await request.json();
        resolve(request)
    })
}
const restFetch = function(url,config){
    return parseFetch(fetch(url,{
        ...config,
        ...( config.body? {body: JSON.stringify(config.body)} : {} ),
        headers:{
            ...(config.headers || {}),
            "Content-Type": "application/json"
        },
    }))
}

Object.prototype.isEmpty = function(){
    return Object.values(this).length === 0
}