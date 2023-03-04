import * as cdk from '@aws-cdk/core'
import * as appsync from '@aws-cdk/aws-appsync'
import * as lambda from '@aws-cdk/aws-lambda'
import * as ddb from '@aws-cdk/aws-dynamodb'

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
      fieldName: 'getStarshipById'
    })

    starshipsLambdaDS.createResolver({
      typeName: 'Query',
      fieldName: 'listStarships'
    })

    starshipsLambdaDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'createStarship'
    })

    starshipsLambdaDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateStarship'
    })

    starshipsLambdaDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'deleteStarship'
    })

    const table = new ddb.Table(this, 'StarshipsTable', {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING
      }
    })

    table.grantFullAccess(starshipsLambda)
    starshipsLambda.addEnvironment('STARSHIPS_TABLE', table.tableName)
  }
}
