const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class PlatesController {
    async create(request, response){
        const { name, category, price, description, ingredients } = request.body;
        const user_id = request.params.user_id;
        
        const user = await knex("users").where({ "id": user_id }).first();
        
        if(!user){
            throw new AppError("Utilizador não encontrado");
        }

        if(user.role != "admin"){
            throw new AppError("Apenas administradores podem cadastrar novos pratos");
        }

        const checkPlateExists = await knex("plates").where({ name }).first();

        if(checkPlateExists){
            throw new AppError("Já foi cadastrado um prato com este nome.");
        }

        if(!name || !price || !category){
            throw new AppError("Verifique se preencheu todas as informações obrigatórias sobre o prato.");
        }

        const [ plate_id ] = await knex("plates").insert({ name, category, price, description });

        const ingredientsInsert = ingredients.map(name => {
            return {
                plate_id,
                name
            }
        });

        await knex("ingredients").insert(ingredientsInsert);
        

        response.json({ name, category, price, description, ingredients });
    }

    async update(request, response){
        const { name, category, price, description, ingredients } = request.body;
        const plate_id = request.params.id;

        const plate = await knex("plates").where({ "id": plate_id }).first();

        if(!plate){
            throw new AppError("Não foi encontrado nenhum prato");
        }

        plate.name = name ?? plate.name;
        plate.category = category ?? plate.category;
        plate.price = price ?? plate.price;
        plate.description = description ?? plate.description;

        await knex("plates").update({ name, category, price, description }). where({ "id": plate_id });

        
        const checkIfNewIngredients = await knex("ingredients").where({ plate_id });

        const existingIngredientNames = checkIfNewIngredients.map(ingredient => ingredient.name);
        
        // Comparar o existingIngredientNames com o ingredients 
        // Remover os ingredients que não constem no array de ingredients vindo do update
        // Adicionar os novos ingredientes que constem no array de ingredients vindo do update


        response.json({ name, category, price, description });
    }
}

module.exports = PlatesController;