import { Router } from 'express';
import * as validationChains from './flyType.validation.js';
import { createFlyType, deleteFlyType, getFlyType, indexFlyTypes, updateFlyType } from './flyType.controller.js';
import validate from '../../middleware/validate.js';
import authenticate from '../../middleware/authenticate.js';

const router: Router = Router();

router.route('/').get(indexFlyTypes);
router.route('/').post(authenticate, validate(validationChains.create), createFlyType);
router.route('/:id').get(validate(validationChains.get), getFlyType);
router.route('/:id').put(authenticate, validate(validationChains.update), updateFlyType);
router.route('/:id').delete(authenticate, validate(validationChains.remove), deleteFlyType);

export { router };
