import { Router } from 'express';
import * as validationChains from './auth.validation.js';
import { authenticate, refreshAccessToken } from './auth.controller.js';
import validate from '../../middleware/validate.js';

const router = Router();

router.route('/authenticate').post(validate(validationChains.authenticate), authenticate);
router.route('/refresh').put(validate(validationChains.refreshAccessToken), refreshAccessToken);

export { router };
