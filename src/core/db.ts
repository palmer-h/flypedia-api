import 'dotenv/config.js';
import { EntityManager, EntityRepository, MikroORM, Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Fly } from '../api/fly/fly.entity.js';
import { FlyType } from '../api/flyType/flyType.entity.js';
import { Imitatee } from '../api/imitatee/imitatee.entity.js';

export interface Services {
    orm: MikroORM;
    em: EntityManager;
    fly: EntityRepository<Fly>;
    flyType: EntityRepository<FlyType>;
    imitatee: EntityRepository<Imitatee>;
}

let cache: Services;

export async function initORM(options?: Options): Promise<Services> {
    if (cache) {
        return cache;
    }

    const orm = await MikroORM.init<PostgreSqlDriver>(options);

    return (cache = {
        orm,
        em: orm.em,
        fly: orm.em.getRepository(Fly),
        flyType: orm.em.getRepository(FlyType),
        imitatee: orm.em.getRepository(Imitatee),
    });
}
