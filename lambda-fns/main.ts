import { AppSyncEvent } from './types'
import { RESOLVERS } from './enums'
import getStarshipById from './getStarshipById'
import listStarships from './listStarships'
import createStarship from './createStarship'
import updateStarship from './updateStarship'
import deleteStarship from './deleteStarship'

export const handler = async (event: AppSyncEvent) => {
  switch (event.info.fieldName) {
    case RESOLVERS.getStarshipById: {
      return getStarshipById(event.arguments.starshipID!)
    }
    case RESOLVERS.listStarships: {
      return listStarships()
    }
    case RESOLVERS.createStarship: {
      return createStarship(event.arguments.createStarshipInput!)
    }
    case RESOLVERS.updateStarship: {
      return updateStarship(event.arguments.updateStarshipInput!)
    }
    case RESOLVERS.deleteStarship: {
      return deleteStarship(event.arguments.starshipID!)
    }
    default: {
      return null
    }
  }
}
