import { v4 as uuidv4 } from 'uuid'

export class StarshipsFaker {
  static minCrew = 3
  static maxCrew = 10
  static starships = ['Azure Angel II', 'Colossus', 'Eravana', 'Fireball', 'Ghost', 'Malevolence', 'Phantom']

  static getStarships = () => {
    return StarshipsFaker.starships
  }

  static getCrew = () => {
    return `${Math.floor(
      Math.random() * (StarshipsFaker.maxCrew - StarshipsFaker.minCrew + 1) + StarshipsFaker.minCrew
    )}`
  }

  static generateBatch = () => {
    return StarshipsFaker.getStarships().map(starshipName => {
      return {
        PutRequest: {
          Item: {
            id: { S: uuidv4() },
            name: { S: starshipName },
            attributes: {
              L: [{ M: { name: { S: 'crew' }, value: { S: StarshipsFaker.getCrew() } } }]
            }
          }
        }
      }
    })
  }
}
