import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';

import Booking from "App/Models/Booking";
//import Field from "App/Models/Field";
import Venue from "App/Models/Venue";
import FormBookingValidator from "App/Validators/FormBookingValidator";
import User from 'App/models/User';
//import Bookings from 'Database/migrations/1632631321565_bookings';

export default class BookingsController {

        /**
     *  @swagger
     *  /venues/{id}/bookings:
     *      post:
     *          security:
     *              -   bearerAuth: []
     *          parameters:
     *              -   in: path
     *                  name:   id
     *                  required:   true
     *                  schema:
     *                      type:   integer
     *                  description:    Venue_ID
     *          tags:
     *              -   Venues_CRUD
     *          summary:    Create a Booking and play!
     *          requestBody:
     *              required:   true
     *              content:
     *                  application/x-www-form-urlencoded:
     *                      schema:
     *                          $ref:   '#definitions/BookingsPost'
     *                      aplication/json:
     *                          $ref:   '#definitions/BookingsPost'
     *          responses:
     *              '201':
     *                  description:    Booking Success
     *              '422':
     *                  description:    Booking Failed
     */
    public async store({request,response,params,auth}:HttpContextContract){
        const venue = await Venue.findByOrFail('id',params.venue_id)
        const user = auth.user!
        const payload = await request.validate(FormBookingValidator)
    
        const booking = new Booking()
        booking.play_date_start = payload.play_date_start
        booking.play_date_end = payload.play_date_end
        booking.fieldId = request.input('field_id')

        booking.related('venues').associate(venue)
        booking.related('users').associate(user)
    
        return response.created({status:'success',data:booking})
    }

    /**
     *  @swagger
     *  /bookings:
     *      get:
     *          security:
     *              -   bearerAuth: []
     *          tags:
     *              -   Bookings_CRUD
     *          summary:    Get All Bookings
     *          responses:
     *              '201':
     *                  description:    Success get Bookings
     *              '422':
     *                  description:    If error, only God knows
     */
    public async index({response}:HttpContextContract){
        let bookings = await Booking.query()
        .select(['id','play_date_start','play_date_end','fieldId','venueId','userId'])
        .preload('users',(userQuery)=>{
            userQuery.select(['id','name','email'])
        })
        .preload('fields',(fieldQuery)=>{
            fieldQuery.select(['id','name','type'])
        })
        .preload('venues',(venueQuery)=>{
            venueQuery.select(['id','name','address','phone','user_id'])
        })
        return response.status(200).json({message:'success get bookings', data:bookings})

    }

    /**
     *  @swagger
     *  /bookings/{id}/join:
     *      put:
     *          security:
     *              -   bearerAuth: []
     *          parameters:
     *              -   in: path
     *                  name:   id
     *                  required:   true
     *                  schema:
     *                      type:   integer
     *                  description:    Booking_ID
     *          tags:
     *              -   Bookings_CRUD
     *          summary:    Join to your friend Booking!
     *          responses:
     *              '201':
     *                  description:    Booking Success
     *              '422':
     *                  description:    Booking Failed
     */
    public async join({response,auth,params}:HttpContextContract){
        const booking = await Booking.findOrFail(params.id)
        let user = auth.user!
        const checkJoin = await Database.from('user_bookings').where('booking_id',params.id).where('user_id',user.id).first()
        if(!checkJoin){
            await booking.related('players').attach([user.id])
            return response.ok({status:'success join main',data:'success join main'})
        } else{
            return response.ok({status:'anda sudah join main'})
        }
        
    }

        /**
     *  @swagger
     *  /bookings/{id}/unjoin:
     *      put:
     *          security:
     *              -   bearerAuth: []
     *          parameters:
     *              -   in: path
     *                  name:   id
     *                  required:   true
     *                  schema:
     *                      type:   integer
     *                  description:    Booking_ID
     *          tags:
     *              -   Bookings_CRUD
     *          summary:    Unjoin to your friend Booking! Having a problem with your friend innit?
     *          responses:
     *              '201':
     *                  description:    UnBooking Success
     *              '422':
     *                  description:    UnBooking Failed
     */
    public async unjoin({params,response,auth}:HttpContextContract){
        const booking = await Booking.findOrFail(params.id)
        const user = auth.user!
        await booking.related('players').detach([user.id])

        return response.ok({status:'success unjoin main', data:'success unjoin main'})
    }

    /**
     *  @swagger
     *  /bookings/{id}:
     *      get:
     *          security:
     *              -   bearerAuth: []
     *          parameters:
     *              -   in: path
     *                  name:   id
     *                  required:   true
     *                  schema:
     *                      type:   integer
     *                  description:    Booking_ID
     *          tags:
     *              -   Bookings_CRUD
     *          summary:    Get Booking by ID
     *          responses:
     *              '201':
     *                  description:    Success get Booking
     *              '422':
     *                  description:    If error, only God knows
     */
     public async show({params,response}:HttpContextContract){
        const booking = await Booking
        .query()
        .where('id',params.id)
        .preload('players',(userQuery)=>{
            userQuery.select(['name','email','id'])
        })
        .withCount('players')
        .firstOrFail()
        return response.ok({status:'success',data:booking})
    }

    /**
     *  @swagger
     *  /schedule:
     *      get:
     *          security:
     *              -   bearerAuth: []
     *          tags:
     *              -   Bookings_CRUD
     *          summary:    Get Your Scheduled Booking
     *          responses:
     *              '201':
     *                  description:    Success get Bookings
     *              '422':
     *                  description:    If error, only God knows
     */
    public async schedule({auth,response}:HttpContextContract){
        const id:number = auth.user!.id
        const user = await User
            .query()
            .where('id',id)
            .select(['id','name','email','role'])
            .preload('bookings',(userQuery)=>{
                userQuery.select(['id','play_date_start','play_date_end','venue_id','field_id'])
                .preload('venues',(userQuery)=>{
                    userQuery.select(['name','address','phone'])
                    .preload('fields',(userQuery)=>{
                        userQuery.select(['name','type'])
                    })
                })
            }).first()    
        return response.ok({status:'Here is your bookings schedule',data:user})
    }

}
