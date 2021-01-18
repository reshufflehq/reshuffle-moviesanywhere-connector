# reshuffle-moviesanywhere-connector

[Code](https://github.com/reshufflehq/reshuffle-moviesanywhere-connector) |
[npm](https://www.npmjs.com/package/reshuffle-moviesanywhere-connector) |
[Code sample](https://github.com/reshufflehq/reshuffle-moviesanywhere-connector/tree/master/examples)

`npm install reshuffle-moviesanywhere-connector`

### Reshuffle Movies Anywhere Connector

This package contains a [Reshuffle](https://reshuffle.com)
connector to Movies Anywhere, providing access to movie data per the
[Movies Anywhere API](https://api.moviesanywhere.com/v1/title/docs/index.html).

The following actions return title information in the `TitleData` structure,
as defined by the Movies Anywhere API. If the connector is configured with an
API token, the returned data will include trailer information.

The following example creates an API endpoint for retrieving movie data using
its [EIDR](https://eidr.org) ID. You can try
**10.5240/DF48-AB62-4486-C185-9E1B-4** or find EIDR IDs using the
[Reshuffle EIDR Connector](https://github.com/reshufflehq/reshuffle-eidr-connector):

```js
const { Reshuffle, HttpConnector } = require('reshuffle')
const { MoviesAnywhereConnector } = require('reshuffle-moviesanywhere-connector')

const app = new Reshuffle()
const ma = new MoviesAnywhereConnector(app)
const http = new HttpConnector(app)

http.on({ method: 'GET', path: '/' }, async (event) => {
  const eidr = event.req.query.eidr
  if (!/^10\.5240\/([0-9A-F]{4}-){5}[0-9A-Z]$/.test(eidr)) {
    return event.res.status(400).send(`Invalid EIDR ID: ${eidr}`)
  }
  const data = await ma.getTitleByEIDR(eidr)
  return event.res.json(data)
})

app.start(8000)
```

#### Table of Contents

[Configuration](#configuration) Configuration options

_Connector actions_:

[getAllTitles](#getAllTitles) Get all titles data

[getTitleById](#getTitleById) Get title data by Movies Anywhere ID

[getTitleByEIDR](#getTitleByEIDR) Get title data by EIDR ID

[getTitlesByStudio](#getTitleByStudio) Get titles data for a specific studio

##### <a name="configuration"></a>Configuration options

```js
const app = new Reshuffle()
const moviesAnywhereConnector = new MoviesAnywhereConnector(app)
```

#### Connector actions

##### <a name="getAllTitles"></a>Get all titles action

_Definition:_

```
() => {
  count: number,
  results: TitleData[],
}
```

_Usage:_

```js
const { count, results } = await moviesAnywhereConnector.getAllTitles()
```

Retrieve all title information stored by Movies Anywhere.

##### <a name="getTitleById"></a>Get title by ID action

_Definition:_

```
(
 id: string
) => TitleData
```

_Usage:_

```js
const id = '7c1d0438-a71d-40a7-8567-6a4f714355cd'
const titleData = await moviesAnywhereConnector.getTitleById(id)
```

Get the title information associated with a given Movies Anywhere ID.

##### <a name="getTitleByEIDR"></a>Get title by EIDR action

_Definition:_

```
(
 eidr: string
) => TitleData
```

_Usage:_

```js
const eidr = '10.5240/CEFE-FECA-CBD0-F72A-E650-H'
const titleData = await moviesAnywhereConnector.getTitleByEIDR(eidr)
```

Get the title information associated with a given EIDR ID, as specified by
the [EIDR API](http://eidr.org/documents/EIDR_2.1_REST_API.pdf).

##### <a name="getTitlesByStudio"></a>Get titles by studio action

_Definition:_

```
(
 studio: 'Disney' | 'Fox' | 'Lionsgate' | 'Sony' | 'Universal' | 'WB'
) => {
  count: number,
  results: TitleData[],
}
```

_Usage:_

```js
const studio = 'Universal'
const { count, results } =
  await moviesAnywhereConnector.getTitlesByStudio(studio)
```

Retrieve all title information for movies released by the specified studio.
