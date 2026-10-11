import { createResourceRouter } from './resource-router.js';
import Workout from '../models/workout.js';

export default createResourceRouter(Workout, {
  writableFields: ['title', 'description', 'activityType', 'difficulty'],
});
