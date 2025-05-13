/***************************************************************************************************************************
 * OBJETIVO: Criar a comunicação com o Banco de Dados para fazer o CRUD de filme
 * DATA: 11/02/2025
 * AUTOR: Rebeka 
 * Versão: 1.0
 **************************************************************************************************************************/
//Import da biblioteca do prisma client para executar os scripts SQL
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()



//Objeto tipo JSON
//Funcao para inserir um novo filme

//------------------------------------------------------
//inserir filme
const insertFilme = async (filme) => {
    try {
        let result = await prisma.tb_filme.create({
            data: {
                nome: filme.nome,
                duracao: filme.duracao,
                sinopse: filme.sinopse,
                data_lancamento: filme.data_lancamento,
                foto_capa: filme.foto_capa,
                link_trailer: filme.link_trailer,
                id_classificacao: filme.id_classificacao,
                tb_pais_id: parseInt(filme.tb_pais_id),
                tb_idioma_id: parseInt(filme.tb_idioma_id)
            }
        })
        return result
    } catch (error) {
        console.log(error)
        return false
    }
}
//------------------------------------------------------

// atualizar filme
const updateFilme = async (filme) => {
    try {
        let result = await prisma.tb_filme.update({
            where: {
                id: parseInt(filme.id)
            },
            data: {
                nome: filme.nome,
                duracao: filme.duracao,
                sinopse: filme.sinopse,
                data_lancamento: filme.data_lancamento,
                foto_capa: filme.foto_capa,
                link_trailer: filme.link_trailer,
                id_classificacao: filme.id_classificacao,
                tb_pais_id: parseInt(filme.tb_pais_id),
                tb_idioma_id: parseInt(filme.tb_idioma_id)
            }
        })
        return result
    } catch (error) {
        console.log(error)
        return false
    }
}
//------------------------------------------------------


//funcao para excluir um filme existente
const deleteFilme=async function (id) {
    try {
        let sql = `delete from tbl_filme where id = ${id}`
        let result = await prisma.$executeRawUnsafe(sql) //execute para quando não precisar retornsr

        if (result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

//------------------------------------------------------

//Funcao para retornar todos os filmes existentes
const selectAllFilme = async function () {
    try {
        let sql = 'select * from tbl_filme order by id desc'
        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return result
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}


//------------------------------------------------------

//funco para buscar um filme pelo id
const selectByIdFilme=async function (id) {
    try {
        let sql =`select * from tbl_filme where id = ${id}`

        let result = await prisma.$queryRawUnsafe(sql) //executando script no banco, query sempre que precisar retornar

        if (result)
            return result 
        else
            return false

    } catch (error) {
        return false
    }
}

//------------------------------------------------------

const selectFilmeByPais = async function (idPais) {
    try {
        const sql = `SELECT * FROM tbl_filme WHERE tb_pais_id = ${idPais}`;
        const result = await prisma.$queryRawUnsafe(sql);
        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
}



//*UM SELECT PARA CADA FUNCTION*

module.exports = {
    insertFilme,
    updateFilme,
    deleteFilme,
    selectAllFilme,
    selectByIdFilme,
    selectFilmeByPais
}