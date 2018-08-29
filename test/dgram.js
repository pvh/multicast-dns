var helper = require('./helper')
var portfinder = require('portfinder')
var test = require('tape')
var mdns = require('../')

test('UDP works (echo test)', function (t) {
  portfinder.getPort(function (err, port) {
    t.error(err, 'Found free ports')
    var child

    var env = { PORT: port }
    helper.browserify('dgram.js', env, function (err) {
      t.error(err, 'Clean browserify build')
      child = helper.launchBrowser()
    })

    var dns = mdns()
    dns.on('query', function (query, rinfo) {
      console.log('got a query packet:', query)

      // iterate over all questions to check if we should respond
      query.questions.forEach(function (q) {
        console.log(q)
        if (q.type === 'A' && q.name === 'frombrowser.local') {
          dns.respond({
            answers: [{
              name: 'fromnode.local',
              type: 'A',
              ttl: 300,
              data: '192.168.1.5'
            }]
          }, rinfo)
        }
      })
    })

    dns.on('response', function (query, rinfo) {
      query.answers.forEach(function (a) {
        if (a.name === 'browserresponse.local') {
          console.log('VICTORY')
        }
      })
    })

    setTimeout(function () { child.kill() }, 60000)
  })
})
