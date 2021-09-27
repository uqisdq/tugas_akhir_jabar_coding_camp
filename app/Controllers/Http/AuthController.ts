import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema} from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'
//import Mail from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AuthController {
    /**
     *  @swagger
     *  /register:
     *      post:
     *          tags:
     *              -   Authentication
     *          summary:    Register, READ FOR OTP IN THE REQUEST BODY, MY SMTP IS ERROR, I CANT SEND YOU EMAIL! OTP IS IMPORTANT FOR VERIFICATION
     *          requestBody:
     *              required:   true
     *              content:
     *                  application/x-www-form-urlencoded:
     *                      schema:
     *                          $ref:   '#definitions/User'
     *                      aplication/json:
     *                          $ref:   '#definitions/User'
     *          responses:
     *              '201':
     *                  description:    user created, verify in email
     *              '422':
     *                  description:    error, coba cek inputannya
     */
    public async register ({request,response}:HttpContextContract){
        try {
            const payload = await request.validate(UserValidator)

            const newUser = await User.create(payload)
            let otp_code: number = Math.floor(100000 + Math.random()*900000)
            console.log('otp_code',otp_code)
            await Database.table('otp_codes').insert({otp_code:otp_code,user_id:newUser.id})
            // await Mail.send((message)=>{
            //     message
            //         .from('admin@sanberdev.com')
            //         .to(payload.email)
            //         .subject('Welcome Onboard!')
            //         .htmlView('mail/otp_verification',{name:payload.name,otp_code:otp_code})
            // })

            return response
                .created({message: ' registered, silahkan lakukan verifikasi kode OTP yang dikirimkan ke email anda, jika tidak ada email, pakai saja otp yang ada disini',newUser,otp_code})
        } catch (error) {
            return response.unprocessableEntity({message:error.message})
        }
    }

    /**
     *  @swagger
     *  /login:
     *      post:
     *          tags:
     *              -   Authentication
     *          summary:    login to your account
     *          requestBody:
     *              required:   true
     *              content:
     *                  application/x-www-form-urlencoded:
     *                      schema:
     *                          $ref:   '#definitions/UserLogin'
     *                      aplication/json:
     *                          $ref:   '#definitions/UserLogin'
     *          responses:
     *              '201':
     *                  description:    login success
     *              '422':
     *                  description:    error, coba cek inputannya
     */
    public async login({request,response,auth}:HttpContextContract){
        const userSchema = schema.create({
            email:schema.string(),
            password:schema.string()
        })

        try {
            const email = request.input('email')
            const password = request.input('password')
            //const role = request.input('role')

            const payload = await request.validate({schema:userSchema})
            const token = await auth.use('api').attempt(email, password)
            return response.ok({message:'login sukses', token,payload})
        } catch (error) {
            if(error.guard){ //Error request
                console.log(error.message)
                return response.badRequest({message:'login error',error:error.message})
            } else{ //Error validator
                console.log(error.messages)
                return response.badRequest({message:'login error',error:error.messages})
            }
        }

      }

          /**
     *  @swagger
     *  /otp-confirmation:
     *      post:
     *          tags:
     *              -   Authentication
     *          summary:    Verify Your Account Here (You cant do anything without verified account)
     *          requestBody:
     *              required:   true
     *              content:
     *                  application/x-www-form-urlencoded:
     *                      schema:
     *                          $ref:   '#definitions/UserVerif'
     *                      aplication/json:
     *                          $ref:   '#definitions/UserVerif'
     *          responses:
     *              '201':
     *                  description:    Berhasil Verifikasi!
     *              '422':
     *                  description:    error, coba cek inputannya
     */

      public async otp_verification({request,response}:HttpContextContract){
          const otp_code = request.input('otp_code')
          const email = request.input('email')

          const user = await User.findByOrFail('email',email)

          const dataOtp = await Database.from('otp_codes').where('otp_code',otp_code).firstOrFail()
          if(user.id==dataOtp.user_id){
              user.isVerified=true
              await user.save()

              return response.ok({status:'success',data:'verification success'})
          }else{
              return response.badRequest({status:'error',data:'OTP verification failed'})
          }
      }
    }
