const express = require('express')
const proxy = require('express-http-proxy')
const next = require('next')
const isDev = (process.env.NODE_ENV !== 'production')
const app = next({ isDev })
const handle = app.getRequestHandler()
const getHost = () => {
  switch (process.env.NODE_ENV) {
  case 'production':
    return 'https://crit.tw' // TO DO: TBD
  case 'stage':
    return 'http://192.168.0.196:40000'
  default:
    return 'http://localhost:1337'
  }
}
const host = getHost()

app.prepare()
.then(() => {
  const server = express()
  server.get('/event/:uniqueName', (req, res) => app.render(req, res, '/event', req.params))
  server.get('/event/:uniqueName/:nav', (req, res) => app.render(req, res, '/event', req.params))
  server.get('/', (req, res) => app.render(req, res, '/index', req.query))
  server.get('*', (req, res) => handle(req, res))
  server.get('/api/**/**', proxy(host))
  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
