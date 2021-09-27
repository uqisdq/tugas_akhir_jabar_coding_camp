import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateVenueValidator from 'App/Validators/CreateVenueValidator'
//import Database from '@ioc:Adonis/Lucid/Database'
//import { Request } from '@adonisjs/http-server/build/standalone'

//models
import Venue from 'App/Models/Venue'
//import Field from 'App/Models/Field'
//import Booking from 'App/Models/Booking'

export default class VenuesController {
    /**
     *  @swagger
     *  /venues:
     *      get:
     *          security:
     *              -   bearerAuth: []
     *          tags:
     *              -   Venues_CRUD
     *          summary:    Get All Venues (Owner Only)
     *          responses:
     *              '201':
     *                  description:    Success get Venues
     *              '422':
     *                  description:    If error, only God knows
     */
    public async index({response,request}:HttpContextContract){
        if(request.qs().id){
            let id = request.qs().id
            let venuesFiltered=await Venue
                .query()
                .where("id",id)
                .select(['id','name','address','phone','user_id'])
                .preload('users',(userQuery)=>{
                    userQuery.select(['name','email','phone'])
                })

            return response.status(200).json({message:'success get venues', data:venuesFiltered})
        }
        let venues = await Venue
            .query()
            .select(['id','name','address','phone','user_id'])
            .preload('users',(userQuery)=>{
                userQuery.select(['id','name','email','role'])
            })

        return response.status(200).json({message:'success get venues', data:venues})
    }

    /**
     *  @swagger
     *  /venues:
     *      post:
     *          security:
     *              -   bearerAuth: []
     *          tags:
     *              -   Venues_CRUD
     *          summary:    add Venues (Owner Only)
     *          requestBody:
     *              required:   true
     *              content:
     *                  application/x-www-form-urlencoded:
     *                      schema:
     *                          $ref:   '#definitions/VenuesPost'
     *                      aplication/json:
     *                          $ref:   '#definitions/VenuesPost'
     *          responses:
     *              '201':
     *                  description:    Venue Created
     *              '422':
     *                  description:    error, coba cek inputannya
     */
    
    public async store({request,response,auth}:HttpContextContract){
        try {
            await request.validate(CreateVenueValidator) 
        
            let newVenue = new Venue();
            newVenue.name =request.input('name')
            newVenue.address =request.input('address')
            newVenue.phone =request.input('phone')
            const authUser = auth.user
            await authUser?.related('venues').save(newVenue)
            //console.log('user ID: ', userId)
            //console.log(newVenue.$isPersisted)
            response.created({message:'created'})

        } catch (error) {
            console.log(error)
            response.unprocessableEntity({errors:error.messages})
        }
    }

    /**
     *  @swagger
     *  /venues/{id}:
     *      get:
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
     *          summary:    Get Venue by ID (Owner Only)
     *          responses:
     *              '201':
     *                  description:    Success get Venues
     *              '422':
     *                  description:    If error, only God knows
     */

    public async show({/*request,*/params,response}:HttpContextContract){
        let venues = await Venue
            .query()
            .where('id',params.id)
            .select(['id','name','address','phone'])
            .preload('fields',(userQuery)=>{
                userQuery.select(['id','name','type'])
                .preload('bookings',(userQuery)=>{
                    userQuery.select(['id','play_date_start','play_date_end','venue_id','field_id'])
                })
            }).first()   

            return response.ok({status:'success',data:venues})
    }

    /**
     *  @swagger
     *  /venues/{id}:
     *      put:
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
     *          requestBody:
     *              required:   true
     *              content:
     *                  application/x-www-form-urlencoded:
     *                      schema:
     *                          $ref:   '#definitions/VenuesPut'
     *                      aplication/json:
     *                          $ref:   '#definitions/VenuesPut'
     *          summary:    Update Venue (Owner Only)
     *          responses:
     *              '201':
     *                  description:    Success update Venue
     *              '422':
     *                  description:    Error, Cek inputan
     */

    public async update({request,response,params}:HttpContextContract){
        let id = params.id
        let venue = await Venue.findOrFail(id)
        venue.name = request.input('name')
        venue.address = request.input('address')
        venue.phone = request.input('phone')
        venue.save()

        return response.ok({message:'updated'})
    }

    /**
     *  @swagger
     *  /venues/{id}:
     *      delete:
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
     *          summary:    Delete Venue by ID (Owner Only)
     *          responses:
     *              '201':
     *                  description:    Success delete Venue
     *              '422':
     *                  description:    If error, only God knows
     */
    public async destroy({params,response}:HttpContextContract){
        let venue = await Venue.findOrFail(params.id)
        await venue.delete()
        return response.ok({message:'deleted'})
    }
}