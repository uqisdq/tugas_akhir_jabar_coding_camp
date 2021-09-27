import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Venues extends BaseSchema {
  protected tableName = 'venues'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.integer('user_id').unsigned()
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign('user_id')
      table.dropColumn('user_id')
    })
  }
}
