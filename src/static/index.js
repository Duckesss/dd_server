import Utils from "./Utils.js";
import Router from "./routes/index.js";

$(document).ready(function(){
    pageController.init();
})

const pageController = (function(){
    const eventsController = {
        login: function(){
            $("#login").on("click", async function(){
                try{
                    const response = await Utils.fetch(`${Utils.urlServer}/user/login`,{
                        method:"POST",
                        body: {
                            username: $("#username").val(),
                            password: $("#password").val(),
                        }
                    })
                    const respostaVazia = Utils.isEmpty(response.data)
                    if(respostaVazia){
                        Router().navigate("CriarConta")
                    }else{
						const {token} = response.data
						localStorage.setItem("token",token)
                        Router().navigate("Personagens")
                    }
                }catch(err){
                    alert("ERRO")
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
