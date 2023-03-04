import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'

const deleteStarship = async (starshipID: string): Promise<string | null> => {
  const docClient = new AWS.DynamoDB.DocumentClient()
  const params: DocumentClient.DeleteItemInput = {
    TableName: process.env.STARSHIPS_TABLE,
    Key: {
      id: starshipID
    }
  }

  try {
    await docClient.delete(params).promise()
  } catch (error) {
    console.log('DynamoDB error: ', error)
    return null
  }

  return starshipID
}

export default deleteStarship
