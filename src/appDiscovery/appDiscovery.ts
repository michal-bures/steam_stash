import {InMemoryAppRepository} from '../appRepository/in-memory-app-repository';
import {AppUpdateRequest} from '../schema/app-update-request';
import {SteamApiGateway} from '../appUpdater/steam-api-gateway';
import {Category} from 'typescript-logging';
import {rootLogger} from '../logging';
import {AppId} from '../schema/app-id';

const log = new Category('AppDiscovery', rootLogger);

export class AppDiscovery {
    constructor(private appRepository: InMemoryAppRepository, private steamApiGateway: SteamApiGateway) {

    }

    private queue: Array<AppId> = [];

    public async discoverNext(): Promise<AppUpdateRequest | null> {
        if (!this.queue.length) {
            await this.buildDiscoveryQueue();
        }

        const nextAppId = this.queue.shift();
        if (!nextAppId) {
            log.info('no new apps left to discover');
            return null;
        } else {
            return { appId: nextAppId };
        }
    }


    private async buildDiscoveryQueue() {
        log.info('Building app discovery queue...');
        const maxAppId = await this.appRepository.getMaxAppId();
        const allApps = await this.steamApiGateway.getAllApps();

        this.queue = allApps
            .filter((app) => app.appid > maxAppId)
            .map(app => app.appid);
    }
}