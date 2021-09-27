import { schema,rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateVenueValidator {
  constructor (protected ctx: HttpContextContract) {
  }

	public schema = schema.create({
		name:schema.string({},[
			rules.alpha({
				allow:['space','dash']
			}),
			rules.minLength(3)
		]),
		address:schema.string({},[
			rules.alpha({
				allow:['space','dash']
			}),
			rules.minLength(3)
		]),
		phone:schema.string({},[
			rules.mobile({strict:true})
		])
	})

  public messages = {
	  'required':'the {{field}} is required to create new venue',
	  'name.alpha': 'the {{field}} must be characters without numbers or symbol, you can use space and dash',
	  'address.string': 'for now, alamat can not contain numbers ',
	  'phone.mobile':'phone number must contain country code, example : +62855xxxxxxxx'
  }
}
