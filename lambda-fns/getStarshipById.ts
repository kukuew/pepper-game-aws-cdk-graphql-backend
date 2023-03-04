import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'

import { Starship } from './types'

const getStarshipById = async (starshipID: string): Promise<Starship | null> => {
  const docClient = new AWS.DynamoDB.DocumentClient()
  const params: DocumentClient.GetItemInput = {
    TableName: process.env.STARSHIPS_TABLE,
    Key: {
      id: starshipID
    }
  }

  try {
    const { Item: starship } = await docClient.get(params).promise()
    return starship as Starship
  } catch (error) {
    console.log('DynamoDB error: ', error)
    return null
  }
}

export default getStarshipById
