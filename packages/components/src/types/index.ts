import { trpc } from '../components/provider'

export type TrpcClient = ReturnType<typeof trpc.createClient>
