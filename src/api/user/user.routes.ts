import { Router } from 'express';
import * as validationChains from './user.validation.js';
import { createUser } from './user.controller.js';
import validate from '../../middleware/validate.js';

const router = Router();

router.route('/').post(validate(validationChains.create), createUser);

export { router };
