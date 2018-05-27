import {AppDocument} from '../schema/app-document';
import {AppId} from '../schema/app-id';

export interface AppRepository {
    updateApp(appData: AppDocument): Promise<void>;

    getMaxAppId(): Promise<AppId>;
}