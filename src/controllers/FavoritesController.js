const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class FavoritesController{
    async create(request, response){
        const user_id = request.user.id;
        const { name, isFavorite } = request.body;

        if(!user_id){
            throw new AppError("Você deve estar logado para adicionar ou remover os seus favoritos");
        }

        if(!name){
            throw new AppError("O nome do prato favorito deve ser fornecido");
        }

        const checkIfPlateExists = await knex("plates").where({ name }).first();

        if(!checkIfPlateExists){
            throw new AppError("O prato indicado não consta na base de dados");
        }

        const plate_id = checkIfPlateExists.id;

        if(isFavorite !== true){
            response.json({ name, isFavorite });
        } else{
            await knex("favorites").insert({ user_id, plate_id });
        }
        
        response.json("Favorito adicionado");
    }

    async index(request, response){
        const user_id = request.user.id;

        let favorites = await knex("favorites")
        .where({ user_id })
        .select([
            "plates.name",
            "plates.category"
        ])
        .innerJoin("plates", "plates.id", "favorites.plate_id")
        .orderBy("plates.name");
        
        response.json({ favorites });
    }

    async delete(request, response){
        const user_id = request.user.id;
        const favorite_id = request.params.id;
        const { isFavorite } = request.body;

        if(!user_id){
            throw new AppError("Você deve estar logado para adicionar ou remover os seus favoritos");
        }

        if(isFavorite === false){
            await knex("favorites").where({ "id": favorite_id }).delete();
        }

        response.json({});
    }
}

module.exports = FavoritesController;