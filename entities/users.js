const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Users',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid'
    },
    name: {
      type: 'varchar',
      length: 50,
      unique: true,
      nullable: false
    },
    password: {
      type: 'varchar',
      length: 100,
      nullable: false
    },
    contact_info: {
      type: 'varchar',
      length: 255,
      nullable: true
    },
    email: {
      type: 'varchar',
      length: 100,
      nullable: true,
      unique: true
    },
    role: {
      type: 'varchar',
      length: 20,
      nullable: false,
      default: 'USER'
    },
    created_at: {
      type: 'timestamp',
      createDate: true
    },
    updated_at: {
      type: 'timestamp',
      updateDate: true
    }
  }
});
