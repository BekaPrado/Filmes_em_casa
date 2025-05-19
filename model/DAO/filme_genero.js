/*******************************************************************************************************
 * Objetivo: Criar a comunicação com o Banco de Dados para fazer o CRUD de FilmeGeneros
 * Data: 06/05/2025
 * Autor: Rebeka Marcelino
 * Versão: 1.0
 ******************************************************************************************************/
//import da biblioteca do prisma client para executar os scripts SQL
const { PrismaClient } = require('@prisma/client')

//Instancia (criar um objeto a ser utilizado) a biblioteca do prisma/client
const prisma = new PrismaClient()

//Função para inserir um novo FilmeGenero
const insertFilmeGenero = async function (dados) {
  try {
    let sql = `
      INSERT INTO tbl_filme_genero (
        tbl_filme_id,
        tbl_genero_id
      ) VALUES (
        ${dados.id_filme},
        ${dados.id_genero}
      )
    `;

    let result = await prisma.$executeRawUnsafe(sql);
    return result ? true : false;
  } catch (error) {
    console.error('Erro ao inserir relação filme-genero:', error);
    return false;
  }
};

//Função para atualizar um FilmeGenero existente
const updateFilmeGenero = async function(filmeGenero){
  try {
      let sql = `update tbl_filme_genero set        id_filme       = ${filmeGenero.id_filme},
                                                    id_genero      = ${filmeGenero.id_genero}
                                        
                            where id = ${ilmeGenero.id}                
                            `
      let resultFilmeGenero = await prisma.$executeRawUnsafe(sql)

      if(resultFilmeGenero)
        return true
      else
        return false
  } catch (error) {
    return false
  }
}

//Função para excluir um FilmeGenero existente
const deleteFilmeGenero = async function(id){
  try {
    let sql = `delete from tbl_filme_genero where id = ${id}`

    let result = await prisma.$executeRawUnsafe(sql)

    if (result)
      return true
    else 
      return false
  } catch (error) {
    return false
  }
}

//Função para retornar todos os FilmeGeneros existentes
const selectAllFilmeGenero = async function(){

    try {
      //ScriptSQL para retornar todos os dados
      let sql = 'select * from tbl_filme_genero order by id desc'

      //Executa o scriptSQL no BD e aguarda o retorno dos dados
      let result = await prisma.$queryRawUnsafe(sql)

      if(result)
        return result
      else
        return false

    } catch (error) {
      return false
    }
}

//Função para buscar um FilmeGenero pelo ID
const selectByIdFilmeGenero = async function(id){
  try {
    let sql = `select * from tbl_filme_genero where id = ${id}`

    let result = await prisma.$queryRawUnsafe(sql)

    if (result)
      return result
    else 
      return false
  } catch (error) {
    return false
  }
}

//Função para retornar os filmes pelo genero
const selectFilmeByIdGenero = async function(idGenero){
  try {
      let sql = `select tbl_filme.* from tbl_filme 
                                            inner join tbl_filme_genero
                                              on tbl_filme.id = tbl_filme_genero.id_filme
                                            inner join tbl_genero
                                              on tbl_genero.id = tbl_filme_genero.id_genero
                  where tbl_filme_genero.id_genero = ${idGenero}`

      let result = await prisma.$queryRawUnsafe(sql)

    if (result)
        return result
    else 
        return false
  } catch (error) {
      return false
  }
}


//Função para retornar os generos pelo Filme
const selectGenerosByFilmeId = async function (idFilme) {
    try {
        let sql = `
            SELECT g.id, g.nome
            FROM tbl_genero AS g
            INNER JOIN tbl_filme_genero AS fg
                ON g.id = fg.tbl_genero_id
            WHERE fg.tbl_filme_id = ${idFilme}
        `
        let result = await prisma.$queryRawUnsafe(sql)
        return result
    } catch (error) {
        console.error('Erro ao buscar gêneros do filme:', error)
        return false
    }
}

module.exports = {
    insertFilmeGenero,
    updateFilmeGenero,
    deleteFilmeGenero,
    selectAllFilmeGenero,
    selectByIdFilmeGenero,
    selectFilmeByIdGenero,
    selectGenerosByFilmeId
} 