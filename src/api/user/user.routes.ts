import { Router } from 'express';
import * as validationChains from './user.validation.js';
import { createUser } from './user.controller.js';
import validate from '../../middleware/validate.js';
import authenticate from '../../middleware/authenticate.js';

const router = Router();

router.route('/').post(authenticate, validate(validationChains.create), createUser);

export { router };
