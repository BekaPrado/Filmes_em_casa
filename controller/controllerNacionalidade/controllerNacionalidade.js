/**********************************************************************************
 * Objetivo: Controller responsável pela regra de negócio referente ao CRUD de nacionalidade
 * Data: 16/05/2025
 * Autor: Adaptado por ChatGPT com base no padrão do projeto
 * Versão: 2.0
 **********************************************************************************/

//Import do arquivo de mensagens e status code do projeto
const message = require('../../modulo/config.js')

//Import do arquivo para realizar o CRUD de dados no Banco de Dados
const nacionalidadeDAO = require('../../model/DAO/nacionalidade.js')

//Função para tratar a inserção de uma nova nacionalidade no DAO
const inserirNacionalidade = async function (nacionalidade, contentType) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            if (
                nacionalidade.nacionalidade == '' || nacionalidade.nacionalidade == undefined || nacionalidade.nacionalidade == null ||
                nacionalidade.nacionalidade.length > 45
            ) {
                return message.ERROR_REQUIRED_FIELDS //400
            } else {
                let resultNacionalidade = await nacionalidadeDAO.insertNacionalidade(nacionalidade)

                if (resultNacionalidade)
                    return message.SUCESS_CREATED_ITEM //201
                else
                    return message.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            return message.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para tratar a atualização de uma nacionalidade no DAO
const atualizarNacionalidade = async function (id, nacionalidade, contentType) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            if (
                id == '' || id == undefined || id == null || isNaN(id) || id <= 0 ||
                nacionalidade.nacionalidade == '' || nacionalidade.nacionalidade == undefined || nacionalidade.nacionalidade == null ||
                nacionalidade.nacionalidade.length > 45
            ) {
                return message.ERROR_REQUIRED_FIELDS //400
            } else {
                let resultNacionalidade = await nacionalidadeDAO.selectByIdNacionalidade(parseInt(id))

                if (resultNacionalidade != false || typeof (resultNacionalidade) == 'object') {
                    if (resultNacionalidade.length > 0) {
                        nacionalidade.id = parseInt(id)

                        let result = await nacionalidadeDAO.updateNacionalidade(nacionalidade)

                        if (result)
                            return message.SUCESS_UPDATED_ITEM //200
                        else
                            return message.ERROR_INTERNAL_SERVER_MODEL //500
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

//Função para tratar a exclusão de uma nacionalidade no DAO
const excluirNacionalidade = async function (id) {
    try {
        if (id == '' || id == undefined || id == null || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS //400
        } else {
            let resultNacionalidade = await nacionalidadeDAO.selectByIdNacionalidade(parseInt(id))

            if (resultNacionalidade != false || typeof (resultNacionalidade) == 'object') {
                if (resultNacionalidade.length > 0) {
                    let result = await nacionalidadeDAO.deleteNacionalidade(parseInt(id))

                    if (result)
                        return message.SUCCESS_DELETED_ITEM //200
                    else
                        return message.ERROR_INTERNAL_SERVER_MODEL //500
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

//Função para tratar o retorno de uma lista de nacionalidades do DAO
const listarNacionalidade = async function () {
    try {
        let dadosNacionalidade = {}

        let resultNacionalidade = await nacionalidadeDAO.selectAllNacionalidade()

        if (resultNacionalidade != false || typeof (resultNacionalidade) == 'object') {
            if (resultNacionalidade.length > 0) {
                dadosNacionalidade.status = true
                dadosNacionalidade.status_code = 200
                dadosNacionalidade.quantidade = resultNacionalidade.length
                dadosNacionalidade.nacionalidades = resultNacionalidade

                return dadosNacionalidade
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

//Função para tratar o retorno de uma nacionalidade filtrando pelo ID no DAO
const buscarNacionalidade = async function (id) {
    try {
        if (id == '' || id == undefined || id == null || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS //400
        } else {
            let dadosNacionalidade = {}

            let resultNacionalidade = await nacionalidadeDAO.selectByIdNacionalidade(parseInt(id))

            if (resultNacionalidade != false || typeof (resultNacionalidade) == 'object') {
                if (resultNacionalidade.length > 0) {
                    dadosNacionalidade.status = true
                    dadosNacionalidade.status_code = 200
                    dadosNacionalidade.nacionalidade = resultNacionalidade

                    return dadosNacionalidade
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

//Função para tratar o retorno de nacionalidades filtrando por nome no DAO
const buscarNacionalidadePorNome = async function (nome) {
    try {
        if (nome == '' || nome == undefined || nome == null) {
            return message.ERROR_REQUIRED_FIELDS //400
        } else {
            let dadosNacionalidade = {}

            let result = await nacionalidadeDAO.selectByNomeNacionalidade(nome)

            if (result != false || typeof (result) == 'object') {
                if (result.length > 0) {
                    dadosNacionalidade.status = true
                    dadosNacionalidade.status_code = 200
                    dadosNacionalidade.quantidade = result.length
                    dadosNacionalidade.nacionalidades = result

                    return dadosNacionalidade
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
    inserirNacionalidade,
    atualizarNacionalidade,
    excluirNacionalidade,
    listarNacionalidade,
    buscarNacionalidade,
    buscarNacionalidadePorNome
}
