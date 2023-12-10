const knex = require("../database/knex");
const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

class UsersController {
    async create(request, response){
        const { name, email, password } = request.body;
        
        if(!name){
            throw new AppError("O nome é obrigatório");
        }

        const checkUserExists = await knex('users').where({ email })

        if(checkUserExists.length > 0){
            throw new AppError("Este e-mail já está em uso.");
        }

        const hashedPassword = await hash(password, 8)

        await knex('users').insert({ name, email, "password": hashedPassword });

        response.json({ name, email, password });
    }

    async update(request, response){
        const { name, email, password, old_password } = request.body;
        const user_id = request.user.id;

        const user = await knex("users").where({ "id": user_id }).first();

        if(!user){
            throw new AppError("Utilizador não encontrado");
        }

        const userWithUpdatedEmail = await knex("users").where({ email }).first();
        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
            throw new AppError("Este e-mail já está em uso");
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if(password && !old_password){
            throw new AppError("É preciso informar a senha antiga para definir a nova senha.");
        }

        if(password && old_password){
            const checkOldPassword = await compare(old_password, user.password);

            if(!checkOldPassword){
                throw new AppError("A senha antiga não está correta.");
            }

            user.password = await hash(password, 8);
            
        }
        
        await knex("users").update({ name, email, "password": user.password }).where({ "id": user.id });

        response.json({ name, email, password });
    }
}

module.exports = UsersController;