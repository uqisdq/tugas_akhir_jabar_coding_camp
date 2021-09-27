import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Bookings extends BaseSchema {
  protected tableName = 'bookings'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.dateTime('play_date_start').notNullable()
      table.dateTime('play_date_end').notNullable()
      table.integer('user_id_booking').unsigned()
      table.foreign('user_id_booking').references('id').inTable('users').onDelete('CASCADE')
      table.integer('field_id').unsigned()
      table.foreign('field_id').references('id').inTable('fields').onDelete('CASCADE')
      table.timestamps(true,true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
