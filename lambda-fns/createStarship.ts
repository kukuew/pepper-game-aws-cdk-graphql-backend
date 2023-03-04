import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'

import { CreateStarshipInput, Starship } from './types'

const createStarship = async (createStarshipInput: CreateStarshipInput): Promise<Starship | null> => {
  const docClient = new AWS.DynamoDB.DocumentClient()
  const params: DocumentClient.PutItemInput = {
    TableName: process.env.STARSHIPS_TABLE,
    Item: createStarshipInput
  }

  try {
    await docClient.put(params).promise()
    return createStarshipInput
  } catch (error) {
    console.log('DynamoDB error: ', error)
    return null
  }
}

export default createStarship
