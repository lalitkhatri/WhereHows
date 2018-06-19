import fetch from 'fetch';
import { apiErrorStatusMessage } from 'wherehows-web/constants/errors/errors';
import { ApiError, throwIfApiError } from 'wherehows-web/utils/api/errors/errors';

/**
 * Describes the attributes on the fetch configuration object
 */
interface FetchConfig {
  url: string;
  headers?: { [key: string]: string } | Headers;
  data?: object;
}

/**
 * Describes the available options on an option bag to be passed into a fetch call
 * @interface IFetchOptions
 */
interface IFetchOptions {
  method?: string;
  body?: any;
  headers?: object | Headers;
  credentials?: RequestCredentials;
}

/**
 * Augments the user supplied headers with the default accept and content-type headers
 * @param {FetchConfig.headers} headers
 */
const withBaseFetchHeaders = (headers: FetchConfig['headers']): { headers: FetchConfig['headers'] } => ({
  headers: Object.assign(
    {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    headers
  )
});

/**
 * Sends a HTTP request and resolves with the JSON response
 * @template T
 * @param {string} url the url for the endpoint to request a response from
 * @param {object} fetchConfig
 * @returns {Promise<T>}
 */
const json = <T>(url: string = '', fetchConfig: IFetchOptions = {}): Promise<T> =>
  fetch(url, fetchConfig).then<T>(response => throwIfApiError(response));

/**
 * Conveniently gets a JSON response using the fetch api
 * @template T
 * @param {FetchConfig} config
 * @return {Promise<T>}
 */
const getJSON = <T>(config: FetchConfig): Promise<T> => {
  const fetchConfig = { ...withBaseFetchHeaders(config.headers), method: 'GET' };

  return json<T>(config.url, fetchConfig);
};

/**
 * Initiates a POST request using the Fetch api
 * @template T
 * @param {FetchConfig} config
 * @returns {Promise<T>}
 */
const postJSON = <T>(config: FetchConfig): Promise<T> => {
  const requestBody = config.data ? { body: JSON.stringify(config.data) } : {};
  const fetchConfig = Object.assign(
    requestBody,
    config.data && { body: JSON.stringify(config.data) },
    withBaseFetchHeaders(config.headers),
    { method: 'POST' }
  );

  return json<T>(config.url, fetchConfig);
};

/**
 * Initiates a DELETE request using the Fetch api
 * @template T
 * @param {FetchConfig} config
 * @return {Promise<T>}
 */
const deleteJSON = <T>(config: FetchConfig): Promise<T> => {
  const requestBody = config.data ? { body: JSON.stringify(config.data) } : {};
  const fetchConfig = Object.assign(requestBody, withBaseFetchHeaders(config.headers), { method: 'DELETE' });

  return json<T>(config.url, fetchConfig);
};

/**
 * Initiates a PUT request using the Fetch api
 * @template T
 * @param {FetchConfig} config
 * @return {Promise<T>}
 */
const putJSON = <T>(config: FetchConfig): Promise<T> => {
  const requestBody = config.data ? { body: JSON.stringify(config.data) } : {};

  const fetchConfig = Object.assign(requestBody, withBaseFetchHeaders(config.headers), { method: 'PUT' });

  return json<T>(config.url, fetchConfig);
};

/**
 * Requests the headers from a resource endpoint
 * @param {FetchConfig} config
 * @return {Promise<Headers>}
 */
const getHeaders = async (config: FetchConfig): Promise<Headers> => {
  const fetchConfig = {
    ...withBaseFetchHeaders(config.headers),
    method: 'HEAD'
  };
  const response = await fetch(config.url, fetchConfig);
  const { ok, headers, status } = response;

  if (ok) {
    return headers;
  }

  throw new ApiError(status, apiErrorStatusMessage(status));
};

export { getJSON, postJSON, deleteJSON, putJSON, getHeaders };
