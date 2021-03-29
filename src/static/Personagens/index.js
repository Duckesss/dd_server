import Utils from "../Utils.js"

const loading = new Utils.loading("Personagens")
$(document).ready(async function(){
    loading.show();
    await pageController.init();
    loading.hide();
})

const Personagem = class{
    constructor(personagem){
        this.personagem = personagem
    }
    getIcon(icone){
        if(icone)
            return `<span><img src="${icone}"></img></span>`
        return `<span class="material-icons">account_circle</span>`
    }
    getName(){
        return this.personagem.name.length > 10 ? this.personagem.name.substring(0,10) + '...' : this.personagem.name
    }
    getCard(){
        return `
        <li class="flex-center character-card">
            ${this.getIcon()}
            <span class="character-name">${this.getName()}</span>
        </li>
    `
    }
}

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
                    const personagem = new Personagem(novoPersonagem.data)
                    $("#personagensList").append(personagem.getCard())
                    loading.hide()
                })
            })
        }
    }
    return {
        eventsController,
        init: async function(){
            const self = this
            const dados = await this.getDados()
            await this.render(dados);
            Object.values(this.eventsController).forEach(e => e.apply(self))
        },
        getDados: new function(){
            const self = {
                getPersonagens: async function(){
                    const personagens = await Utils.fetch(`${Utils.urlServer}/characters/get`)
                    return personagens
                },
                getRacas: async function(){
                    const racas = await Utils.fetch(`${Utils.urlServer}/breed/getAll`)
                    return racas
                },
                getClasses: async function(){
                    const classes = await Utils.fetch(`${Utils.urlServer}/classes/getAll`)
                    return classes
                }
            }
            return async function(){
                const {data : personagens} = await self.getPersonagens();
                const {data: racas} = await self.getRacas();
                const {data: classes} = await self.getClasses();
                return {personagens,racas,classes}
            }
        },
        render: new function(){
            const self = {
                cardPersonagens: function(personagens){
                    const htmlPersonagens = personagens.reduce((html,personagem) => (
                        html += new Personagem(personagem).getCard()
                    ),'')
                    $("#personagensList").html(htmlPersonagens)
                },
                optionRacas: function(racas){
                    console.log(racas)
                },
                optionsClasses: function(classes){
                    console.log(classes)
                }
            }
            return function({personagens,racas,classes}){
                self.cardPersonagens(personagens);
                self.optionRacas(racas);
                self.optionsClasses(classes);
            }
        },
    }
})()
