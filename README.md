# Movies Anywhere Connector

This package contains a [Resshufle](https://github.com/reshufflehq/reshuffle)
connector to Movies Anywhere, providing access to movie data per the
[Movies Anywhere API](https://api.moviesanywhere.com/v1/title/docs/index.html).

The following actions return title information in the `TitleData` structure,
as defined by the Movies Anywhere API. If the connector is configured with an
API token, the returned data will include trailer information.

In case of an error, all action throw an Error object.

_Actions_:

[getAllTitles](#getAllTitles) Get all titles data

[getTitleById](#getTitleById) Get title data by Movies Anywhere ID

[getTitleByEIDR](#getTitleByEIDR) Get title data by EIDR ID

[getTitlesByStudio](#getTitleByStudio) Get titles data from a specific studio

## Construction

```js
const app = new Reshuffle()
const moviesAnywhereConnector = new MoviesAnywhereConnector(app)
```

## Action Details

### <a name="getAllTitles"></a>Get all titles action

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

### <a name="getTitleById"></a>Get title by ID action

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

### <a name="getTitleByEIDR"></a>Get title by EIDR action

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

Get the title information associated with a given an EIDR ID, as specified by
the [EIDR API](http://eidr.org/documents/EIDR_2.1_REST_API.pdf).

### <a name="getTitlesByStudio"></a>Get titles by studio action

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
