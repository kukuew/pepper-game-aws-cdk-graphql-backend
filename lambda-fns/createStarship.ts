import * as AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'

import { CreateStarshipInput, Starship } from './types'

const createStarship = async (createStarshipInput: CreateStarshipInput): Promise<Starship | null> => {
  const docClient = new AWS.DynamoDB.DocumentClient()
  const starship: Starship = {
    id: uuidv4(),
    ...createStarshipInput
  }
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
