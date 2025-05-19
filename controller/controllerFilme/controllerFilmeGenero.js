/**********************************************************************************
 * Objetivo: Controller responsável pela regra de negócio referente ao CRUD de Filme Genero
 * Data: 11/02/2025
 * Autor: Rebeka MP
 * Versão: 1.0
 **********************************************************************************/

//Import do arquivo de mensagens e status code do projeto
const message = require('../../modulo/config.js')

//Import do aquivo para realizar o CRUD de dados no Banco de Dados
const filmeGeneroDAO = require('../../model/DAO/filme_genero.js')

//Função para tratar a inserção de um novo genero no DAO
const inserirFilmeGenero = async function(filmeGenero, contentType) {
    try {
        // Validação do Content-Type
        if(String(contentType).toLowerCase() !== 'application/json') {
            return message.ERROR_CONTENT_TYPE;
        }

        // Validação dos campos
        if (!filmeGenero.id_filme || isNaN(filmeGenero.id_filme) || filmeGenero.id_filme <= 0 ||
            !filmeGenero.id_genero || isNaN(filmeGenero.id_genero) || filmeGenero.id_genero <= 0) {
            return message.ERROR_REQUIRED_FIELDS;
        }

        // Verificar se o filme existe
        const filmeExiste = await filmeDAO.selectFilmeById(filmeGenero.id_filme);
        if (!filmeExiste || filmeExiste.length === 0) {
            return {
                status: false,
                status_code: 404,
                message: "Filme não encontrado"
            };
        }

        // Verificar se o gênero existe
        const generoExiste = await generoDAO.selectByIdGenero(filmeGenero.id_genero);
        if (!generoExiste || generoExiste.length === 0) {
            return {
                status: false,
                status_code: 404,
                message: "Gênero não encontrado"
            };
        }

        // Inserir a relação
        const result = await filmeGeneroDAO.insertFilmeGenero({
            tbl_filme_id: filmeGenero.id_filme,
            tbl_genero_id: filmeGenero.id_genero
        });

        if(result) {
            // Retornar a relação criada com todos os dados
            const relacaoCriada = await filmeGeneroDAO.selectRelacaoFilmeGenero(
                filmeGenero.id_filme, 
                filmeGenero.id_genero
            );
            
            return {
                status: true,
                status_code: 201,
                message: "Relação criada com sucesso",
                data: relacaoCriada
            };
        } else {
            return message.ERROR_INTERNAL_SERVER_MODEL;
        }
    } catch (error) {
        console.error('Erro em inserirFilmeGenero:', error);
        return message.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
};
//Função para tratar a atualização de um genero no DAO
const atualizarFilmeGenero = async function(id, filmeGenero, contentType){
    try {
        if(String(contentType).toLowerCase() == 'application/json')
            {
                if (id                                == ''           || id                       == undefined    || id                    == null || isNaN(id)  || id  <= 0   ||
                    filmeGenero.id_filme              == ''           || filmeGenero.id_filme     == undefined    || filmeGenero.id_filme  == null || isNaN(filmeGenero.id_filme)  || filmeGenero.id_filme <=0 ||
                    filmeGenero.id_genero             == ''           || filmeGenero.id_genero    == undefined    || filmeGenero.id_genero == null || isNaN(filmeGenero.id_genero) || filmeGenero.id_genero<=0
                )
                {
                    return message.ERROR_REQUIRED_FIELDS //400
                }else{
                    //Validação para verificar se o ID existe no BD
                    let resultgenero = await filmeGeneroDAO.selectByIdFilmeGenero(parseInt(id))

                    if(resultgenero != false || typeof(resultgenero) == 'object'){
                        if(resultgenero.length > 0 ){
                            //Update
                            //Adiciona o ID do genero no JSON com os dados
                            genero.id = parseInt(id)

                            let result = await generoDAO.updateGenero(genero)

                            if(result){
                                return message.SUCESS_UPDATED_ITEM //200
                            }else{
                                return message.ERROR_INTERNAL_SERVER_MODEL //500
                            }
                        }else{
                            return message.ERROR_NOT_FOUND //404
                        }
                    }else{
                        return message.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                }
            }else{
                return message.ERROR_CONTENT_TYPE //415
            }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para tratar a exclusão de um genero no DAO
const excluirFilmeGenero = async function(id){
    try {
        if(id == '' || id == undefined || id == null || isNaN(id) || id <=0){
            return message.ERROR_REQUIRED_FIELDS //400
        }else{

            //Funcção que verifica se  ID existe no BD
            let resultgenero = await filmeGeneroDAO.selectByIdFilmeGenero(parseInt(id))

            if(resultgenero != false || typeof(resultgenero) == 'object'){
                //Se existir, faremos o delete
                if(resultgenero.length > 0){
                    //delete
                    let result = await generoDAO.deleteGenero(parseInt(id))

                    if(result){
                        return message.SUCCESS_DELETED_ITEM //200
                    }else{
                        return message.ERROR_INTERNAL_SERVER_MODEL //500
                    }
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

//Função para tratar o retorno de uma lista de generos do DAO
const listarFilmeGenero = async function(){
    try {
        //Objeto do tipo JSON
        let dadosgenero = {}
        //Chama a função para retornar os generos cadastrados
        let resultgenero = await filmeGeneroDAO.selectAllFilmeGenero()

        if(resultgenero != false || typeof(resultgenero) == 'object'){
            if(resultgenero.length > 0){
                //Criando um JSON de retorno de dados para a API
                dadosgenero.status = true
                dadosgenero.status_code = 200
                dadosgenero.items = resultgenero.length
                dadosgenero.films = resultgenero

                return dadosgenero
            }else{
                return message.ERROR_NOT_FOUND //404
            }
        }else{
            return message.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para tratar o retorno de um genero filtrando pelo ID do DAO
const buscarFilmeGenero = async function(id){
    try {
        if(id == '' || id == undefined || id == null || isNaN(id) || id <=0){
            return message.ERROR_REQUIRED_FIELDS //400
        }else{
            dadosgenero = {}

            let resultgenero = await filmeGeneroDAO.selectByIdFilmeGenero(parseInt(id))
            
            if(resultgenero != false || typeof(resultgenero) == 'object'){
                if(resultgenero.length > 0){
                     //Criando um JSON de retorno de dados para a API
                    dadosgenero.status = true
                    dadosgenero.status_code = 200
                    dadosgenero.genero = resultgenero

                    return dadosgenero //200
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

//Função para retornar os generos pelo id do filme

const buscarGeneroPorFilme = async function(idFilme) {
    try {
        if (!idFilme || isNaN(idFilme)) {
            return message.ERROR_REQUIRED_FIELDS;
        }

        let dadosGenero = {};
        let resultGenero = await filmeGeneroDAO.selectGenerosByFilmeId(parseInt(idFilme));

        if (resultGenero && resultGenero.length > 0) {
            dadosGenero.status = true;
            dadosGenero.status_code = 200;
            dadosGenero.genero = resultGenero;
            return dadosGenero;
        } else {
            return {
                status: true,
                status_code: 200,
                genero: []
            };
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}


//Função para retornar os filmes pelo id do genero
const buscarFilmePorGenero = async function(idGenero){

    try {
        if(idGenero == '' || idGenero == undefined || idGenero == null || isNaN(idGenero) || idGenero <=0){
            return message.ERROR_REQUIRED_FIELDS //400
        }else{
            dadosFilme = {}

            let resultFilme = await filmeGeneroDAO.selectFilmeByIdGenero(parseInt(idGenero))
            
            if(resultFilme != false || typeof(resultFilme) == 'object'){
                if(resultFilme.length > 0){
                     //Criando um JSON de retorno de dados para a API
                    dadosFilme.status = true
                    dadosFilme.status_code = 200
                    dadosFilme.filme = resultFilme

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



module.exports = {
    inserirFilmeGenero,
    atualizarFilmeGenero,
    excluirFilmeGenero,
    listarFilmeGenero,
    buscarFilmeGenero,
    buscarGeneroPorFilme,
    buscarFilmePorGenero
} 