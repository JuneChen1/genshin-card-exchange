const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Cards',
  tableName: 'cards',
  columns: {
    id: {
      primary: true,
      type: 'int'
    },
    name: {
      type: 'varchar',
      length: 100,
      unique: true,
      nullable: false
    },
    english_name: {
      type: 'varchar',
      length: 100,
      unique: true,
      nullable: false
    },
    image_url: {
      type: 'varchar',
      length: 100,
      unique: true,
      nullable: false
    }
  }
});
