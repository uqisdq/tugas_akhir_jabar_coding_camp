import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo,BelongsTo, manyToMany, ManyToMany/*, computed*/ } from '@ioc:Adonis/Lucid/Orm'
import Field from './Field'
import User from './User'
import Venue from './Venue'

/** 
*  @swagger
*  definitions:
*    BookingsPost:
*      type: object
*      properties:
*        play_date_start:
*          type: dateTime
*        play_date_end:
*          type: dateTime
*        field_id:
*          type: integer     
*      required:
*        - name
*        - address
*        - field_id
*/
export default class Booking extends BaseModel {
  public static table = "bookings"

  public serializeExtras = true
  @column({ isPrimary: true })
  public id: number

  @column.dateTime()
  public play_date_start: DateTime

  @column.dateTime()
  public play_date_end: DateTime

  @column()
  public fieldId: number

  @column()
  public venueId : number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public userId: number

  @belongsTo(()=> Field)
  public fields:BelongsTo<typeof Field>

  @belongsTo(()=> User)
  public users:BelongsTo<typeof User>

  @belongsTo(()=>Venue)
  public venues:BelongsTo<typeof Venue>

  @manyToMany(()=> User, {
    pivotTable: 'user_bookings'
  })
  public players: ManyToMany<typeof User>

}
