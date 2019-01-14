const exists = require("fs").existsSync;

function getDb(name) {
  const dbPath = `./${name}.sqlite`;
  return require("knex")({
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: dbPath,
      debug: true
    }
  });
}

module.exports = {
  create: name => {
    if (exists(`./${name}.sqlite`)) {
      console.warn("Database file already exists");
      process.exit(2);
    }

    const knex = getDb(name);

    return Promise.all([
      knex.schema.createTable("event_types", table => {
        table.increments();
        table.string("name").notNullable();
      }),
    
      knex("event_types").insert(["fill", "drain", "clear"].map(name => ({name}))),
    
      knex.schema.createTable("events", table => {
        table.increments();
        table.decimal("value").defaultTo(0).notNullable();
        table.integer("event_type_id").defaultTo(1).notNullable();
        table.dateTime("created").defaultTo(knex.fn.now());
    
        table.foreign("event_type_id", "event_types_id");
      }),
    ]);
  },
  seed: name => {
    const knex = getDb(name);
    return knex.seed.run();
  }
};
