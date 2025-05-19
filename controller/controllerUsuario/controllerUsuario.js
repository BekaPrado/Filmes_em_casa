/*******************************************************************************************
 * OBJETIVO: Controller responsável pela regra de negócio referente ao CRUD de Usuário
 * DATA: 11/02/2025
 * AUTOR: Rebeka
 * VERSÃO: 1.0
 *******************************************************************************************/

// Import das mensagens e códigos de status
const message = require('../../modulo/config.js')

// Import do DAO de Usuário
const usuarioDAO = require('../../model/DAO/usuario.js')

// Inserir novo usuário
const inserirUsuario = async function(usuario, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            if (
                usuario.nome == '' || usuario.nome == undefined || usuario.nome == null || usuario.nome.length > 45 ||
                usuario.email == '' || usuario.email == undefined || usuario.email == null || usuario.email.length > 45 ||
                usuario.senha == '' || usuario.senha == undefined || usuario.senha == null || usuario.senha.length > 45
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                let result = await usuarioDAO.insertUsuario(usuario)

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

// Atualizar usuário
const atualizarUsuario = async function(id, usuario, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            if (
                id == '' || id == undefined || id == null || isNaN(id) || id <= 0 ||
                usuario.nome == '' || usuario.nome == undefined || usuario.nome == null || usuario.nome.length > 45 ||
                usuario.email == '' || usuario.email == undefined || usuario.email == null || usuario.email.length > 45 ||
                usuario.senha == '' || usuario.senha == undefined || usuario.senha == null || usuario.senha.length > 45
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                let usuarioExistente = await usuarioDAO.selectByIdUsuario(parseInt(id))

                if (usuarioExistente != false || typeof(usuarioExistente) == 'object') {
                    if (usuarioExistente.length > 0) {
                        usuario.id = parseInt(id)
                        let result = await usuarioDAO.updateUsuario(usuario)

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

// Excluir usuário
const excluirUsuario = async function(id) {
    try {
        if (id == '' || id == undefined || id == null || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS // 400
        } else {
            let usuarioExistente = await usuarioDAO.selectByIdUsuario(parseInt(id))

            if (usuarioExistente != false || typeof(usuarioExistente) == 'object') {
                if (usuarioExistente.length > 0) {
                    let result = await usuarioDAO.deleteUsuario(parseInt(id))

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

// Listar todos os usuários
const listarUsuarios = async function() {
    try {
        let dadosUsuario = {}
        let result = await usuarioDAO.selectAllUsuario()

        if (result != false || typeof(result) == 'object') {
            if (result.length > 0) {
                dadosUsuario.status = true
                dadosUsuario.status_code = 200
                dadosUsuario.quantidade = result.length
                dadosUsuario.usuarios = result

                return dadosUsuario
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

// Buscar usuário por ID
const buscarUsuario = async function(id) {
    try {
        if (id == '' || id == undefined || id == null || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS // 400
        } else {
            let dadosUsuario = {}
            let result = await usuarioDAO.selectByIdUsuario(parseInt(id))

            if (result != false || typeof(result) == 'object') {
                if (result.length > 0) {
                    dadosUsuario.status = true
                    dadosUsuario.status_code = 200
                    dadosUsuario.usuario = result

                    return dadosUsuario
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
    inserirUsuario,
    atualizarUsuario,
    excluirUsuario,
    listarUsuarios,
    buscarUsuario
}
