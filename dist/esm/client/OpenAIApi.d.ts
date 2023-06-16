import { Client } from "../generated/apiClient.js";
import { AbstractThrottleManagerService } from "./AbstractThrottleManagerService.js";
export interface OpenAIApiParams {
    apiKey?: string;
    organization?: string;
    baseUrl?: string;
    commonOptions?: RequestInit;
    onResponse?: (response: Response) => void;
    throttleManagerService: AbstractThrottleManagerService;
}
export interface RequestInitWithCallbacks extends RequestInit {
    onOpen?: () => void;
    onMessage?: (json: any) => void;
    onClose?: () => void;
}
export declare const OpenAIApi: ({ apiKey, baseUrl, commonOptions, onResponse, organization, throttleManagerService, }: OpenAIApiParams) => Client<RequestInitWithCallbacks>;
