import * as cdk from '@aws-cdk/core'
import * as appsync from '@aws-cdk/aws-appsync'
import * as lambda from '@aws-cdk/aws-lambda'
import * as ddb from '@aws-cdk/aws-dynamodb'
import { Template } from '@aws-cdk/assertions'
import * as PepperGameAwsCdkGraphqlBackend from '../lib/pepper-game-aws-cdk-graphql-backend-stack'

describe('Stack resources', () => {
  const app = new cdk.App()
  const stack = new PepperGameAwsCdkGraphqlBackend.PepperGameAwsCdkGraphqlBackendStack(app, 'MyTestStack')
  const template = Template.fromStack(stack)

  test('AppSync GraphQLApi Created', () => {
    template.hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AuthenticationType: appsync.AuthorizationType.API_KEY,
      Name: 'cdk-pepper-game-appsync-api',
      XrayEnabled: true
    })
  })

  test('Lambda Function Created', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'main.handler',
      MemorySize: 1024,
      Runtime: lambda.Runtime.NODEJS_14_X.name
    })
  })

  test('DynamoDB Table Created', () => {
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: ddb.AttributeType.STRING
        }
      ],
      BillingMode: ddb.BillingMode.PAY_PER_REQUEST
    })
  })
})
