import { Router } from 'express';
import * as validationChains from './imitatee.validation.js';
import {
    createImitatee,
    deleteImitatee,
    getImitatee,
    indexImitatees,
    updateImitatee,
    indexFliesByImitatee,
} from './imitatee.controller.js';
import validate from '../../middleware/validate.js';
import authenticate from '../../middleware/authenticate.js';

const router: Router = Router();

router.route('/').get(indexImitatees);
router.route('/').post(authenticate, validate(validationChains.create), createImitatee);
router.route('/:id').get(validate(validationChains.get), getImitatee);
router.route('/:id').put(authenticate, validate(validationChains.update), updateImitatee);
router.route('/:id').delete(authenticate, validate(validationChains.remove), deleteImitatee);
router.route('/:id/flies').get(validate(validationChains.indexFlies), indexFliesByImitatee);

export { router };
