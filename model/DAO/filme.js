/*******************************************************************************************************
 * Objetivo: Criar a comunicação com o Banco de Dados para fazer o CRUD de Filmes
 * Data: 06/05/2025
 * Autor: Rebeka Marcelino
 * Versão: 1.0
 ******************************************************************************************************/
//import da biblioteca do prisma client para executar os scripts SQL
const { PrismaClient } = require('@prisma/client')

//Instancia (criar um objeto a ser utilizado) a biblioteca do prisma/client
const prisma = new PrismaClient()
// Função para inserir um novo filme

/**********************************************************************************************************************************/

const insertFilme = async function (filme) {
    try {
        const sql = `
            INSERT INTO tbl_filme (
                nome,
                duracao,
                sinopse,
                data_lancamento,
                foto_capa,
                link_trailer,
                tbl_pais_id,
                tbl_idioma_id
            ) VALUES (
                '${filme.nome}',
                '${filme.duracao}',
                '${filme.sinopse}',
                '${filme.data_lancamento}',
                '${filme.foto_capa}',
                '${filme.link_trailer}',
                ${filme.tbl_pais_id},
                ${filme.tbl_idioma_id}
            )
        `;

        const result = await prisma.$executeRawUnsafe(sql);

        if (result) {
            return true
        } else {
            return false;
        }

    } catch (error) {
        return false;
    }
};

/**********************************************************************************************************************************/



//Função para atualizar um Filme existente
const updateFilme = async function(filme){
    try {
        let sql = `update tbl_filme set
                            nome = '${filme.nome}',
                            duracao = '${filme.duracao}',
                            sinopse = '${filme.sinopse}',
                            data_lancamento = '${filme.data_lancamento}',
                            foto_capa = ${filme.foto_capa ? `'${filme.foto_capa}'` : null},
                            link_trailer = ${filme.link_trailer ? `'${filme.link_trailer}'` : null},
                            tbl_pais_id = ${filme.tbl_pais_id},
                            tbl_idioma_id = ${filme.tbl_idioma_id}
                    where id = ${filme.id}`

        let resultFilme = await prisma.$executeRawUnsafe(sql)

        if(resultFilme)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}
/**********************************************************************************************************************************/


//Função para excluir um Filme existente
const deleteFilme = async function(id){
    try {
        let sql = `delete from tbl_filme where id = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else 
            return false
    } catch (error) {
        return false
    }
}

/**********************************************************************************************************************************/


//Função para retornar todos os Filmes existentes
const selectAllFilmes = async function(){
    try {
        let sql = 'select * from tbl_filme order by id desc'

        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
            return result
        else
            return false
    } catch (error) {
        return false
    }
}


/**********************************************************************************************************************************/

//Função para buscar um Filme pelo ID
const selectFilmeById = async function(id){
    try {
        let sql = `select * from tbl_filme where id = ${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if (result)
            return result
        else 
            return false
    } catch (error) {
        return false
    }
}


/**********************************************************************************************************************************/

const selectLastInsertId = async function() {
    try {
        let sql = 'select id from tbl_filme order by id desc limit 1';
        let result = await prisma.$queryRawUnsafe(sql);
        if (result)
            return result;
        else
            return false;
    } catch (error) {
        return false;
    }
}

/**********************************************************************************************************************************/
/**********************************************************************************************************************************/


module.exports = {
    insertFilme,
    updateFilme,
    deleteFilme,
    selectAllFilmes,
    selectFilmeById,
    selectLastInsertId
}