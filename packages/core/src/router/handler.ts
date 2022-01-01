type IncomingRequest = {
  method?: string
  body?: Record<string, any>
}

export type TrpcPlaygroundOptions = {}

type HandlerParams = {
  req: IncomingRequest
  options: TrpcPlaygroundOptions
}
// export const handler = async (params: HandlerParams): Promise<Response> => {
//   const { req, options } = params
//   return {}
// }
