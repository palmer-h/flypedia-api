import { Factory, Faker } from '@mikro-orm/seeder';
import { Imitatee } from '../../api/imitatee/imitatee.entity.js';

export class ImitateeFactory extends Factory<Imitatee> {
    public model = Imitatee;

    definition(faker: Faker): Partial<Imitatee> {
        return {
            name: faker.lorem.word(),
            description: faker.lorem.sentences(),
        };
    }
}
