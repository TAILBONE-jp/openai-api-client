import {ApiClient, BlobWithFilename, Client, ObjectLike} from "../generated/apiClient.js";

import {AbstractThrottleManagerService} from "./AbstractThrottleManagerService.js";
import * as Formatter from "@himenon/openapi-parameter-formatter";
import {CreateChatCompletionStreamResponse} from "./CreateChatCompletionStreamResponse.js";

export interface OpenAIApiParams {
  apiKey?: string,
  organization?: string,
  baseUrl?: string,
  additionalHeaders?: ObjectLike
  onResponse?: (response: Response) => void
  throttleManagerService: AbstractThrottleManagerService,
}

export interface RequestInitWithCallbacks extends RequestInit {
  onOpen?: () => void
  /*
   * @param {CreateCompletionStreamResponse | CreateChatCompletionStreamResponse | FineTuneEvent} json
   */
  onMessage?: (json: any) => void
  onClose?: () => void
}

export const OpenAIApi = (
  {
    apiKey,
    baseUrl,
    additionalHeaders,
    onResponse,
    organization,
    throttleManagerService,
  }: OpenAIApiParams
) => {
  const openAiApiFetch: ApiClient<RequestInitWithCallbacks> = {
    request: async (
      {
        url,
        headers,
        queryParameters,
        requestBody,
        httpMethod
      },
      options
    ): Promise<any> => {
      await throttleManagerService.wait();

      const invokeThrottleManagerService = async (response: Response) => {
        const limitRequests = ratelimitValueToInteger(response.headers.get(
          "x-ratelimit-limit-requests"
        )) // 3

        const limitTokens = ratelimitValueToInteger(response.headers.get(
          "x-ratelimit-limit-tokens"
        )) // 40000

        const remainingRequests = ratelimitValueToInteger(response.headers.get(
          "x-ratelimit-remaining-requests"
        )) // 2

        const remainingTokens = ratelimitValueToInteger(response.headers.get(
          "x-ratelimit-remaining-tokens"
        )) // 39532

        const resetRequests = ratelimitResetValueToMilliSeconds(response.headers.get(
          "x-ratelimit-reset-requests"
        )) // 20s

        const resetTokens = ratelimitResetValueToMilliSeconds(response.headers.get(
          "x-ratelimit-reset-tokens"
        )) // 702ms

        await throttleManagerService.reset({
          limitRequests,
          limitTokens,
          remainingRequests,
          remainingTokens,
          resetRequests,
          resetTokens,
          url,
          method: httpMethod
        })
      }

      const query = generateQueryString(queryParameters);
      const requestUrl = query ? url + "?" + encodeURI(query) : url;
      headers = {
        ...headers,
        ...additionalHeaders,
      };

      if (apiKey) {
        headers = {
          ...headers,
          "Authorization": `Bearer ${apiKey}`
        }
      }

      if (organization) {
        headers = {
          ...headers,
          "OpenAI-Organization": organization
        }
      }

      let response: Response
      const contentType = headers["Content-Type"]

      switch (contentType) {
        case "application/json":
          response = await fetch(requestUrl, {
            ...options,
            body: JSON.stringify(requestBody),
            headers,
            method: httpMethod,
          });
          break
        case "multipart/form-data":
          delete headers["Content-Type"]
          const formData = new FormData()

          Object.entries(requestBody).forEach(([name, value]) => {
            if (typeof value === "string") {
              formData.append(name, value)
            } else {
              const blobWithFilename = value as BlobWithFilename
              formData.append(name, blobWithFilename, blobWithFilename.filename)
            }
          })

          response = await fetch(requestUrl, {
            ...options,
            body: formData,
            headers,
            method: httpMethod,
          });
          break
        default:
          response = await fetch(requestUrl, {
            ...options,
            headers,
            method: httpMethod,
          });
          break
      }

      if (onResponse) {
        onResponse(response.clone())
      }

      if (response.ok) {
        await invokeThrottleManagerService(response)

        const responseContentType = response.headers.get("content-type")
        switch (responseContentType) {
          case "application/json":
            if (/\/files\/.+\/content$/.test(url)) {
              // Should return text data despite it's content type is application/json (bug of OpenAI's schema)
              return await response.text();
            } else {
              return await response.json();
            }
          case "text/event-stream":
            if (response.body) {
              const reader = response.body.getReader()

              const textDecoder = new TextDecoder()

              let sentOnOpen = false
              let shouldContinue = true
              while (shouldContinue) {
                const {done, value} = await reader.read();
                const decodedArray = textDecoder.decode(value).split("\n")

                decodedArray.forEach(decoded => {
                  if (decoded.startsWith("data: ")) {
                    const stripped = decoded.replace("data: ", "")
                    if (stripped === "[DONE]") {
                      if (options?.onClose) {
                        options.onClose()
                      }
                    } else {
                      if (!sentOnOpen && options?.onOpen) {
                        sentOnOpen = true
                        options.onOpen()
                      }
                      if (options?.onMessage) {
                        options.onMessage(JSON.parse(stripped) as CreateChatCompletionStreamResponse)
                      }
                    }
                  }
                })

                if (done) {
                  shouldContinue = false;
                }
              }
            }
            break
          case "application/octet-stream":
            return await response.text();
          default:
            throw new Error(`Unknown content type: ${responseContentType}`)
        }
      } else {
        throw new Error(`[${response.status}] ${response.statusText} at ${httpMethod} ${url} Headers: ${JSON.stringify(headers)}`)
      }
    }
  };

  return new Client(openAiApiFetch, baseUrl || "https://api.openai.com/v1");
};

const ratelimitResetValueToMilliSeconds = (value: string | null): number | null => {
  if (value?.endsWith("ms")) {
    return Number(value?.replaceAll(/[^0-9.]/g, ""))
  } else if (value?.endsWith("s")) {
    return Number(value?.replaceAll(/[^0-9.]/g, "")) * 1000
  } else {
    return null
  }
}

const ratelimitValueToInteger = (value: string | null): number | null => {
  return Number(value?.replace(/[^0-9.]/, ""))
}

const generateQueryString = (
  queryParameters: any | undefined
): string | undefined => {
  if (!queryParameters) {
    return undefined;
  }
  const queries = Object.entries(queryParameters).reduce<string[]>(
    (queryStringList, [key, item]) => {
      // @ts-ignore
      if (!item.value) {
        return queryStringList;
      }
      // @ts-ignore
      if (!item.style) {
        // @ts-ignore
        return queryStringList.concat(`${key}=${item.value}`);
      }
      const result = Formatter.QueryParameter.generate(
        key,
        item as any
      );
      if (result) {
        return queryStringList.concat(result);
      }
      return queryStringList;
    },
    []
  );

  return queries.join("&");
};
