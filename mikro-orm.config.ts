import { Options } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const config: Options = {
    type: 'postgresql',
    clientUrl: process.env.DATABASE_URL,
    metadataProvider: TsMorphMetadataProvider,
    entities: ['./dist/**/*.entity.js'],
    entitiesTs: ['./src/**/*.entity.ts'],
    debug: true,
};

if (process.env.NODE_ENV === 'production') {
    config.driverOptions = {
        connection: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
    };
}

export default config;
