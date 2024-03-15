const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class PlateImageController{
    async update(request, response) {
        const plate_id = request.params.id;
        const plateFileName = request.file.filename;

        const diskStorage = new DiskStorage();

        const plate = await knex("plates").where({ "id": plate_id }).first();

        if(!plate){
            throw new AppError("Prato não encontrado na base de dados.", 404);
        }

        if(plate.image){
            await diskStorage.deleteFile(plate.image);
        }

        const filename = await diskStorage.saveFile(plateFileName);
        
        plate.image = filename;

        await knex("plates").update(plate).where({ "id": plate_id });

        return response.json(plate);
    }
}

module.exports = PlateImageController;