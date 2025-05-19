/***************************************************************************************************************************
 * OBJETIVO: Criar a comunicação com o Banco de Dados para fazer o CRUD de filme
 * DATA: 11/02/2025
 * AUTOR: Rebeka 
 * Versão: 1.0
 **************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

//------------------------------------------------------

const insertUsuario = async function(usuario) {
    try {
        let sql = `insert into tbl_usuario (nome, email, senha) values ('${usuario.nome}', '${usuario.email}', '${usuario.senha}')`
        let result = await prisma.$executeRawUnsafe(sql)
        return result ? true : false
    } catch (error) {
        return false
    }
}
//------------------------------------------------------

const updateUsuario = async function(usuario) {
    try {
        let sql = `UPDATE tbl_usuario 
                   SET nome  = '${usuario.nome}',
                       email = '${usuario.email}',
                       senha = '${usuario.senha}'
                   WHERE id = ${usuario.id}`;
        
        let resultUsuario = await prisma.$executeRawUnsafe(sql);

        if (resultUsuario)
            return true;
        else
            return false;
    } catch (error) {
        console.error("Erro no updateUsuario:", error);
        return false;
    }
}


//------------------------------------------------------


const deleteUsuario = async function(id) {
    try {
        let sql = `delete from tbl_usuario where id = ${id}`
        let result = await prisma.$executeRawUnsafe(sql)
        
        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}


//------------------------------------------------------


const selectAllUsuario = async function() {
    try {
        let sql = `select * from tbl_usuario order by id desc`
        return await prisma.$queryRawUnsafe(sql)
    } catch (error) {
        return false
    }
}

//------------------------------------------------------


const selectByIdUsuario = async function(id) {
    try {
        let sql = `select * from tbl_usuario where id = ${id}`
        return await prisma.$queryRawUnsafe(sql)
    } catch (error) {
        return false
    }
}

//------------------------------------------------------


module.exports = {
    insertUsuario,
    updateUsuario,
    deleteUsuario,
    selectAllUsuario,
    selectByIdUsuario
}
