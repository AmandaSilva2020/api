exports.up = knex => knex.schema.createTable("order_items", table => {
    table.increments("id");
    table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.integer("order_id").references("id").inTable("orders").onDelete("CASCADE");
    table.integer("plate_id").references("id").inTable("plates");
    table.integer("quantity");
    table.float("price", null, 2);

})

exports.down = knex => knex.schema.dropTable("order_items");
