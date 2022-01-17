import { ClientConfig } from '@trpc-playground/types'
import { DeepRequired } from 'ts-essentials'
import { trpc } from '../components/provider'

export type TrpcClient = ReturnType<typeof trpc.createClient>
export type DeepRequiredClientConfig = DeepRequired<ClientConfig>
