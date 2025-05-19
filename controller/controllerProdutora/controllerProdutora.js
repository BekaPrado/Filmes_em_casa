/*******************************************************************************************
 * OBJETIVO: Controller responsável pela regra de negócio referente ao CRUD de Produtora
 * DATA: 13/05/2025
 * AUTORA: Adaptado por ChatGPT com base no padrão da aluna Rebeka
 * VERSÃO: 2.1
 *******************************************************************************************/

const message = require('../../modulo/config.js')
const produtoraDAO = require('../../model/DAO/produtora.js')
const paisDAO = require('../../model/DAO/pais.js') // para buscar o país de cada produtora

// Inserir nova produtora
const inserirProdutora = async function (produtora, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            if (
                produtora.nome == '' || produtora.nome == undefined || produtora.nome == null || produtora.nome.length > 45 ||
                produtora.fundacao == '' || produtora.fundacao == undefined || produtora.fundacao == null || produtora.fundacao.length > 45 ||
                produtora.pais == '' || produtora.pais == undefined || produtora.pais == null || produtora.pais.length > 20 ||
                produtora.tbl_pais_id == '' || produtora.tbl_pais_id == undefined || produtora.tbl_pais_id == null || isNaN(produtora.tbl_pais_id)
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                let result = await produtoraDAO.insertProdutora(produtora)

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

// Atualizar produtora
const atualizarProdutora = async function (id, produtora, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            if (
                id == '' || id == undefined || id == null || isNaN(id) || id <= 0 ||
                produtora.nome == '' || produtora.nome == undefined || produtora.nome == null || produtora.nome.length > 45 ||
                produtora.fundacao == '' || produtora.fundacao == undefined || produtora.fundacao == null || produtora.fundacao.length > 45 ||
                produtora.pais == '' || produtora.pais == undefined || produtora.pais == null || produtora.pais.length > 20 ||
                produtora.tbl_pais_id == '' || produtora.tbl_pais_id == undefined || produtora.tbl_pais_id == null || isNaN(produtora.tbl_pais_id)
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                let produtoraExistente = await produtoraDAO.selectByIdProdutora(parseInt(id))

                if (produtoraExistente != false || typeof(produtoraExistente) == 'object') {
                    if (produtoraExistente.length > 0) {
                        produtora.id = parseInt(id)
                        let result = await produtoraDAO.updateProdutora(produtora)

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

// Excluir produtora
const excluirProdutora = async function (id) {
    try {
        if (id == '' || id == undefined || id == null || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS // 400
        } else {
            let produtoraExistente = await produtoraDAO.selectByIdProdutora(parseInt(id))

            if (produtoraExistente != false || typeof(produtoraExistente) == 'object') {
                if (produtoraExistente.length > 0) {
                    let result = await produtoraDAO.deleteProdutora(parseInt(id))

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

// Listar todas as produtoras com país aninhado
// Listar todas as produtoras com país aninhado

const listarProdutoras = async function () {
    try {
        let dadosProdutoras = {}
        let result = await produtoraDAO.selectAllProdutoras()

        if (result && Array.isArray(result) && result.length > 0) {
            dadosProdutoras.status = true
            dadosProdutoras.status_code = 200
            dadosProdutoras.quantidade = result.length
            dadosProdutoras.produtoras = result
            return dadosProdutoras
        } else {
            return message.ERROR_NOT_FOUND
        }
    } catch (error) {
        console.log("listarProdutoras error:", error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}



// Buscar produtora por ID com país aninhado
const buscarProdutoraPorId = async function (id) {
    try {
        if (id == '' || id == undefined || id == null || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS // 400
        } else {
            let dadosProdutora = {}
            let result = await produtoraDAO.selectByIdProdutora(parseInt(id))

            if (result != false || typeof(result) == 'object') {
                if (result.length > 0) {
                    for (let item of result) {
                        let paisRelacionado = await paisDAO.selectByIdPais(item.tbl_pais_id)
                        item.pais = paisRelacionado[0]
                        delete item.tbl_pais_id
                    }

                    dadosProdutora.status = true
                    dadosProdutora.status_code = 200
                    dadosProdutora.produtora = result

                    return dadosProdutora
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

// Exportar funções
module.exports = {
    inserirProdutora,
    atualizarProdutora,
    excluirProdutora,
    listarProdutoras,
    buscarProdutoraPorId
}
