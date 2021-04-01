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
    const _private = {
        getDados: new function(){
            let consultou = false
            const self = {
                personagens: null, racas:null, classes: null,
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
                if(consultou === false){
                    self.personagens = ( await self.getPersonagens() ).data
                    self.racas = ( await self.getRacas() ).data
                    self.classes = ( await self.getClasses() ).data
                    consultou = true
                }
                return {
                    personagens: self.personagens,
                    racas: self.racas,
                    classes: self.classes
                }
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
                    const htmlRacas = racas.reduce((html,raca) => (
                        html += `<option value="${raca._id}">${raca.name}</option>`
                    ),'')
                    $("#racaPersonagem").html(htmlRacas)
                },
                optionsClasses: function(classes){
                    const htmlClasses = classes.reduce((html,classe) => (
                        html += `<option value="${classe._id}">${classe.name}</option>`
                    ),'')
                    $("#classePersonagem").html(htmlClasses)
                }
            }
            return function({personagens,racas,classes}){
                self.cardPersonagens(personagens);
                self.optionRacas(racas);
                self.optionsClasses(classes);
            }
        },
        getAndRenderData: async function(){
            const dados = await _private.getDados()
            await this.render(dados);
        },
    }
    const _public = {
        init: async function(){
            const self = this
            await _private.getAndRenderData()
            Object.values(this.eventsController).forEach(e => e.apply(self))
        },
        eventsController: {
            addPersonagem: function(){
                $("#addPersonagem").on("click", async function(){
                    $("#addPersonagemModal").remove()
                    $("body").prepend($("#tplAddPersonagem").html())
                    $("#addPersonagemModal").show()
                    loading.show()
                    await _private.getAndRenderData()
                    loading.hide()
                    $("#criarPersonagem").on("click",async function(){
                        loading.show()
                        const values = {
                            name:$('#nomePersonagem').val(),
                            breed:$('#racaPersonagem').val(),
                            class:$('#classePersonagem').val()
                        }
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
    }
    return _public
})()
