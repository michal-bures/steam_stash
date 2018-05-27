import {Category, CategoryConfiguration, CategoryServiceFactory, LogLevel} from 'typescript-logging';

CategoryServiceFactory.setDefaultConfiguration(new CategoryConfiguration(LogLevel.Debug));

export const rootLogger = new Category('root logger');