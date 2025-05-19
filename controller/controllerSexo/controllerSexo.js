/*******************************************************************************************
 * OBJETIVO: Controller responsável pela regra de negócio referente ao CRUD de Sexo
 * DATA: 11/02/2025
 * AUTOR: Rebeka
 * VERSÃO: 1.0
 *******************************************************************************************/

// Import das mensagens de status
const message = require('../../modulo/config.js')

// Import do DAO
const sexoDAO = require('../../model/DAO/sexo.js')

// Inserir novo sexo
const inserirSexo = async function(sexo, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            if (sexo.descricao == '' || sexo.descricao == undefined || sexo.descricao == null || sexo.descricao.length > 45) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                let result = await sexoDAO.insertSexo(sexo)

                if (result)
                    return message.SUCESS_CREATED_ITEM // 201
                else
                    return message.ERROR_INTERNAL_SERVER_MODEL // 500
            }
        } else {
            return message.ERROR_CONTENT_TYPE // 415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

// Atualizar sexo
const atualizarSexo = async function(id, sexo, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            if (
                id == '' || id == undefined || id == null || isNaN(id) || id <= 0 ||
                sexo.descricao == '' || sexo.descricao == undefined || sexo.descricao == null || sexo.descricao.length > 45
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                let sexoExistente = await sexoDAO.selectByIdSexo(parseInt(id))

                if (sexoExistente != false || typeof(sexoExistente) == 'object') {
                    if (sexoExistente.length > 0) {
                        sexo.id = parseInt(id)
                        let result = await sexoDAO.updateSexo(sexo)

                        if (result)
                            return message.SUCESS_UPDATED_ITEM // 200
                        else
                            return message.ERROR_INTERNAL_SERVER_MODEL // 500
                    } else {
                        return message.ERROR_NOT_FOUND // 404
                    }
                } else {
                    return message.ERROR_INTERNAL_SERVER_MODEL // 500
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE // 415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

// Excluir sexo
const excluirSexo = async function(id) {
    try {
        if (id == '' || id == undefined || id == null || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS // 400
        } else {
            let sexoExistente = await sexoDAO.selectByIdSexo(parseInt(id))

            if (sexoExistente != false || typeof(sexoExistente) == 'object') {
                if (sexoExistente.length > 0) {
                    let result = await sexoDAO.deleteSexo(parseInt(id))

                    if (result)
                        return message.SUCCESS_DELETED_ITEM // 200
                    else
                        return message.ERROR_INTERNAL_SERVER_MODEL // 500
                } else {
                    return message.ERROR_NOT_FOUND // 404
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL // 500
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

// Listar todos os sexos
const listarSexos = async function() {
    try {
        let dadosSexo = {}
        let result = await sexoDAO.selectAllSexo()

        if (result != false || typeof(result) == 'object') {
            if (result.length > 0) {
                dadosSexo.status = true
                dadosSexo.status_code = 200
                dadosSexo.quantidade = result.length
                dadosSexo.sexos = result

                return dadosSexo
            } else {
                return message.ERROR_NOT_FOUND // 404
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_MODEL // 500
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

// Buscar sexo por ID
const buscarSexo = async function(id) {
    try {
        if (id == '' || id == undefined || id == null || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS // 400
        } else {
            let dadosSexo = {}
            let result = await sexoDAO.selectByIdSexo(parseInt(id))

            if (result != false || typeof(result) == 'object') {
                if (result.length > 0) {
                    dadosSexo.status = true
                    dadosSexo.status_code = 200
                    dadosSexo.sexo = result

                    return dadosSexo
                } else {
                    return message.ERROR_NOT_FOUND // 404
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL // 500
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

module.exports = {
    inserirSexo,
    atualizarSexo,
    excluirSexo,
    listarSexos,
    buscarSexo
}
