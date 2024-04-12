const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class PlatesController {
    async create(request, response){
        const { name, category, price, description, ingredients } = request.body;
        const user_id = request.user.id;
        const plateFile = request.file;

        if (!plateFile) {
            throw new AppError("Nenhum arquivo de imagem fornecido.");
        }
        
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

        const diskStorage = new DiskStorage();
        const filename = await diskStorage.saveFile(plateFile.filename);

        const [ plate_id ] = await knex("plates").insert({ 
            name, 
            category, 
            price, 
            description,
            image: filename,
        });

        const ingredientsInsert = ingredients.map(name => {
            return {
                plate_id,
                name
            }
        });

        await knex("ingredients").insert(ingredientsInsert);
        

        response.json({ name, category, price, description, ingredients, filename });
    }

    async update(request, response){
        const { name, category, price, description, ingredients } = request.body;
        const plate_id = request.params.id;
        const user_id = request.user.id;

        if(!user_id){
            throw new AppError("Utilizador não autorizado", 401);
        }

        const user = await knex("users").where({ "id": user_id }).first();

        if(user.role != "admin"){
            throw new AppError("Apenas administradores podem alter pratos");
        }

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

        // Remover os ingredients que não constem no array de ingredients vindo do update
        const ingredientsToDelete = existingIngredientNames.filter(name => !ingredients.includes(name));

        // Adicionar os novos ingredientes que constem no array de ingredients vindo do update
        const ingredientsToAdd = ingredients.filter(name => !existingIngredientNames.includes(name));

        await knex("ingredients").where({ plate_id }).whereIn("name", ingredientsToDelete).del();

        const ingredientsInsert = ingredientsToAdd.map(name => {
            return {
                plate_id,
                name
            };
        });

        if (ingredientsInsert.length > 0) {
            await knex("ingredients").insert(ingredientsInsert);
        }

        response.json({ name, category, price, description });
    }

    async show(request, response){
        const plate_id = request.params.id;

        const plates = await knex("plates").where({ "id": plate_id }).first();
        const ingredients = await knex("ingredients").where({ plate_id});
        
        response.json({ plates, ingredients });
    }

    async delete(request, response){
        const plate_id = request.params.id;
        const user_id = request.user.id;
        const diskStorage = new DiskStorage();

        if(!user_id){
            throw new AppError("Utilizador não autorizado", 401);
        }

        const user = await knex("users").where({ "id": user_id }).first();
        
        if(user.role != "admin"){
            throw new AppError("Apenas administradores podem apagar pratos");
        }

        const plate = await knex("plates").where({ "id": plate_id }).first();
        await knex("plates").where({ "id": plate_id }).delete();
        await diskStorage.deleteFile(plate.image);

        response.json();
    }

    async index(request, response){
        const { name } = request.query;

        let plates;

        plates = await knex("plates")
        .distinct("plates.id", "plates.name", "plates.category", "plates.price", "plates.description", "plates.image")
        .leftJoin("ingredients", "plates.id", "ingredients.plate_id")
        .where("plates.name", "like", `%${name}%`)
        .orWhere("ingredients.name", "like", `%${name}%`)
        .orderBy("plates.name");

        

        response.json({ plates });
        
    }
}

module.exports = PlatesController;