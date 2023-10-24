import { Router } from 'express';
import * as validationChains from './flyType.validation.js';
import {
    createFlyType,
    deleteFlyType,
    getFlyType,
    indexFlyTypes,
    updateFlyType,
    indexFliesByType,
} from './flyType.controller.js';
import validate from '../../middleware/validate.js';

const router: Router = Router();

router.route('/').get(validate(validationChains.index), indexFlyTypes);
router.route('/').post(validate(validationChains.create), createFlyType);
router.route('/:id').get(validate(validationChains.get), getFlyType);
router.route('/:id').put(validate(validationChains.update), updateFlyType);
router.route('/:id').delete(validate(validationChains.remove), deleteFlyType);
router.route('/:id/flies').get(validate(validationChains.indexFlies), indexFliesByType);

export { router };
