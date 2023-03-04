import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'

import { Starship, StarshipInput } from './types'

const createStarship = async (starship: StarshipInput): Promise<Starship | null> => {
  const docClient = new AWS.DynamoDB.DocumentClient()
  const params: DocumentClient.PutItemInput = {
    TableName: process.env.STARSHIPS_TABLE,
    Item: starship
  }

  try {
    await docClient.put(params).promise()
    return starship
  } catch (error) {
    console.log('DynamoDB error: ', error)
    return null
  }
}

export default createStarship
