/*******************************************************************************************
 * OBJETIVO: Controller responsável pela regra de negócio referente ao CRUD de Idioma
 * DATA: 18/04/2025
 * AUTOR: Rebeka (atualizado por ChatGPT)
 * VERSÃO: 2.0
 *******************************************************************************************/

//Import do arquivo de mensagens e status code do projeto
const message = require('../../modulo/config.js')

//Import do aquivo para realizar o CRUD de dados no Banco de Dados
const idiomaDAO = require('../../model/DAO/idioma.js')

//Função para tratar a inserção de um novo idioma no DAO
const inserirIdioma = async function (idioma, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            if (idioma.nome === '' || idioma.nome === undefined || idioma.nome === null || idioma.nome.length > 45) {
                return message.ERROR_REQUIRED_FIELDS //400
            } else {
                let result = await idiomaDAO.insertIdioma(idioma)

                if (result) {
                    return message.SUCESS_CREATED_ITEM //201
                } else {
                    return message.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para tratar a atualização de um idioma no DAO
const atualizarIdioma = async function (id, idioma, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            if (
                id === '' || id === undefined || id === null || isNaN(id) || id <= 0 ||
                idioma.nome === '' || idioma.nome === undefined || idioma.nome === null || idioma.nome.length > 45
            ) {
                return message.ERROR_REQUIRED_FIELDS //400
            } else {
                let idiomaExistente = await idiomaDAO.selectByIdIdioma(parseInt(id))

                if (idiomaExistente != false || typeof idiomaExistente === 'object') {
                    if (idiomaExistente.length > 0) {
                        idioma.id = parseInt(id)
                        let result = await idiomaDAO.updateIdioma(idioma)

                        if (result) {
                            return message.SUCESS_UPDATED_ITEM //200
                        } else {
                            return message.ERROR_INTERNAL_SERVER_MODEL //500
                        }
                    } else {
                        return message.ERROR_NOT_FOUND //404
                    }
                } else {
                    return message.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para tratar a exclusão de um idioma no DAO
const excluirIdioma = async function (id) {
    try {
        if (id === '' || id === undefined || id === null || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS //400
        } else {
            let idiomaExistente = await idiomaDAO.selectByIdIdioma(parseInt(id))

            if (idiomaExistente != false || typeof idiomaExistente === 'object') {
                if (idiomaExistente.length > 0) {
                    let result = await idiomaDAO.deleteIdioma(parseInt(id))

                    if (result) {
                        return message.SUCCESS_DELETED_ITEM //200
                    } else {
                        return message.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return message.ERROR_NOT_FOUND //404
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para tratar o retorno de todos os idiomas
const listarIdiomas = async function () {
    try {
        let dadosIdioma = {}
        let result = await idiomaDAO.selectAllIdiomas()

        if (result != false || typeof result === 'object') {
            if (result.length > 0) {
                dadosIdioma.status = true
                dadosIdioma.status_code = 200
                dadosIdioma.items = result.length
                dadosIdioma.idiomas = result

                return dadosIdioma
            } else {
                return message.ERROR_NOT_FOUND //404
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para buscar um idioma por ID
const buscarIdioma = async function (id) {
    try {
        if (id === '' || id === undefined || id === null || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS //400
        } else {
            let dadosIdioma = {}
            let result = await idiomaDAO.selectByIdIdioma(parseInt(id))

            if (result != false || typeof result === 'object') {
                if (result.length > 0) {
                    dadosIdioma.status = true
                    dadosIdioma.status_code = 200
                    dadosIdioma.idioma = result

                    return dadosIdioma //200
                } else {
                    return message.ERROR_NOT_FOUND //404
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para buscar idiomas por nome
const buscarIdiomaPorNome = async function (nome) {
    try {
        if (nome === '' || nome === undefined || nome === null) {
            return message.ERROR_REQUIRED_FIELDS //400
        } else {
            let dadosIdioma = {}
            let result = await idiomaDAO.selectByNomeIdioma(nome)

            if (result != false || typeof result === 'object') {
                if (result.length > 0) {
                    dadosIdioma.status = true
                    dadosIdioma.status_code = 200
                    dadosIdioma.items = result.length
                    dadosIdioma.idiomas = result

                    return dadosIdioma //200
                } else {
                    return message.ERROR_NOT_FOUND //404
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

module.exports = {
    inserirIdioma,
    atualizarIdioma,
    excluirIdioma,
    listarIdiomas,
    buscarIdioma,
    buscarIdiomaPorNome
}
