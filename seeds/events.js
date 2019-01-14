
exports.seed = function(knex, Promise) {
  return knex('events').del()
    .then(function () {
      return knex('events').insert([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21].map(value => ({
        id: value,
        value,
        event_type_id: parseInt(Math.random() * (3 - 1) + 1, 10),
        created: new Date(),
      })));
    });
};
