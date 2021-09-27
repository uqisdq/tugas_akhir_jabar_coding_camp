import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column,BelongsTo,hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
//import { CannotCopyFileException } from '@adonisjs/drive/build/standalone'

import User from './User'
import Field from './Field'

/** 
*  @swagger
*  definitions:
*    VenuesPost:
*      type: object
*      properties:
*        name:
*          type: string
*        address:
*          type: string
*        phone:
*          type: integer     
*      required:
*        - name
*        - address
*        - phone
*/

/** 
*  @swagger
*  definitions:
*    VenuesPut:
*      type: object
*      properties:
*        name:
*          type: string
*        address:
*          type: string
*        phone:
*          type: integer
*/
export default class Venue extends BaseModel {
  public static table = "venues"
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public address: string

  @column()
  public phone: string
  
  @column()
  public userId : number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(()=> User)
  public users:BelongsTo<typeof User>

  @hasMany(()=>Field)
  public fields: HasMany<typeof Field>
}
