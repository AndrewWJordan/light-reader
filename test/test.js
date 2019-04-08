const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
// Configure chai
chai.use(chaiHttp)
chai.should()
describe("Response test", () => {
    describe("GET /", () => {
        // Test for 200
        it("should return 200 status", (done) => {
             chai.request(app)
                 .get('/')
                 .end((err, res) => {
                     res.should.have.status(200)
                     // res.body.should.be.a('object')
                     done()
                  })
         })
    })
})
