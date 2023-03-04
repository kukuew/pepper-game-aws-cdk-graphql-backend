import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'

import { Starship, UpdateStarshipInput } from './types'

const updateStarship = async (updateStarshipInput: UpdateStarshipInput): Promise<Starship | null> => {
  const docClient = new AWS.DynamoDB.DocumentClient()
  const putParams: DocumentClient.Put = {
    TableName: process.env.STARSHIPS_TABLE,
    Item: {}
  }
  const getParams: DocumentClient.GetItemInput = {
    TableName: process.env.STARSHIPS_TABLE,
    Key: {
      id: updateStarshipInput.id
    }
  }

  try {
    const { Item: starship } = await docClient.get(getParams).promise()
    if (!starship) {
      return null
    }
    const newStarship = {
      ...starship,
      ...updateStarshipInput
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
