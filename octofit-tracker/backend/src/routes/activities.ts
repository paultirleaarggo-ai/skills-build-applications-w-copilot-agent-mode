import { createResourceRouter } from './resource-router.js';
import Activity from '../models/activity.js';

export default createResourceRouter(Activity, {
  populate: 'user',
  writableFields: ['user', 'type', 'durationMinutes', 'points', 'date'],
});
