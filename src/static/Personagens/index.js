import Utils from "../Utils.js"
import Router from "../routes/index.js";

const loading = new Utils.loading("Loading")
$(document).ready(async function(){
    loading.show();
    await pageController.init();
    loading.hide();
})

const Personagem = function(personagem){
    this.personagem = personagem.data || personagem
    const self = this
    return {
        getIcon(icone){
            if(icone)
                return `<span><img src="${icone}"></img></span>`
            return `<span class="material-icons">account_circle</span>`
        },
        getName(){
            return self.personagem.name.length > 10 ? self.personagem.name.substring(0,10) + '...' : self.personagem.name
        },
        getCard(){
            return `
            <li data-id="${self.personagem._id}" class="flex-center character-card">
                ${this.getIcon()}
                <span class="character-name">${this.getName()}</span>
            </li>
        `
        }
    }
}

const ServicesController = new function(){
    const self = {
        personagens: null, racas:null, classes: null,
        getPersonagens: async function(){
            const personagens = await Utils.fetch(`${Utils.urlServer}/characters/get`,{
                headers: {
                    authorization: localStorage.getItem("token")
                }
            })
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
    return {
        getDados: async function(){
            self.personagens = ( await self.getPersonagens() ).data.characters
            self.racas = ( await self.getRacas() ).data
            self.classes = ( await self.getClasses() ).data
            return {
                personagens: self.personagens,
                racas: self.racas,
                classes: self.classes
            }
        },
        getPersonagens: async function(){
            self.personagens = ( await self.getPersonagens() ).data.characters
            return self.personagens
        },
        getRacas: async function(){
            self.racas = ( await self.getRacas() ).data
            return self.racas
        },
        getClasses: async function(){
            self.classes = ( await self.getClasses() ).data
            return self.classes
        }
    }
}

const RenderController = new function(){
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
    return {
        renderPage: function({personagens}){
            self.cardPersonagens(personagens);
        },
        renderModal: function({racas,classes}){
            self.optionRacas(racas);
            self.optionsClasses(classes);
        }
    }
}

const GetAndRender = new function(){
    return {
        page: async function(){
            const personagens = await ServicesController.getPersonagens()
            await RenderController.renderPage({personagens});
        },
        modal: async function(){
            const racas = await ServicesController.getRacas()
            const classes = await ServicesController.getClasses()
            await RenderController.renderModal({racas,classes});
        }
    }
}

const eventsController = new function(){
    return {
        addPersonagemModal: {
            bindOpenModal:function(){
                const self = this
                $("#addPersonagem").on("click", async function(){
                    loading.show()
                    self.removeModal()
                    self.adicionaModal();
                    await GetAndRender.modal()
                    self.bindCriarPersonagem()
                    self.bindRemoveModal()
                    loading.hide()
                })
            },
            removeModal: function(){
                $("#addPersonagemModal").remove()
            },
            adicionaModal: function(){
                $("body").prepend($("#tplAddPersonagem").html())
                $("#addPersonagemModal").show()
            },
            bindCriarPersonagem: function(){
                $("#criarPersonagem").on("click",async function(){
                    loading.show()
                    const values = {
                        name:$('#nomePersonagem').val(),
                        breed:$('#racaPersonagem').val(),
                        class:$('#classePersonagem').val()
                    }
                    const novoPersonagem = await Utils.fetch(`${Utils.urlServer}/characters/create`,{
                        method: "POST",
                        body: values,
                        headers:{
                            authorization: localStorage.getItem("token")
                        }
                    })
                    const personagem = new Personagem(novoPersonagem.data)
                    $("#personagensList").append(personagem.getCard())
                    loading.hide()
                })
            },
            bindRemoveModal(){
                const self = this
                $("#btnCloseModal").on('click',function(){
                    self.removeModal();
                })
            }
        },
        clickPersonagemCard: function(){
            $('.character-card').on('click',function(){
                Router().navigate(`Personagem?id=${this.dataset.id}`)
            })
        }
    }
}

const pageController = new function(){
    const _private = {
        bindEvents: function(){
            Object.values(eventsController).forEach(event => (
                typeof event == "function" && event()
            ))
            eventsController.addPersonagemModal.bindOpenModal()
        },
    }
    return {
        init: async function(){
            await GetAndRender.page();
            _private.bindEvents();
        }
    }
}
