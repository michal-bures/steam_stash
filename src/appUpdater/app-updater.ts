import {InMemoryAppRepository} from '../appRepository/in-memory-app-repository';
import {AppUpdateRequest} from '../schema/app-update-request';
import {SteamApiGateway} from './steam-api-gateway';
import {wakeAfter} from '../utils';
import {Category} from 'typescript-logging';
import {rootLogger} from '../logging';
import {AppDocument} from '../schema/app-document';

const log = new Category('UpdateRequester', rootLogger);

export interface UpdateRequester {
    name: string;
    generateRequest: Promise<AppUpdateRequest | null>;
}

export class AppUpdater {

    private updatesQueue: Array<AppUpdateRequest> = [];
    private queueEmptyCallback = () => {};
    private cooldownActive = false;

    constructor(private repository: InMemoryAppRepository,
                private apiGateway: SteamApiGateway,
                private cooldownPeriodInMs: number) {
    }

    public requestUpdate(request: AppUpdateRequest) {
        this.updatesQueue.push(request);
        this.requestNext();
    }

    private async requestNext() {
        if (!this.updatesQueue.length) {
            log.debug('no app update request remaining');
            this.queueEmptyCallback();
            return;
        } else if (this.cooldownActive) {
            log.debug('next request will be processed later - updater still on cooldown');
            return;
        }

        this.cooldownActive = true;

        const request: AppUpdateRequest = this.updatesQueue.shift() as AppUpdateRequest;

        await this.processRequest(request);

        await wakeAfter(this.cooldownPeriodInMs);

        this.cooldownActive = false;
        this.requestNext();
    }

    private async processRequest(request: AppUpdateRequest) {
        try {
            log.debug(`processing update request for app ${request.appId}^`);
            const response = await this.apiGateway.getAppDetails(request);

            log.debug(`Response received for app ${request.appId}: ${JSON.stringify(response)}`);
            await this.repository.updateApp(response);
        } catch (err) {
            log.warn(`Failed to udpate details for app #${request.appId}: ${err.toString()}`)
        }


    }

    public onQueueEmpty(callback: () => void): void {
        this.queueEmptyCallback = callback;
    }
}