import Utils from "../Utils.js"

const loading = new Utils.loading("Personagens")
$(document).ready(async function(){
    loading.show();
    await pageController.init();
    loading.hide();
})

const pageController = (function(){
    const eventsController = {
        addPersonagem: function(){
            $("#addPersonagem").on("click", async function(){
                $("addPersonagemModal").remove()
                $("body").prepend(`
                    <div id="addPersonagemModal" class="gray-background">
                        <input placeholder="nome do personagem" id="nomePersonagem">
                        <input placeholder="raça do personagem" id="racaPersonagem">
                        <input placeholder="classe do personagem" id="classePersonagem">
                        <button id="criarPersonagem">Criar!</button>
                    </div>
                `)
                $("#criarPersonagem").on("click",async function(){
                    const values = {
                        name:$('#nomePersonagem').val(),
                        breed:$('#racaPersonagem').val(),
                        class:$('#classePersonagem').val()
                    }
                    loading.show()
                    const novoPersonagem = await Utils.fetch(`${Utils.getServerURL()}/characters/create`,{
                        method: "POST",
                        body: values
                    })
                    console.log(novoPersonagem)
                    const li = `<li>${novoPersonagem.data.name}</li>`
                    $("#personagensList").append(li)
                    loading.hide()
                })
            })
        }
    }
    return {
        eventsController,
        init: async function(){
            const self = this
            await this.render();
            Object.values(this.eventsController).forEach(e => e.apply(self))
        },
        render: async function(){
            const personagens = await this.getPersonagens();
            const htmlPersonagens = personagens.data.reduce((html,personagem) => (
                html += `<li>${personagem.name}</li>`
            ),'')
            $("#personagensList").html(htmlPersonagens)
        },
        getPersonagens: async function(){
            const personagens = await Utils.fetch(`${Utils.getServerURL()}/characters/get`)
            return personagens
        }
    }
})()
