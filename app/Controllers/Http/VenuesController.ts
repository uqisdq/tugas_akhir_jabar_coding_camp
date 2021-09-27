import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateVenueValidator from 'App/Validators/CreateVenueValidator'
//import Database from '@ioc:Adonis/Lucid/Database'
//import { Request } from '@adonisjs/http-server/build/standalone'

//models
import Venue from 'App/Models/Venue'
import Field from 'App/Models/Field'

export default class VenuesController {
    public async index({response,request}:HttpContextContract){
        if(request.qs().id){
            let id = request.qs().id
            let venuesFiltered=await Venue
                .query()
                .where("id",id)
                .preload('users')

            return response.status(200).json({message:'success get venues', data:venuesFiltered})
        }
        let venues = await Venue.query().preload('users')

        return response.status(200).json({message:'success get venues', data:venues})
    }
    
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

    public async show({params,response}:HttpContextContract){
        //Cara ORM
        let venues = await Venue
            .query()
            .where('id',params.id)
            .preload('fields').first()

            return response.ok({status:'success',data:venues})
    }

    public async update({request,response,params}:HttpContextContract){
        let id = params.id
        let venue = await Venue.findOrFail(id)
        venue.name = request.input('name')
        venue.address = request.input('address')
        venue.phone = request.input('phone')
        venue.save()

        return response.ok({message:'updated'})
    }

    public async destroy({params,response}:HttpContextContract){
        let venue = await Venue.findOrFail(params.id)
        await venue.delete()
        return response.ok({message:'deleted'})
    }
}