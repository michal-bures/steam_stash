import {AppDocument} from '../schema/app-document';
import {rootLogger} from '../logging';
import {Category} from 'typescript-logging';
import {AppId} from '../schema/app-id';

const log = new Category('AppRepository', rootLogger);

export class InMemoryAppRepository {
    public async updateApp(appData: AppDocument): Promise<void> {
        log.info(`Storing ${JSON.stringify(appData)}`)
    }

    public async getMaxAppId(): Promise<AppId> {
        return 0;
    }
}