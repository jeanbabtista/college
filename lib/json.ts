/**
 *
 * @param {boolean} error indicates whether there is an error
 * @param {string} message the error or success message
 * @param {any?} data can be array of objects or a single object
 */
const getJsonResponse = (
  error: boolean,
  message: string,
  data: any = null
) => ({ error, message, data })

export default getJsonResponse
