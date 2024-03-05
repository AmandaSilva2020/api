const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class CartsController {
    async create(request, response){
        const { name, quantity } = request.body;
        const user_id = request.user.id;

        if(!user_id){
            throw new AppError("Você deve estar logado para fazer um pedido");
        }

        const plate = await knex("plates").where({ name }).first();

        if(!plate){
            throw new AppError("Este prato não consta na base de dados");
        }

        const price = quantity * plate.price;

        await knex("order_items").insert({ user_id, "plate_id": plate.id, quantity, price})

        response.json({name, quantity, price });
    }
}

module.exports = CartsController;