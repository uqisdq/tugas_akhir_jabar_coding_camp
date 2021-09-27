import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BookingTags extends BaseSchema {
  protected tableName = 'booking_tags'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').unsigned()
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.integer('booking_id').unsigned()
      table.foreign('booking_id').references('id').inTable('bookings').onDelete('CASCADE')
      table.timestamps(true,true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
