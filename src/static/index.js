$(document).ready(function(){
    pageController.init();
})

const pageController = (function(){
    const eventsController = {
        login: function(){
            $("#login").on("click", async function(){
                try{
                    const response = await restFetch("http://localhost:5000/user/login",{
                        method:"POST",
                        body: {
                            username: $("#username").val(),
                            password: $("#password").val(),
                        }
                    })
                    const respostaVazia = response.data.isEmpty()
                    if(respostaVazia){
                        alert("Crie um novo usuário")
                    }else{
                        alert("Logado com sucesso!")
                    }
                }catch(err){
                    
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
