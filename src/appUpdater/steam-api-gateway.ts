import {AppUpdateRequest} from '../schema/app-update-request';
import fetch from 'node-fetch';
import {rootLogger} from '../logging';
import {firstKeyOf} from '../utils';

export interface SteamApiConfig {
    listAllApps: string;
    getAppInfo: string;
}

export interface ListAppsResponse {
    applist: {
        apps: AppsList
    };
}

export type AppsList = Array<{ appid: number, name: string }>;

export interface AppDetailsResponse {
    [appId: number]: { success: boolean, data: { type: string, name: string } };
}

export interface AppDetails {
    type: string,
    name: string
}

export class SteamApiGateway {
    constructor(private config: SteamApiConfig) {

    }

    public async getAppDetails(request: AppUpdateRequest): Promise<AppDetails> {
        const rawResponse = await fetch(this.config.getAppInfo.replace('%APPID%', request.appId.toString()));
        const jsonResponse = await rawResponse.json();

        return await this.sanitizeAppDetailsResponse(jsonResponse);
    }

    public async getAllApps(): Promise<AppsList> {
        const rawResponse = await fetch(this.config.listAllApps);
        const jsonResponse = await rawResponse.json() as ListAppsResponse;
        return await this.sanitizeListAppsResponse(jsonResponse);
    }

    private sanitizeListAppsResponse(rawResponse: ListAppsResponse): AppsList {
        return rawResponse.applist.apps;
    }

    private sanitizeAppDetailsResponse(rawResponse: AppDetailsResponse): AppDetails {

        const firstKey: any = firstKeyOf(rawResponse);
        if (!firstKey) {
            throw new Error(`Invalid response getting details of app #${firstKey}: ${JSON.stringify(rawResponse)}`);
        }

        if (!rawResponse[firstKey].success) {
            throw new Error(`Attempt to retrieve data for app #${firstKey} failed - response: ${JSON.stringify(rawResponse[firstKey])}`)
        }

        return rawResponse[firstKey].data;
    }
}