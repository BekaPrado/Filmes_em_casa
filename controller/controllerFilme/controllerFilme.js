/**********************************************************************************
 * Objetivo: Controller responsável pela regra de negócio referente ao CRUD de Filme 
 * Data: 11/02/2025
 * Autor: Rebeka Maarcelino
 * Versão: 1.1
 **********************************************************************************/


//import dos arquivos necessarios
const message = require('../../modulo/config.js');
const filmeDAO = require('../../model/DAO/filme.js');
const filmeGeneroDAO = require('../../model/DAO/filme_genero.js');
const generoDAO = require('../../model/DAO/genero.js');
const controllerPais = require('../controllerPais/controllerPais.js')
const controllerIdioma = require('../controllerIdioma/controllerIdioma.js')
const controllerFilmeGenero = require('../controllerFilme/controllerFilmeGenero.js')

/**********************************************************************************************************************************/
/**********************************************************************************************************************************/

//criar um filme
const inserirFilme = async function (filme, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            // Validações dos campos obrigatórios
            if (
                filme.nome == '' || filme.nome == undefined || filme.nome == null || filme.nome.length > 80 ||
                filme.duracao == '' || filme.duracao == undefined || filme.duracao == null || filme.duracao.length > 5 ||
                filme.sinopse == '' || filme.sinopse == undefined || filme.sinopse == null ||
                filme.data_lancamento == '' || filme.data_lancamento == undefined || filme.data_lancamento == null || filme.data_lancamento.length > 10 ||
                filme.foto_capa == undefined || filme.foto_capa.length > 200 ||
                filme.link_trailer == undefined || filme.link_trailer.length > 200 ||
                filme.tbl_pais_id == undefined || isNaN(filme.tbl_pais_id) ||
                filme.tbl_idioma_id == undefined || isNaN(filme.tbl_idioma_id)
            ) {
                return message.ERROR_REQUIRED_FIELDS; // 400
            } else {
                // Inserir o filme no banco
                let resultFilme = await filmeDAO.insertFilme(filme);

                if (resultFilme) {
                    // Buscar ID do último filme inserido
                    let filmeInserido = await filmeDAO.selectLastInsertId();
                    let idFilme = filmeInserido[0].id;

                    // Associar gêneros (se existirem)
                    if (filme.generos && Array.isArray(filme.generos)) {
                        for (let idGenero of filme.generos) {
                            if (idGenero && !isNaN(idGenero)) {
                                let filmeGenero = {
                                    id_filme: idFilme,
                                    id_genero: idGenero
                                };
                                await filmeGeneroDAO.insertFilmeGenero(filmeGenero);
                            }
                        }
                    }

                    return message.SUCESS_CREATED_ITEM; // 201
                } else {
                    return message.ERROR_INTERNAL_SERVER_MODEL; // 500
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE; // 415
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
    }
};



/**********************************************************************************************************************************/

//atualizar um filme

const atualizarFilme = async function(id, filme, contentType) {
  try {
   

    if (String(contentType).toLowerCase() == 'application/json') {
      if (
        id == '' || id == undefined || id == null || isNaN(id) || id <= 0 ||
        filme.nome == '' || filme.nome == undefined || filme.nome == null || filme.nome.length > 80 ||
        filme.duracao == '' || filme.duracao == undefined || filme.duracao == null || filme.duracao.length > 5 ||
        filme.sinopse == '' || filme.sinopse == undefined || filme.sinopse == null ||
        filme.data_lancamento == '' || filme.data_lancamento == undefined || filme.data_lancamento == null || filme.data_lancamento.length > 10 ||
        filme.foto_capa == undefined || filme.foto_capa.length > 200 ||
        filme.link_trailer == undefined || filme.link_trailer.length > 200 ||
        filme.tbl_pais_id == '' || filme.tbl_pais_id == undefined ||
        filme.tbl_idioma_id == '' || filme.tbl_idioma_id == undefined
      ) {
        return message.ERROR_REQUIRED_FIELDS;
      } else {
        // Verifica se o filme existe
        let resultFilme = await filmeDAO.selectFilmeById(parseInt(id));

        if (resultFilme != false && typeof(resultFilme) == 'object' && resultFilme.length > 0) {
          filme.id = parseInt(id);

          let result = await filmeDAO.updateFilme(filme);

          if (result) {
            return message.SUCESS_UPDATED_ITEM;
          } else {
            return message.ERROR_INTERNAL_SERVER_MODEL;
          }
        } else if (resultFilme.length == 0) {
          return message.ERROR_NOT_FOUND;
        } else {
          return message.ERROR_INTERNAL_SERVER_MODEL;
        }
      }
    } else {
      return message.ERROR_CONTENT_TYPE;
    }
  } catch (error) {
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

/**********************************************************************************************************************************/

//excluir
const excluirFilme = async function(id) {
  try {
    if (!id || isNaN(id) || id <= 0) {
      return message.ERROR_REQUIRED_FIELDS;
    }

    let filmeExistente = await filmeDAO.selectFilmeById(parseInt(id));

    if (!filmeExistente || filmeExistente.length === 0) {
      return message.ERROR_NOT_FOUND;
    }

    let result = await filmeDAO.deleteFilme(parseInt(id));

    return result ? message.SUCCESS_DELETED_ITEM : message.ERROR_INTERNAL_SERVER_MODEL;
  } catch (error) {
    console.log('excluirFilme controller error:', error);
    return message.ERROR_INTERNAL_SERVER_CONTROLLER;
  }
};

/**********************************************************************************************************************************/

//listar todos filmes

const listarFilme = async function () {
    try {
        let dadosFilme = {}
        let resultFilme = await filmeDAO.selectAllFilmes()

        if (resultFilme && Array.isArray(resultFilme) && resultFilme.length > 0) {
            dadosFilme.status = true
            dadosFilme.status_code = 200
            dadosFilme.message = "Filmes listados com sucesso."
            dadosFilme.filmes = []

            for (const itemFilme of resultFilme) {
                // país
                const dadosPais = await controllerPais.buscarPaisPorId(itemFilme.tbl_pais_id)
                itemFilme.pais = dadosPais?.pais || null
                delete itemFilme.tbl_pais_id

                // idioma
                const dadosIdioma = await controllerIdioma.buscarIdioma(itemFilme.tbl_idioma_id)
                itemFilme.idioma = dadosIdioma?.idioma || null
                delete itemFilme.tbl_idioma_id

                //  gêneros
                const generos = await filmeGeneroDAO.selectGenerosByFilmeId(itemFilme.id)
                itemFilme.generos = generos || []

                // formatar data
                if (itemFilme.data_lancamento) {
                    itemFilme.data_lancamento = itemFilme.data_lancamento.toISOString().slice(0, 10)
                }

                dadosFilme.filmes.push(itemFilme)
            }

            return dadosFilme
        } else {
            return message.ERROR_NOT_FOUND // 404
        }

    } catch (error) {
        console.error('listarFilme error:', error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}


/**********************************************************************************************************************************/

//buscar filmes por id
const buscarFilme = async function(id) {
    try {
        let arrayFilmes = [];

        if (id == '' || id == undefined || id == null || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS; // 400
        } else {
            let dadosFilme = {};
            let resultFilme = await filmeDAO.selectFilmeById(parseInt(id));

            if (resultFilme != false || typeof resultFilme == 'object') {
                if (resultFilme.length > 0) {

                    for (const itemFilme of resultFilme) {

                        //  país
                        let dadosPais = await controllerPais.buscarPaisPorId(itemFilme.tbl_pais_id);
                        itemFilme.pais = dadosPais.pais;
                        delete itemFilme.tbl_pais_id;

                        // idioma
                        let dadosIdioma = await controllerIdioma.buscarIdioma(itemFilme.tbl_idioma_id);
                        itemFilme.idioma = dadosIdioma.idioma;
                        delete itemFilme.tbl_idioma_id;

                        //gêneros
                        let dadosGenero = await controllerFilmeGenero.buscarGeneroPorFilme(itemFilme.id);
                        itemFilme.genero = dadosGenero.genero || [];

                        arrayFilmes.push(itemFilme);
                    }

                    dadosFilme.status = true;
                    dadosFilme.status_code = 200;
                    dadosFilme.films = arrayFilmes;

                    return dadosFilme; // 200
                } else {
                    return message.ERROR_NOT_FOUND; // 404
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL; // 500
            }
        }
    } catch (error) {
        console.error("Erro no controller buscarFilme:", error);
        return message.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
    }
};

/*const buscarFilme=async function(id){
    try {

        let arrayFilmes = []

        if(id == ''||id==undefined||id==null||isNaN(id)||id<=0){
            return message.ERROR_REQUIRED_FIELDS //400
        }else{

            dadosFilme={}

            let resultFilme=await filmeDAO.selectFilmeById(parseInt(id))

            if(resultFilme!=false||typeof(resultFilme)=='object'){
                if(resultFilme.length>0){
                     //Criando um JSON de retorno de dados para a API
                     dadosFilme.status = true
                     dadosFilme.status_code = 200
                     
                      //Precisamos utilizar o for of, pois o foreach não consegue trabalhar com 
                 // requisições async com await

                 for(const itemFilme of resultFilme){

                     //Busca os dados da classificação na controller de classificacao
                     let dadosPais = await controllerPais.buscarPaisPorId(itemFilme.tbl_pais_id)
                     
                     //Adiciona um atributo classificação no JSON de filmes e coloca os dados da classificação
                     itemFilme.pais = dadosPais.pais
                     
                     //Remover um atributo do JSON
                     delete itemFilme.tbl_pais_id
                     

                      let dadosIdioma = await controllerIdioma.buscarIdioma(itemFilme.tbl_idioma_id)
                     
                     //Adiciona um atributo classificação no JSON de filmes e coloca os dados da classificação
                     itemFilme.idioma = dadosIdioma.idioma
                     
                     //Remover um atributo do JSON
                     delete itemFilme.tbl_idioma_id

                     //Adiciona em um novo array o JSON de filmes com a sua nova estrutura de dados
                     arrayFilmes.push(itemFilme)
  
                 }
                 
                 dadosFilme.films = arrayFilmes
 
                     // dadosFilme.films = resultFilme
 
                     return dadosFilme //200
                }else{
                    return message.ERROR_NOT_FOUND //404
                }
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

*/
/**********************************************************************************************************************************/
/**********************************************************************************************************************************/


module.exports = {
  inserirFilme,
  atualizarFilme,
  excluirFilme,
  listarFilme,
  buscarFilme,
};
