# Api Request With Vanilla Javascript

The idea of this project its to demostrate how to do api requests with a library call [SuperTest](https://github.com/visionmedia/supertest#readme) which its purpose is to provide a high-level abstraction for testing HTTP and also making use of [Mocha](https://mochajs.org/) which its a feature-rich JavaScript test framework that runs on Node.js and in the browser, making asynchronous testing simple and fun.

## Libraries that are used in the project.

- [Mocha](https://mochajs.org/)
- [SuperTest](https://github.com/visionmedia/supertest#readme)
- [Chai](https://www.chaijs.com/)
- [Mochawesome](https://github.com/adamgruber/mochawesome)
- [Standard](https://github.com/standard/standard)
- [Dotenv](https://github.com/motdotla/dotenv)

## Installation and configuration

First you need to have installed and configured [Node.js](https://phoenixnap.com/kb/install-npm-mac) and [Nvm](https://tecadmin.net/install-nvm-macos-with-homebrew/) in your computer.

Then you execute the following commands.

With this command you will make use of the version of node.js that is used in this project so that there are no dependency problems.
```bash
nvm use
```

In case that appears a message in your terminal saying you dont have this Node version already installed. You can run a command similar to this one. So with this you will be ready to run the tests.
```bash
nvm install v15.4.0
```


Also in the root of the project making use of your terminal you need to create a .env file 
```bash
touch .env
```

Inside you will add the following lines:

- **API_URL** = "https://airportgap.dev-tester.com/api/"
- **AIRPORT_GAP_TOKEN=""**

The first one its the Api Url. The second one will contain the token for some endpoints that needs authorization. Check [here](https://airportgap.dev-tester.com/tokens) to know how to get it. 

Once you have all this previous steps ready you can run npm install to install the required libraries used by the project:

```bash
npm install
```


## Scripts

Run the tests
```bash
npm run test
```
Run the test and once finished generate some files necessary to create the report with the test results. 
```bash
npm run test-with-html-report
```

Open the report

```bash
npm run open-report
```

## Usage

Most important folder are config and tests. Config folder include some code in which SuperTest its is imported and then exported as a module so that any test file can make use of it.

Same with assertion library, in this scenario we use Chai.

Dotenv its imported to load and environment variable so it will not be burned into the code. 

It is important to mention that within supertest we are passing the api url as a parameter.

```javascript

require('dotenv').config()

const supertest = require('supertest')
const request = supertest(process.env.API_URL)
const expect = require('chai').expect

module.exports = {
  request,
  expect
}
```

By other hand, in test folder you will see a file called airport.spec.js in which there are multiple test that show how to do api request with different Http methods a: **GET - POST - PUT - DELETE**

Below will be show part of each test logic, in specific the one about the api request. At the end you will have a general overview of how to use the different http methods with SuperTest.

**GET - Request**


Function must be asynchronous, here its used [asyn-await](https://javascript.info/async-await) and **request.get** does the magic. Inside of it /airports endpoint is passed as parameter. 
```javascript
describe('GET /airports', function () {
  it('returns all airports, limited to 30 per page', async function () {
    const response = await request.get('/airports')
```

**POST - Request**

Function must be asynchronous, here its used [asyn-await](https://javascript.info/async-await) and **request.post** does the magic. Inside of it /airports/distance endpoint is passed as parameter. 

Inside send method you put an object with the data you will send to the api.

```javascript
describe('POST /airports/distance', function () {
  it('calculates the distance between two airports', async function () {
    const response = await request
      .post('/airports/distance')
      .send({ from: 'KIX', to: 'SFO' })
```

**Authentication**

Function must be asynchronous, here its used [asyn-await](https://javascript.info/async-await) and **request.post** does the magic.

Here you can see the set method, inside you can add an Authorization header in a Supertest request. For this scenario its a Bearer Token.

We get the token from the .env



```javascript
  it('allows an user to save and delete their favorite airports', async function () {
    // Check that a user can create a favorite.
    const postResponse = await request
      .post('/favorites')
      .set('Authorization', `Bearer token=${process.env.AIRPORT_GAP_TOKEN}`)
      .send({
        airport_id: 'JFK',
        note: 'My usual layover when visiting family'
      })
```

**PUT - Request**


Function must be asynchronous, here its used [asyn-await](https://javascript.info/async-await) and **request.put** does the magic. Inside of it /favorites/${favoriteId} endpoint is passed as parameter.

Inside send method you put an object with the data you will send to the api to update the resource. 

```javascript
  it('allows an user to save and delete their favorite airports', async function () {

   // Check that a user can update the note of the created favorite.
    const putResponse = await request
      .put(`/favorites/${favoriteId}`)
      .set('Authorization', `Bearer token=${process.env.AIRPORT_GAP_TOKEN}`)
      .send({
        note: 'My usual layover when visiting family and friends'
      })

```

**Delete - Request**

Function must be asynchronous, here its used [asyn-await](https://javascript.info/async-await) and **request.delete** does the magic. Inside of it /favorites/${favoriteId} endpoint is passed as parameter.

```javascript
it('allows an user to save and delete their favorite airports', async function () {
   const deleteResponse = await request
      .delete(`/favorites/${favoriteId}`)
      .set('Authorization', `Bearer token=${process.env.AIRPORT_GAP_TOKEN}`)
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
