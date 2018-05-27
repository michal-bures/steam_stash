import {InMemoryAppRepository} from './appRepository/in-memory-app-repository';
import {AppUpdater} from './appUpdater/app-updater';
import {SteamApiGateway} from './appUpdater/steam-api-gateway';
import {config} from '../config';
import {rootLogger} from './logging';
import {AppDiscovery} from './appDiscovery/appDiscovery';

console.log('it works');

main();

function main() {

    rootLogger.info('Starting app');

    const repository = new InMemoryAppRepository();
    const apiGateway = new SteamApiGateway(config.steamApi);
    const updater = new AppUpdater(repository, apiGateway, config.steamApi.cooldownInMs);
    const discovery = new AppDiscovery(repository, apiGateway);

    updater.onQueueEmpty(runDiscovery);

    setupSignalHandlers();

    runDiscovery();

    async function runDiscovery() {
        const nextRequest = await discovery.discoverNext();
        if (nextRequest) {
            updater.requestUpdate(nextRequest);
        }
    }

}

function setupSignalHandlers() {
    process.on('SIGINT', function() {
        rootLogger.info('Interrupted by user, exiting.');
        process.exit();
    });
}