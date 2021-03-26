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
                $("#addPersonagemModal").remove()
                $("body").prepend($("#tplAddPersonagem").html())
                $("#addPersonagemModal").show()
                $("#criarPersonagem").on("click",async function(){
                    const values = {
                        name:$('#nomePersonagem').val(),
                        breed:$('#racaPersonagem').val(),
                        class:$('#classePersonagem').val()
                    }
                    loading.show()
                    const novoPersonagem = await Utils.fetch(`${Utils.urlServer}/characters/create`,{
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
                html += `
                    <li class="flex-center character-card">
                        ${Utils.characterIcon()}
                        <span class="character-name">${personagem.name.length > 10 ? personagem.name.substring(0,10) + '...' : personagem.name}</span>
                    </li>
                `
            ),'')
            $("#personagensList").html(htmlPersonagens)
        },
        getPersonagens: async function(){
            const personagens = await Utils.fetch(`${Utils.urlServer}/characters/get`)
            return personagens
        }
    }
})()
