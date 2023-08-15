import { Options } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const config: Options = {
    type: 'postgresql',
    clientUrl: process.env.DATABASE_URL,
    metadataProvider: TsMorphMetadataProvider,
    entities: ['./dist/**/*.entity.js'],
    entitiesTs: ['./src/**/*.entity.ts'],
    debug: true,
    driverOptions: {
        connection: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
    },
};

export default config;
