import { Factory, Faker } from '@mikro-orm/seeder';
import { FlyType } from '../../api/flyType/flyType.entity.js';

export class FlyTypeFactory extends Factory<FlyType> {
    public model = FlyType;

    definition(faker: Faker): Partial<FlyType> {
        return {
            name: faker.lorem.word(),
            description: faker.lorem.paragraph(),
        };
    }
}
