import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'

import { Starship } from './types'

const listStarships = async (): Promise<Starship[] | null> => {
  const docClient = new AWS.DynamoDB.DocumentClient()
  const params: DocumentClient.ScanInput = {
    TableName: process.env.STARSHIPS_TABLE
  }

  try {
    const { Items } = await docClient.scan(params).promise()
    return Items as Starship[]
  } catch (error) {
    console.log('DynamoDB error: ', error)
    return null
  }
}

export default listStarships
