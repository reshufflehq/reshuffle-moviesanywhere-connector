const { Reshuffle, HttpConnector } = require('reshuffle')
const { MoviesAnywhereConnector } = require('reshuffle-moviesanywhere-connector')

const app = new Reshuffle()
const ma = new MoviesAnywhereConnector(app)
const http = new HttpConnector(app)

// Get MoviesAnywhere data by EIDR ID. Not all EIDRs have an AM data
// record, try 10.5240/DF48-AB62-4486-C185-9E1B-4

http.on({ method: 'GET', path: '/' }, async (event) => {
  const eidr = event.context.req.query.eidr
  if (!/^10\.5240\/([0-9A-F]{4}-){5}[0-9A-Z]$/.test(eidr)) {
    return event.context.res.status(400).send(`Invalid EIDR ID: ${eidr}`)
  }
  const data = await ma.getTitleByEIDR(eidr)
  return event.context.res.json(data)
})

app.start(8000)
