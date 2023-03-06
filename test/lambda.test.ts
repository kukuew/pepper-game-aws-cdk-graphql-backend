import * as AWS from '../__mocks__/aws-sdk'
import { v4 as uuidv4 } from '../__mocks__/uuid'
import { handler } from '../lambda-fns/main'
import { AppSyncEvent, Starship } from '../lambda-fns/types'
import { RESOLVERS } from '../lambda-fns/enums'

const docClient = new AWS.DynamoDB.DocumentClient()

describe('Lambda handler', () => {
  const OLD_ENV = process.env

  const starship: Starship = {
    id: uuidv4(),
    name: 'Battlecruiser',
    attributes: [
      {
        name: 'crew',
        value: '5'
      }
    ]
  }

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  test('getStarshipById', async () => {
    process.env.STARSHIPS_TABLE = 'TEST_TABLE'

    const event: AppSyncEvent = {
      info: {
        fieldName: RESOLVERS.getStarshipById
      },
      arguments: {
        starshipID: starship.id
      }
    }

    AWS.awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({ Item: starship }))

    const res = await handler(event)

    expect(docClient.get).toHaveBeenCalledWith({
      TableName: process.env.STARSHIPS_TABLE,
      Key: {
        id: starship.id
      }
    })
    expect(res).toEqual(starship)

    docClient.get.mockClear()
  })

  test('listStarships', async () => {
    process.env.STARSHIPS_TABLE = 'TEST_TABLE'

    const event: AppSyncEvent = {
      info: {
        fieldName: RESOLVERS.listStarships
      },
      arguments: {}
    }

    AWS.awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({ Items: [starship] }))

    const res = await handler(event)

    expect(docClient.scan).toHaveBeenCalledWith({
      TableName: process.env.STARSHIPS_TABLE
    })
    expect(res).toEqual([starship])

    docClient.scan.mockClear()
  })

  test('createStarship', async () => {
    process.env.STARSHIPS_TABLE = 'TEST_TABLE'

    const event: AppSyncEvent = {
      info: {
        fieldName: RESOLVERS.createStarship
      },
      arguments: {
        createStarshipInput: starship
      }
    }

    const res = await handler(event)

    expect(docClient.put).toHaveBeenCalledWith({
      TableName: process.env.STARSHIPS_TABLE,
      Item: starship
    })
    expect(res).toEqual(starship)

    docClient.put.mockClear()
  })

  test('updateStarship', async () => {
    process.env.STARSHIPS_TABLE = 'TEST_TABLE'

    const event: AppSyncEvent = {
      info: {
        fieldName: RESOLVERS.updateStarship
      },
      arguments: {
        updateStarshipInput: starship
      }
    }

    AWS.awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({ Item: starship }))

    await handler(event)

    expect(docClient.get).toHaveBeenCalledWith({
      TableName: process.env.STARSHIPS_TABLE,
      Key: {
        id: starship.id
      }
    })

    expect(docClient.put).toHaveBeenCalledWith({
      TableName: process.env.STARSHIPS_TABLE,
      Item: starship
    })

    docClient.get.mockClear()
    docClient.put.mockClear()
  })

  test('deleteStarship', async () => {
    process.env.STARSHIPS_TABLE = 'TEST_TABLE'

    const event: AppSyncEvent = {
      info: {
        fieldName: RESOLVERS.deleteStarship
      },
      arguments: {
        starshipID: starship.id
      }
    }

    const res = await handler(event)

    expect(docClient.delete).toHaveBeenCalledWith({
      TableName: process.env.STARSHIPS_TABLE,
      Key: {
        id: starship.id
      }
    })
    expect(res).toEqual(starship.id)

    docClient.delete.mockClear()
  })
})
