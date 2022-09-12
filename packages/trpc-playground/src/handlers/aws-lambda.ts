import { getAwsLambdaAdapter } from 'uttp/adapters/aws-lambda'
import { handler } from '../handler'

export const awsLambdaHandler = getAwsLambdaAdapter(handler)
