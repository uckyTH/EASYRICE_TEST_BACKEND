//Standard.router.ts
import express from 'express';
import { fetchStandard, fetchStandardById } from '../controller/Standard';
const router = express.Router()

router.get('/', fetchStandard)

router.get('/:id',fetchStandardById)


export default router;
