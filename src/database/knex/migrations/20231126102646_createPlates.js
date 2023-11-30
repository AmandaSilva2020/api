exports.up = knex => knex.schema.createTable("plates", table => {
    table.increments("id");
    table.text("name");
    table.text("image");
    table.text("category");
    table.float("price", 8, 2);
    table.text("description");
    
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
})


exports.down = knex => knex.schema.dropTable("plates");
