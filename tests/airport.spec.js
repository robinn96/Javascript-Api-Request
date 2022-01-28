import { request, expect } from '../config'

// can also be added test hooks if required like beforeEach etc

describe('GET /airports', function () {
  it('returns all airports, limited to 30 per page', async function () {
    const response = await request.get('/airports')

    expect(response.status).to.eql(200)
    expect(response.body.data.length).to.eql(30)
  })
})

describe('POST /airports/distance', function () {
  it('calculates the distance between two airports', async function () {
    const response = await request
      .post('/airports/distance')
      .send({ from: 'KIX', to: 'SFO' })

    expect(response.status).to.eql(200)

    const attributes = response.body.data.attributes
    expect(attributes).to.include.keys('kilometers', 'miles', 'nautical_miles')
    expect(attributes.kilometers).to.eql(8692.066508240026)
    expect(attributes.miles).to.eql(5397.239853492001)
    expect(attributes.nautical_miles).to.eql(4690.070954910584)
  })
})

describe('POST /favorites', function () {
  it('requires authentication', async function () {
    const response = await request.post('/favorites').send({
      airport_id: 'JFK',
      note: 'My usual layover when visiting family'
    })

    expect(response.status).to.eql(401)
  })

  it('allows an user to save and delete their favorite airports', async function () {
    // Check that a user can create a favorite.
    const postResponse = await request
      .post('/favorites')
      .set('Authorization', `Bearer token=${process.env.AIRPORT_GAP_TOKEN}`)
      .send({
        airport_id: 'JFK',
        note: 'My usual layover when visiting family'
      })

    expect(postResponse.status).to.eql(201)
    expect(postResponse.body.data.attributes.airport.name).to.eql('John F Kennedy International Airport')
    expect(postResponse.body.data.attributes.note).to.eql('My usual layover when visiting family')

    const favoriteId = postResponse.body.data.id

    // Check that a user can update the note of the created favorite.
    const putResponse = await request
      .put(`/favorites/${favoriteId}`)
      .set('Authorization', `Bearer token=${process.env.AIRPORT_GAP_TOKEN}`)
      .send({
        note: 'My usual layover when visiting family and friends'
      })

    expect(putResponse.status).to.eql(200)
    expect(putResponse.body.data.attributes.note).to.eql('My usual layover when visiting family and friends')

    // Check that a user can delete the created favorite.
    const deleteResponse = await request
      .delete(`/favorites/${favoriteId}`)
      .set('Authorization', `Bearer token=${process.env.AIRPORT_GAP_TOKEN}`)

    expect(deleteResponse.status).to.eql(204)

    // Verify that the record was deleted.
    const getResponse = await request
      .get(`/favorites/${favoriteId}`)
      .set('Authorization', `Bearer token=${process.env.AIRPORT_GAP_TOKEN}`)

    expect(getResponse.status).to.eql(404)
  })
})
