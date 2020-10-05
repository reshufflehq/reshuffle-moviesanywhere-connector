const { Reshuffle } = require('reshuffle')
const { MoviesAnywhereConnector } = require('reshuffle-moviesanywhere-connector')

async function main() {
  const app = new Reshuffle()
  const ma = new MoviesAnywhereConnector(app)

  const studio = 'Universal'
  console.log(`Getting all ${studio} titles. This could take a while`)
  const { results } = await ma.getTitlesByStudio(studio)
  console.log('Here they are:')
  console.log(results)
}

main()
