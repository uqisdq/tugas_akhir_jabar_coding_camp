import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany
} from '@ioc:Adonis/Lucid/Orm'

import Venue from './Venue'
import Booking from './Booking'

/** 
*  @swagger
*  definitions:
*    User:
*      type: object
*      properties:
*        id:
*          type: integer
*        name:
*          type: string
*        email:
*          type: string
*        password:
*          type: string
*        role:
*          type: string      
*      required:
*        - name
*        - email
*        - password
*/

/** 
*  @swagger
*  definitions:
*    UserLogin:
*      type: object
*      properties:
*        email:
*          type: string
*        password:
*          type: string     
*      required:
*        - email
*        - password
*/

/** 
*  @swagger
*  definitions:
*    UserVerif:
*      type: object
*      properties:
*        otp_code:
*          type: integer
*        email:
*          type: string     
*      required:
*        - otp_code
*        - email
*/

export default class User extends BaseModel {
  public static table = "users"
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public isVerified:boolean

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public role: string

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
  @hasMany(()=>Venue)
  public venues: HasMany<typeof Venue>

  @hasMany(()=>Booking)
  public bookings: HasMany<typeof Booking>

  @manyToMany(()=> Booking)
  public Booking: ManyToMany<typeof Booking>
}
