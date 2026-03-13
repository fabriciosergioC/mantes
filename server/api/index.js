import { Router } from 'express';
import * as auth from './auth.js';

const router = Router();

export const handler = async (req, res) => {
  await router(req, res);
};

export default router;
