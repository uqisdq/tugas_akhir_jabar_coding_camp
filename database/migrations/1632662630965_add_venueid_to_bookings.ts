import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddVenueidToBookings extends BaseSchema {
  protected tableName = 'bookings'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.integer('venue_id').unsigned()
      table.foreign('venue_id').references('id').inTable('venues').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
