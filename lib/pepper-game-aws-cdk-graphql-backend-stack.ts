import * as cdk from '@aws-cdk/core'
import * as appsync from '@aws-cdk/aws-appsync'
import * as lambda from '@aws-cdk/aws-lambda'
import * as ddb from '@aws-cdk/aws-dynamodb'
import * as cr from '@aws-cdk/custom-resources'

import { RESOLVERS } from '../lambda-fns/enums'
import { StarshipsFaker } from './starships-faker'

export class PepperGameAwsCdkGraphqlBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const api = new appsync.GraphqlApi(this, 'PepperGame:API', {
      name: 'cdk-pepper-game-appsync-api',
      schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(30))
          }
        }
      },
      xrayEnabled: true
    })

    new cdk.CfnOutput(this, 'PepperGame:GraphQL-API-URL', {
      value: api.graphqlUrl
    })

    new cdk.CfnOutput(this, 'PepperGame:GraphQL-API-Key', {
      value: api.apiKey || ''
    })

    const starshipsLambda = new lambda.Function(this, 'AppSyncPepperGameStarshipsHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('lambda-fns'),
      memorySize: 1024
    })

    const starshipsLambdaDS = api.addLambdaDataSource('starshipsLambdaDataSource', starshipsLambda)

    starshipsLambdaDS.createResolver({
      typeName: 'Query',
      fieldName: RESOLVERS.getStarshipById
    })

    starshipsLambdaDS.createResolver({
      typeName: 'Query',
      fieldName: RESOLVERS.listStarships
    })

    starshipsLambdaDS.createResolver({
      typeName: 'Mutation',
      fieldName: RESOLVERS.createStarship
    })

    starshipsLambdaDS.createResolver({
      typeName: 'Mutation',
      fieldName: RESOLVERS.updateStarship
    })

    starshipsLambdaDS.createResolver({
      typeName: 'Mutation',
      fieldName: RESOLVERS.deleteStarship
    })

    const table = new ddb.Table(this, 'StarshipsTable', {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING
      }
    })

    new cr.AwsCustomResource(this, 'initDBResourceBatch0', {
      onCreate: {
        service: 'DynamoDB',
        action: 'batchWriteItem',
        parameters: {
          RequestItems: {
            [table.tableName]: StarshipsFaker.generateBatch()
          }
        },
        physicalResourceId: cr.PhysicalResourceId.of('initDBDataBatch0')
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({ resources: [table.tableArn] })
    })

    table.grantFullAccess(starshipsLambda)
    starshipsLambda.addEnvironment('STARSHIPS_TABLE', table.tableName)
  }
}
