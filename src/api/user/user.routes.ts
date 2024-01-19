import { Router } from 'express';
import * as validationChains from './user.validation.js';
import { createUser, indexFlies, addFavouriteFly, removeFavouriteFly } from './user.controller.js';
import validate from '../../middleware/validate.js';
import authenticate from '../../middleware/authenticate.js';

const router = Router();

router.route('/').post(validate(validationChains.create), createUser);
router.route('/:id/flies').get(authenticate, validate(validationChains.indexFlies), indexFlies);
router.route('/:id/:flies/:flyId').post(authenticate, validate(validationChains.getFly), addFavouriteFly);
router.route('/:id/:flies/:flyId').delete(authenticate, validate(validationChains.deleteFly), removeFavouriteFly);

export { router };
