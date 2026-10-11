import { createResourceRouter } from './resource-router.js';
import Team from '../models/team.js';

export default createResourceRouter(Team, {
  populate: 'members',
  writableFields: ['name', 'description', 'members'],
});
