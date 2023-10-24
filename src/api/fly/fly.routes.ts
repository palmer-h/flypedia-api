import { Router } from 'express';
import * as validationChains from './fly.validation.js';
import { createFly, deleteFly, getFly, indexFlies, updateFly } from './fly.controller.js';
import validate from '../../middleware/validate.js';
import authenticate from '../../middleware/authenticate.js';

const router: Router = Router();

router.route('/').get(validate(validationChains.index), indexFlies);
router.route('/').post(authenticate, validate(validationChains.create), createFly);
router.route('/:id').get(validate(validationChains.get), getFly);
router.route('/:id').put(authenticate, validate(validationChains.update), updateFly);
router.route('/:id').delete(authenticate, validate(validationChains.remove), deleteFly);

export { router };
