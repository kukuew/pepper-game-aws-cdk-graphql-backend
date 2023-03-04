import { Starship, UpdateStarshipInput } from './types'

const updateStarship = async (starship: UpdateStarshipInput): Promise<Starship> => {
  return {
    id: starship.id,
    name: starship?.name || 'Crawler',
    attributes: starship?.attributes || []
  }
}

export default updateStarship
