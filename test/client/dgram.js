var mdns = require('../../')

let dns = mdns()

dns.on('response', function (response) {
  console.log('got a response', response)
})

dns.query({
  questions: [{
    name: 'frombrowser.local',
    type: 'A'
  }]
})

dns.on('query', function (query) {
  console.log('received a query', query)
})

dns.response({
  answers: [{
    name: 'browserresponse.local',
    type: 'A',
    ttl: 300,
    data: '192.168.1.16'
  }]
})
