import { Starship } from './types'

const getStarshipById = async (starshipID: string): Promise<Starship> => {
  return {
    id: starshipID,
    name: 'Crawler',
    attributes: []
  }
}

export default getStarshipById
