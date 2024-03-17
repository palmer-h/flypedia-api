import 'dotenv/config.js';
import express from 'express';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { Request, Response, NextFunction } from 'express';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import limiter from './core/rateLimiter.js';
import router from './api/index.js';
import mikroOrmOptions from '../mikro-orm.config.js';
import corsOptions from './core/corsOptions.js';

const app = express();
const db = await MikroORM.init<PostgreSqlDriver>(mikroOrmOptions);

app.use(cors());
app.options('*', cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(limiter);
app.set('query parser', 'simple');
app.use((_req: Request, _res: Response, next: NextFunction) => {
    return RequestContext.create(db.em, next);
});
app.use(router);

export default app;
