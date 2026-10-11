import { createResourceRouter } from './resource-router.js';
import User from '../models/user.js';

export default createResourceRouter(User, {
  writableFields: ['name', 'email'],
});
