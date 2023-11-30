exports.up = knex => knex.schema.createTable("orders", table => {
    table.increments("id");
    table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.float("total", null, 2).defaultTo(0);
    table.enum("status", ["pendente", "preparando", "entregue"]).defaultTo("pendente");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

});

exports.down = knex => knex.schema.dropTable("orders");
