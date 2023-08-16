import { Factory, Faker } from '@mikro-orm/seeder';
import { Fly } from '../../api/fly/fly.entity.js';

export class FlyFactory extends Factory<Fly> {
    public model = Fly;

    definition(faker: Faker): Partial<Fly> {
        return {
            name: `${faker.lorem.word()} ${faker.lorem.word()}`,
            description: faker.lorem.sentences(),
        };
    }
}
