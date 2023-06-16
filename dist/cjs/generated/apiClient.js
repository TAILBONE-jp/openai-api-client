"use strict";
// 
// Generated by @himenon/openapi-typescript-code-generator v0.26.1
// 
// OpenApi : 3.0.0
// 
// 
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlobWithFilename = exports.Client = void 0;
class Client {
    apiClient;
    baseUrl;
    constructor(apiClient, baseUrl) {
        this.apiClient = apiClient;
        this.baseUrl = baseUrl.replace(/\/$/, "");
    }
    /**
     * @deprecated
     * Lists the currently available (non-finetuned) models, and provides basic information about each one such as the owner and availability.
     */
    async listEngines(option) {
        const url = this.baseUrl + `/engines`;
        const headers = {
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "GET",
            url,
            headers
        }, option);
    }
    /**
     * @deprecated
     * Retrieves a model instance, providing basic information about it such as the owner and availability.
     */
    async retrieveEngine(params, option) {
        const url = this.baseUrl + `/engines/${params.parameter.engine_id}`;
        const headers = {
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "GET",
            url,
            headers
        }, option);
    }
    /** Creates a model response for the given chat conversation. */
    async createChatCompletion(params, option) {
        const url = this.baseUrl + `/chat/completions`;
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "POST",
            url,
            headers,
            requestBody: params.requestBody
        }, option);
    }
    /** Creates a completion for the provided prompt and parameters. */
    async createCompletion(params, option) {
        const url = this.baseUrl + `/completions`;
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "POST",
            url,
            headers,
            requestBody: params.requestBody
        }, option);
    }
    /** Creates a new edit for the provided input, instruction, and parameters. */
    async createEdit(params, option) {
        const url = this.baseUrl + `/edits`;
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "POST",
            url,
            headers,
            requestBody: params.requestBody
        }, option);
    }
    /** Creates an image given a prompt. */
    async createImage(params, option) {
        const url = this.baseUrl + `/images/generations`;
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "POST",
            url,
            headers,
            requestBody: params.requestBody
        }, option);
    }
    /** Creates an edited or extended image given an original image and a prompt. */
    async createImageEdit(params, option) {
        const url = this.baseUrl + `/images/edits`;
        const headers = {
            "Content-Type": "multipart/form-data",
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "POST",
            url,
            headers,
            requestBody: params.requestBody
        }, option);
    }
    /** Creates a variation of a given image. */
    async createImageVariation(params, option) {
        const url = this.baseUrl + `/images/variations`;
        const headers = {
            "Content-Type": "multipart/form-data",
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "POST",
            url,
            headers,
            requestBody: params.requestBody
        }, option);
    }
    /** Creates an embedding vector representing the input text. */
    async createEmbedding(params, option) {
        const url = this.baseUrl + `/embeddings`;
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "POST",
            url,
            headers,
            requestBody: params.requestBody
        }, option);
    }
    /** Transcribes audio into the input language. */
    async createTranscription(params, option) {
        const url = this.baseUrl + `/audio/transcriptions`;
        const headers = {
            "Content-Type": "multipart/form-data",
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "POST",
            url,
            headers,
            requestBody: params.requestBody
        }, option);
    }
    /** Translates audio into into English. */
    async createTranslation(params, option) {
        const url = this.baseUrl + `/audio/translations`;
        const headers = {
            "Content-Type": "multipart/form-data",
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "POST",
            url,
            headers,
            requestBody: params.requestBody
        }, option);
    }
    /**
     * @deprecated
     * The search endpoint computes similarity scores between provided query and documents. Documents can be passed directly to the API if there are no more than 200 of them.
     *
     * To go beyond the 200 document limit, documents can be processed offline and then used for efficient retrieval at query time. When `file` is set, the search endpoint searches over all the documents in the given file and returns up to the `max_rerank` number of documents. These documents will be returned along with their search scores.
     *
     * The similarity score is a positive score that usually ranges from 0 to 300 (but can sometimes go higher), where a score above 200 usually means the document is semantically similar to the query.
     */
    async createSearch(params, option) {
        const url = this.baseUrl + `/engines/${params.parameter.engine_id}/search`;
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "POST",
            url,
            headers,
            requestBody: params.requestBody
        }, option);
    }
    /** Returns a list of files that belong to the user's organization. */
    async listFiles(option) {
        const url = this.baseUrl + `/files`;
        const headers = {
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "GET",
            url,
            headers
        }, option);
    }
    /** Upload a file that contains document(s) to be used across various endpoints/features. Currently, the size of all the files uploaded by one organization can be up to 1 GB. Please contact us if you need to increase the storage limit. */
    async createFile(params, option) {
        const url = this.baseUrl + `/files`;
        const headers = {
            "Content-Type": "multipart/form-data",
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "POST",
            url,
            headers,
            requestBody: params.requestBody
        }, option);
    }
    /** Returns information about a specific file. */
    async retrieveFile(params, option) {
        const url = this.baseUrl + `/files/${params.parameter.file_id}`;
        const headers = {
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "GET",
            url,
            headers
        }, option);
    }
    /** Delete a file. */
    async deleteFile(params, option) {
        const url = this.baseUrl + `/files/${params.parameter.file_id}`;
        const headers = {
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "DELETE",
            url,
            headers
        }, option);
    }
    /** Returns the contents of the specified file */
    async downloadFile(params, option) {
        const url = this.baseUrl + `/files/${params.parameter.file_id}/content`;
        const headers = {
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "GET",
            url,
            headers
        }, option);
    }
    /**
     * @deprecated
     * Answers the specified question using the provided documents and examples.
     *
     * The endpoint first [searches](/docs/api-reference/searches) over provided documents or files to find relevant context. The relevant context is combined with the provided examples and question to create the prompt for [completion](/docs/api-reference/completions).
     */
    async createAnswer(params, option) {
        const url = this.baseUrl + `/answers`;
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "POST",
            url,
            headers,
            requestBody: params.requestBody
        }, option);
    }
    /**
     * @deprecated
     * Classifies the specified `query` using provided examples.
     *
     * The endpoint first [searches](/docs/api-reference/searches) over the labeled examples
     * to select the ones most relevant for the particular query. Then, the relevant examples
     * are combined with the query to construct a prompt to produce the final label via the
     * [completions](/docs/api-reference/completions) endpoint.
     *
     * Labeled examples can be provided via an uploaded `file`, or explicitly listed in the
     * request using the `examples` parameter for quick tests and small scale use cases.
     */
    async createClassification(params, option) {
        const url = this.baseUrl + `/classifications`;
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "POST",
            url,
            headers,
            requestBody: params.requestBody
        }, option);
    }
    /** List your organization's fine-tuning jobs */
    async listFineTunes(option) {
        const url = this.baseUrl + `/fine-tunes`;
        const headers = {
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "GET",
            url,
            headers
        }, option);
    }
    /**
     * Creates a job that fine-tunes a specified model from a given dataset.
     *
     * Response includes details of the enqueued job including job status and the name of the fine-tuned models once complete.
     *
     * [Learn more about Fine-tuning](/docs/guides/fine-tuning)
     */
    async createFineTune(params, option) {
        const url = this.baseUrl + `/fine-tunes`;
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "POST",
            url,
            headers,
            requestBody: params.requestBody
        }, option);
    }
    /**
     * Gets info about the fine-tune job.
     *
     * [Learn more about Fine-tuning](/docs/guides/fine-tuning)
     */
    async retrieveFineTune(params, option) {
        const url = this.baseUrl + `/fine-tunes/${params.parameter.fine_tune_id}`;
        const headers = {
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "GET",
            url,
            headers
        }, option);
    }
    /** Immediately cancel a fine-tune job. */
    async cancelFineTune(params, option) {
        const url = this.baseUrl + `/fine-tunes/${params.parameter.fine_tune_id}/cancel`;
        const headers = {
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "POST",
            url,
            headers
        }, option);
    }
    /** Get fine-grained status updates for a fine-tune job. */
    async listFineTuneEvents(params, option) {
        const url = this.baseUrl + `/fine-tunes/${params.parameter.fine_tune_id}/events`;
        const headers = {
            Accept: "application/json"
        };
        const queryParameters = {
            stream: { value: params.parameter.stream, explode: false }
        };
        return this.apiClient.request({
            httpMethod: "GET",
            url,
            headers,
            queryParameters: queryParameters
        }, option);
    }
    /** Lists the currently available models, and provides basic information about each one such as the owner and availability. */
    async listModels(option) {
        const url = this.baseUrl + `/models`;
        const headers = {
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "GET",
            url,
            headers
        }, option);
    }
    /** Retrieves a model instance, providing basic information about the model such as the owner and permissioning. */
    async retrieveModel(params, option) {
        const url = this.baseUrl + `/models/${params.parameter.model}`;
        const headers = {
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "GET",
            url,
            headers
        }, option);
    }
    /** Delete a fine-tuned model. You must have the Owner role in your organization. */
    async deleteModel(params, option) {
        const url = this.baseUrl + `/models/${params.parameter.model}`;
        const headers = {
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "DELETE",
            url,
            headers
        }, option);
    }
    /** Classifies if text violates OpenAI's Content Policy */
    async createModeration(params, option) {
        const url = this.baseUrl + `/moderations`;
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json"
        };
        return this.apiClient.request({
            httpMethod: "POST",
            url,
            headers,
            requestBody: params.requestBody
        }, option);
    }
}
exports.Client = Client;
class BlobWithFilename extends Blob {
    filename;
    constructor(blobPart, filename) {
        super(blobPart);
        this.filename = filename;
    }
}
exports.BlobWithFilename = BlobWithFilename;