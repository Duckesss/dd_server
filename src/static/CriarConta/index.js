import Utils from "../Utils.js"

$(document).ready(function(){
    pageController.init();
})

const pageController = (function(){
    const eventsController = {
        signIn: function(){
            $("#signIn").on("click", async function(){
                try{
                    const response = await Utils.fetch(`${Utils.urlServer}/user/create`,{
                            method:"POST",
                            body: {
                                name: $("#name").val(),
                                username: $("#username").val(),
                                password: $("#password").val()
                            },
                    })
                    const respostaVazia = Utils.isEmpty(response.data)
                    if(respostaVazia){
                        alert("Usuário já existente")
                    }else{
                        alert("Usuário criado com sucesso!")
                    }
                }catch(err){
                    console.error(err)
                }
            })
        }
    }
    return {
        eventsController,
        init: function(){
            const self = this
            Object.values(this.eventsController).forEach(e => e.apply(self))
        }
    }
})()
