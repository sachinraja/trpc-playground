type IncomingRequest = {
  method?: string
  body?: Record<string, unknown>
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type TrpcPlaygroundOptions = {}

type HandlerParams = {
  req: IncomingRequest
  options: TrpcPlaygroundOptions
}
// export const handler = async (params: HandlerParams): Promise<Response> => {
//   const { req, options } = params
//   return {}
// }
