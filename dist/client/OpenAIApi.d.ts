import {Client, ObjectLike} from "../generated/apiClient.js";
import {AbstractThrottleManagerService} from "./AbstractThrottleManagerService.js";

export interface OpenAIApiParams {
    apiKey?: string;
    organization?: string;
    baseUrl?: string;
    additionalHeaders?: ObjectLike;
    onResponse?: (response: Response) => void;
    throttleManagerService: AbstractThrottleManagerService;
}
export interface RequestInitWithCallbacks extends RequestInit {
    onOpen?: () => void;
    onMessage?: (json: any) => void;
    onClose?: () => void;
}
export declare const OpenAIApi: ({ apiKey, baseUrl, additionalHeaders, onResponse, organization, throttleManagerService, }: OpenAIApiParams) => Client<RequestInitWithCallbacks>;
