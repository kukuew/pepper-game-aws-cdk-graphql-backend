import { Starship } from './types'

const listStarships = async (): Promise<Starship[]> => {
  return [
    {
      id: '1',
      name: 'Crawler',
      attributes: []
    },
    {
      id: '2',
      name: 'Crawler 2',
      attributes: []
    }
  ]
}

export default listStarships
