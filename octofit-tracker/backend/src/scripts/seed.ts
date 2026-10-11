import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import Activity from '../models/activity.js';
import Leaderboard from '../models/leaderboard.js';
import Team from '../models/team.js';
import User from '../models/user.js';
import Workout from '../models/workout.js';

type ActivityType =
  | 'running'
  | 'walking'
  | 'cycling'
  | 'swimming'
  | 'strength'
  | 'other';

type ActivitySeed = {
  user: mongoose.Types.ObjectId;
  type: ActivityType;
  durationMinutes: number;
  points: number;
  date: Date;
};

type WorkoutSeed = {
  title: string;
  description: string;
  activityType: ActivityType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
};

/**
 * Seed the octofit_db database with test data.
 * This seed is repeatable and does not delete existing records.
 */
async function seedDatabase(): Promise<void> {
  try {
    await connectDatabase();

    const userRecords = [
      { name: 'Alex Morgan', email: 'alex.morgan@example.com' },
      { name: 'Jordan Lee', email: 'jordan.lee@example.com' },
      { name: 'Sam Rivera', email: 'sam.rivera@example.com' },
    ];

    const users = await Promise.all(
      userRecords.map(async ({ email, name }) => {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          existingUser.name = name;
          return existingUser.save();
        }
        return User.create({ name, email });
      }),
    );
    const userByEmail = new Map(users.map((user) => [user.email, user]));
    const userId = (email: string) => {
      const user = userByEmail.get(email);
      if (!user) throw new Error(`Seed user not found: ${email}`);
      return user._id;
    };

    const teams = [
      {
        name: 'Trail Blazers',
        description: 'Outdoor miles and weekend trail runs.',
        members: [userId('alex.morgan@example.com'), userId('sam.rivera@example.com')],
      },
      {
        name: 'Momentum Makers',
        description: 'Building consistent movement habits together.',
        members: [userId('jordan.lee@example.com')],
      },
    ];
    await Promise.all(
      teams.map(async ({ name, description, members }) => {
        const existingTeam = await Team.findOne({ name });
        if (existingTeam) {
          existingTeam.description = description;
          existingTeam.members = members;
          return existingTeam.save();
        }
        return Team.create({ name, description, members });
      }),
    );

    const activityRecords: ActivitySeed[] = [
      {
        user: userId('alex.morgan@example.com'),
        type: 'running',
        durationMinutes: 35,
        points: 70,
        date: new Date('2026-10-09T07:30:00.000Z'),
      },
      {
        user: userId('alex.morgan@example.com'),
        type: 'cycling',
        durationMinutes: 45,
        points: 90,
        date: new Date('2026-10-10T08:00:00.000Z'),
      },
      {
        user: userId('jordan.lee@example.com'),
        type: 'strength',
        durationMinutes: 40,
        points: 80,
        date: new Date('2026-10-09T17:00:00.000Z'),
      },
      {
        user: userId('jordan.lee@example.com'),
        type: 'walking',
        durationMinutes: 30,
        points: 45,
        date: new Date('2026-10-10T12:00:00.000Z'),
      },
      {
        user: userId('sam.rivera@example.com'),
        type: 'running',
        durationMinutes: 25,
        points: 50,
        date: new Date('2026-10-10T06:45:00.000Z'),
      },
    ];
    await Promise.all(
      activityRecords.map(async ({ user, type, date, ...activity }) => {
        const existingActivity = await Activity.findOne({ user, type, date });
        if (existingActivity) {
          existingActivity.durationMinutes = activity.durationMinutes;
          existingActivity.points = activity.points;
          return existingActivity.save();
        }
        return Activity.create({ ...activity, user, type, date });
      }),
    );

    const leaderboardRecords = await Activity.aggregate<{
      _id: mongoose.Types.ObjectId;
      points: number;
      activityCount: number;
    }>([
      { $match: { user: { $in: users.map((user) => user._id) } } },
      {
        $group: {
          _id: '$user',
          points: { $sum: '$points' },
          activityCount: { $sum: 1 },
        },
      },
    ]);
    await Promise.all(
      leaderboardRecords.map(async ({ _id, points, activityCount }) => {
        const existingEntry = await Leaderboard.findOne({ user: _id });
        if (existingEntry) {
          existingEntry.points = points;
          existingEntry.activityCount = activityCount;
          return existingEntry.save();
        }
        return Leaderboard.create({ user: _id, points, activityCount });
      }),
    );

    const workoutRecords: WorkoutSeed[] = [
      {
        title: 'Easy Endurance Run',
        description: 'A conversational-pace run to build aerobic endurance.',
        activityType: 'running',
        difficulty: 'beginner',
      },
      {
        title: 'Full-Body Strength',
        description: 'A balanced bodyweight circuit for major muscle groups.',
        activityType: 'strength',
        difficulty: 'beginner',
      },
      {
        title: 'Steady Ride',
        description: 'A moderate cycling session with a smooth, steady effort.',
        activityType: 'cycling',
        difficulty: 'intermediate',
      },
      {
        title: 'Recovery Walk',
        description: 'A relaxed walk focused on gentle movement and recovery.',
        activityType: 'walking',
        difficulty: 'beginner',
      },
    ];
    await Promise.all(
      workoutRecords.map(async ({ title, ...workout }) => {
        const existingWorkout = await Workout.findOne({ title });
        if (existingWorkout) {
          existingWorkout.description = workout.description;
          existingWorkout.activityType = workout.activityType;
          existingWorkout.difficulty = workout.difficulty;
          return existingWorkout.save();
        }
        return Workout.create({ ...workout, title });
      }),
    );

    console.log('Database seeding complete');
    console.log(
      `Seeded ${users.length} users, ${teams.length} teams, ${activityRecords.length} activities, ${leaderboardRecords.length} leaderboard entries, and ${workoutRecords.length} workouts.`,
    );
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

void seedDatabase();
