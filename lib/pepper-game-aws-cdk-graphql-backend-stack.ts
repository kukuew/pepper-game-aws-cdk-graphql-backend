import * as cdk from '@aws-cdk/core'
import * as appsync from '@aws-cdk/aws-appsync'

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
  }
}
