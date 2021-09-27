import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Fields extends BaseSchema {
  protected tableName = 'fields'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.enum('type',['futsal','mini soccer','basketball']).notNullable()
      table.integer('venue_id').unsigned()
      table.foreign('venue_id').references('id').inTable('venues')
      table.timestamps(true,true)
      //.onDelete('CASCADE') -> buat ngehapus table yang nyambung ke table lain kalo satu table dihapus
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
