import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

// Route.post('/venues','VenuesController.store').as('venues.store')
// Route.get('/venues','VenuesController.index').as('venues.index')
// Route.get('/venues/:id','VenuesController.show').as('venues.show')
// Route.put('/venues/:id','VenuesController.update').as('venues.update')
// Route.delete('/venues/:id','VenuesController.destroy').as('venues.destroy')

//Venue Related
Route.resource('venues','VenuesController').apiOnly().middleware({
  '*':['auth','role']
})

//Fields Related
Route.resource('venues.fields','FieldsController').apiOnly()

//Bookings Related
Route.get('/bookings','BookingsController.index').as('bookings.index').middleware(['auth','verify'])
Route.put('/bookings/:id/join','BookingsController.join').as('bookings.join').middleware(['auth','verify'])
Route.put('/bookings/:id/unjoin','BookingsController.unjoin').as('bookings.unjoin').middleware(['auth','verify'])
Route.get('/bookings/:id','BookingsController.show').as('bookings.show').middleware(['auth','verify'])
Route.get('/schedule','BookingsController.schedule').as('bookings.schedule').middleware(['auth','verify'])
Route.post('/venues/:venue_id/bookings','BookingsController.store').as('booking.store').middleware(['auth','verify'])

//Auth Related
Route.post('/register','AuthController.register').as('auth.register')
Route.post('/login','AuthController.login').as('auth.login')
Route.post('/otp-confirmation','AuthController.otp_verification').as('auth.verifier')
