import { DateTime } from 'luxon'
import { BaseModel, column,
belongsTo,BelongsTo, hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import Venue from './Venue'
import Booking from './Booking'

export default class Field extends BaseModel {
  public static table = "fields"
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public type: string

  @column()
  public venueId: number
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(()=> Venue)
  public venues:BelongsTo<typeof Venue>

  @hasMany(()=>Booking)
  public bookings: HasMany<typeof Booking>
}
