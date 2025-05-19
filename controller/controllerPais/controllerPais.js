/*******************************************************************************************
 * OBJETIVO: Controller responsável pela regra de negócio referente ao CRUD de País
 * DATA: 18/04/2025
 * AUTORA: Rebeka
 * VERSÃO: 1.0
 *******************************************************************************************/

// Import das mensagens de status
const message = require('../../modulo/config.js')

// Import do DAO
const paisDAO = require('../../model/DAO/pais.js')

// Inserir novo país
const inserirPais = async function(pais, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            if (pais.nome == '' || pais.nome == undefined || pais.nome == null || pais.nome.length > 45) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                let result = await paisDAO.insertPais(pais)

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

// Atualizar país
const atualizarPais = async function(id, pais, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            if (
                id == '' || id == undefined || id == null || isNaN(id) || id <= 0 ||
                pais.nome == '' || pais.nome == undefined || pais.nome == null || pais.nome.length > 45
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                let paisExistente = await paisDAO.selectByIdPais(parseInt(id))

                if (paisExistente != false || typeof(paisExistente) == 'object') {
                    if (paisExistente.length > 0) {
                        pais.id = parseInt(id)
                        let result = await paisDAO.updatePais(pais)

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

// Excluir país
const excluirPais = async function(id) {
    try {
        if (id == '' || id == undefined || id == null || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS // 400
        } else {
            let paisExistente = await paisDAO.selectByIdPais(parseInt(id))

            if (paisExistente != false || typeof(paisExistente) == 'object') {
                if (paisExistente.length > 0) {
                    let result = await paisDAO.deletePais(parseInt(id))

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

// Listar todos os países
const listarPaises = async function() {
    try {
        let dadosPais = {}
        let result = await paisDAO.selectAllPais()

        if (result != false || typeof(result) == 'object') {
            if (result.length > 0) {
                dadosPais.status = true
                dadosPais.status_code = 200
                dadosPais.quantidade = result.length
                dadosPais.paises = result

                return dadosPais
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

// Buscar país por ID
const buscarPaisPorId = async function(id) {
    try {
        if (id == '' || id == undefined || id == null || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS // 400
        } else {
            let dadosPais = {}
            let result = await paisDAO.selectByIdPais(parseInt(id))

            if (result != false || typeof(result) == 'object') {
                if (result.length > 0) {
                    dadosPais.status = true
                    dadosPais.status_code = 200
                    dadosPais.pais = result

                    return dadosPais // 200
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

// Buscar país por nome
const buscarPaisPorNome = async function(nome) {
    try {
        if (nome == '' || nome == undefined || nome == null) {
            return message.ERROR_REQUIRED_FIELDS // 400
        } else {
            let dadosPais = {}
            let result = await paisDAO.selectByNomePais(nome)

            if (result != false || typeof(result) == 'object') {
                if (result.length > 0) {
                    dadosPais.status = true
                    dadosPais.status_code = 200
                    dadosPais.paises = result

                    return dadosPais // 200
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

// Buscar filmes por país
const getFilmesPorPais = async function(idPais) {
    try {
        if (idPais == '' || idPais == undefined || idPais == null || isNaN(idPais) || idPais <= 0) {
            return message.ERROR_REQUIRED_FIELDS // 400
        } else {
            let result = await paisDAO.selectFilmesPorPais(parseInt(idPais))

            if (result != false || typeof(result) == 'object') {
                if (result.length > 0) {
                    return {
                        status: true,
                        status_code: 200,
                        quantidade: result.length,
                        filmes: result
                    }
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
    inserirPais,
    atualizarPais,
    excluirPais,
    listarPaises,
    buscarPaisPorId,
    buscarPaisPorNome,
    getFilmesPorPais
}
