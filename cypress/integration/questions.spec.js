
describe('Questions route', ()=>{
  context('GET /questions', ()=>{
    it('should return a lists of questions', ()=>{
      cy.request({
        method: 'GET',
        url: 'http://localhost:3113/api/fec2/rfp/qa/questions?product_id=1&page=1&count=6'
      })
        .should((res)=>{
          expect(res.status).to.eq(200);
          expect(res.body.product_id).to.eq('1')
          expect(res.body.results.length).to.be.eq(3);
          expect(res.body.results[1]).to.deep.equal({
            answers: {
              65: {
                answerer_name: "dschulman",
                body: "It runs small",
                date: "2020-11-19T00:00:00",
                helpfulness: 1,
                id: 65,
                photos: [
                  "https://images.unsplash.com/photo-1470116892389-0de5d9770b2c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80",
                  "https://images.unsplash.com/photo-1536922645426-5d658ab49b81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
                ]
              },
              89: {
            answerer_name: "sillyguy",
            body: "Showing no wear after a few months!",
            date: "2020-09-02T00:00:00",
            helpfulness: 8,
            id: 89,
            photos: []
              }
            },
            asker_name: "funnygirl",
            question_body: "How long does it last?",
            question_date: "2020-07-09T04:00:00.000Z",
            question_helpfulness: 6,
            question_id: 4,
            reported: false
          })
        })
    })
    it('should have the correct count of answers', ()=>{
      let count = 10
      cy.request({
        method: 'GET',
        url: `http://localhost:3113/api/fec2/rfp/qa/questions?product_id=3&page=1&count=${count}`
      })
        .should(res=>{
          expect(res.status).to.eq(200);
          expect(res.body.results.length).to.be.eq(count);
        })
    })

    v
  })
})

Cypress.on('test:after:run', (attributes) => {
  console.log('Test "%s" has finished in %dms',
    attributes.title, attributes.duration)
})