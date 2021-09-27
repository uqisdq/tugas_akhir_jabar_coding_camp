import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateFieldValidator from 'App/Validators/CreateFieldValidator'
//import Database from '@ioc:Adonis/Lucid/Database'

//import { Request } from '@adonisjs/http-server/build/standalone'

import Field from 'App/Models/Field'
import Venue from 'App/Models/Venue'

export default class FieldsController {
    public async index({response,request}:HttpContextContract){
        if(request.qs().id){
            let id = request.qs().id
            
            let fieldsFiltered=await Field
                .query()
                .where('id',id)
                .preload('venues')

            return response.status(200).json({message:'success get fields', data:fieldsFiltered})
        } else{
        let fields = await Field.query().preload('venues')
        return response.status(200).json({message:'success get venues', data:fields})
    }
    }
    
    public async store({request,response,params}:HttpContextContract){
        try {
            await request.validate(CreateFieldValidator) 

            const venue = await Venue.findByOrFail('id',params.venue_id)

            let newField = new Field();
            newField.name =request.input('name')
            newField.type =request.input('type')
            await newField.related('venues').associate(venue)
            // await newField.save()
            // console.log(newField.$isPersisted)
            response.created({message:'created'})
        } catch (error) {
            response.unprocessableEntity({errors:error.messages})
        }
    }

    public async show({params,response}:HttpContextContract){
        let fields = await Field
            .query()
            .from('fields')
            .where('fields.id',params.id)
            .join('venues', (query) => {
              query
                .on('fields.venue_id', '=', 'venues.id')
            })
            .select('fields.*','venues.name','venues.address','venues.phone')

        return response.status(200).json({message:'success get fields', data:fields})
    }

    public async update({request,response,params}:HttpContextContract){
        //Cara ORM
        let id = params.id
        let field = await Field.findOrFail(id)
        field.name = request.input('name')
        field.type = request.input('type')
        field.venueId = request.input('venue_id')
        field.save()

        return response.ok({message:'updated'})
    }

    public async destroy({params,response}:HttpContextContract){
        //Cara ORM
        let field = await Field.findOrFail(params.id)
        await field.delete()
        return response.ok({message:'deleted'})
    }
}
