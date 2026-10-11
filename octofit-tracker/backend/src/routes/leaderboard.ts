import { createResourceRouter } from './resource-router.js';
import Leaderboard from '../models/leaderboard.js';

export default createResourceRouter(Leaderboard, {
  populate: 'user',
  writableFields: ['user', 'points', 'activityCount'],
});
