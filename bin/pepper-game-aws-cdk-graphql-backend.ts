#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { PepperGameAwsCdkGraphqlBackendStack } from '../lib/pepper-game-aws-cdk-graphql-backend-stack'

const app = new cdk.App()
new PepperGameAwsCdkGraphqlBackendStack(app, 'PepperGameAwsCdkGraphqlBackendStack')
