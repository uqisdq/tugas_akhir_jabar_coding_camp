import { schema,rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateFieldValidator {
  constructor (protected ctx: HttpContextContract) {
  }
	public schema = schema.create({
		name:schema.string({},[
			rules.alpha({
				allow:['space','dash']
			}),
			rules.minLength(3)
		])
		// type:schema.enum(
		// 	['futsal','mini soccer','basketball']
		// ),
		//venue_id:schema.number()
	})
  public messages = {
	  'required':'the {{field}} is required to book venue',
	  'name.alpha': 'the {{field}} must be characters without numbers or symbol, you can use space and dash',
	  'type.enum': 'type must be futsal or mini soccer or basketball',
	  //'venue_id.number':'must be number(integer)',
  }
}
