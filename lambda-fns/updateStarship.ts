import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'

import { Starship, UpdateStarshipInput } from './types'

const updateStarship = async (starship: UpdateStarshipInput): Promise<Starship | null> => {
  const docClient = new AWS.DynamoDB.DocumentClient()
  const putParams: DocumentClient.Put = {
    TableName: process.env.STARSHIPS_TABLE,
    Item: {}
  }
  const getParams: DocumentClient.GetItemInput = {
    TableName: process.env.STARSHIPS_TABLE,
    Key: {
      id: starship.id
    }
  }

  try {
    const { Item: currentStarship } = await docClient.get(getParams).promise()
    if (!currentStarship) {
      return null
    }
    const newStarship = {
      ...currentStarship,
      ...starship
    }
    await docClient
      .put({
        ...putParams,
        Item: newStarship
      })
      .promise()

    return newStarship as Starship
  } catch (error) {
    console.log('DynamoDB error: ', error)
    return null
  }
}

export default updateStarship
