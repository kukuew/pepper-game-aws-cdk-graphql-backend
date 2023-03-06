export const awsSdkPromiseResponse = jest.fn().mockReturnValue(Promise.resolve(true))

const deleteFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }))
const scanFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }))
const getFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }))
const putFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }))

class DocumentClient {
  delete = deleteFn
  scan = scanFn
  get = getFn
  put = putFn
}

export const DynamoDB = {
  DocumentClient
}
