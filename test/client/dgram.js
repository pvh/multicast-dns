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
