import { schema,rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
  constructor (protected ctx: HttpContextContract) {
  }

	/*
	 * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
	 *
	 * For example:
	 * 1. The username must be of data type string. But then also, it should
	 *    not contain special characters or numbers.
	 *    ```
	 *     schema.string({}, [ rules.alpha() ])
	 *    ```
	 *
	 * 2. The email must be of data type string, formatted as a valid
	 *    email. But also, not used by any other user.
	 *    ```
	 *     schema.string({}, [
	 *       rules.email(),
	 *       rules.unique({ table: 'users', column: 'email' }),
	 *     ])
	 *    ```
	 */
  public schema = schema.create({
	  name: schema.string({},[
		  rules.minLength(5)
	  ]),
	  email: schema.string({},[
		  rules.email(),
		  rules.unique({
			  table:'users',
			  column:'email'
		  })
	  ]),
	  password: schema.string({},[
		  rules.minLength(6)
	  ]),
	  role:schema.enum(
			['user','owner']
		)
  })

	/**
	 * Custom messages for validation failures. You can make use of dot notation `(.)`
	 * for targeting nested fields and array expressions `(*)` for targeting all
	 * children of an array. For example:
	 *
	 * {
	 *   'profile.username.required': 'Username is required',
	 *   'scores.*.number': 'Define scores as valid numbers'
	 * }
	 *
	 */
  public messages = {
	'required':'the {{field}} is required to create new venue',
	'name.nimLength': 'the {{field}} must be containing 5 word minimum',
	'email.email': 'email must be in email format - @gmail.com, etc ',
	'password.minLegth':'password must be 6 word or more',
	//'role.enum':'role must be between user or owner' 
  }
}
