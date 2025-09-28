import { z } from 'zod';

// Workout Session validation
export const workoutSessionSchema = z.object({
  no_workout: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().or(z.literal('')),
  name: z.string().min(1).max(100),
  week: z.string().min(1).max(20),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  match_done: z.string().optional(),
  s1_ico: z.string().optional(),
  s1_sport_name: z.string().optional(),
  s1_distance: z.string().optional(),
  s1_duration: z.string().optional(),
  s1_k: z.string().optional(),
  s2_ico: z.string().optional(),
  s2_sport_name: z.string().optional(),
  s2_distance: z.string().optional(),
  s2_duration: z.string().optional(),
  s2_k: z.string().optional(),
  s3_ico: z.string().optional(),
  s3_sport_name: z.string().optional(),
  s3_distance: z.string().optional(),
  s3_duration: z.string().optional(),
  s3_k: z.string().optional(),
  s4_ico: z.string().optional(),
  s4_sport_name: z.string().optional(),
  s4_distance: z.string().optional(),
  s4_duration: z.string().optional(),
  s4_k: z.string().optional(),
});

export const workoutSessionUpdateSchema = workoutSessionSchema.partial();

// Workout validation
export const workoutSchema = z.object({
  parent_id: z.string().uuid(),
  match_done: z.string().optional(),
  s1_ico: z.string().optional(),
  s1_sport_name: z.string().optional(),
  s1_distance: z.string().optional(),
  s1_duration: z.string().optional(),
  s1_k: z.string().optional(),
  s2_ico: z.string().optional(),
  s2_sport_name: z.string().optional(),
  s2_distance: z.string().optional(),
  s2_duration: z.string().optional(),
  s2_k: z.string().optional(),
  s3_ico: z.string().optional(),
  s3_sport_name: z.string().optional(),
  s3_distance: z.string().optional(),
  s3_duration: z.string().optional(),
  s3_k: z.string().optional(),
  s4_ico: z.string().optional(),
  s4_sport_name: z.string().optional(),
  s4_distance: z.string().optional(),
  s4_duration: z.string().optional(),
  s4_k: z.string().optional(),
});

export const workoutUpdateSchema = workoutSchema.partial().omit({ parent_id: true });

// MoveFrame validation
export const moveFrameSchema = z.object({
  parent_id: z.string().uuid(),
  mf: z.string().min(1).max(10),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().or(z.literal('')),
  section: z.string().min(1).max(50),
  sport: z.string().min(1).max(50),
  description: z.string().optional(),
  rip: z.string().optional(),
  macro: z.string().optional(),
  alarm: z.string().optional(),
});

export const moveFrameUpdateSchema = moveFrameSchema.partial().omit({ parent_id: true });

// MoveLap validation
export const moveLapSchema = z.object({
  child_id: z.string().uuid(),
  mf: z.string().min(1).max(10),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().or(z.literal('')),
  code_section: z.string().min(1).max(50),
  action: z.string().min(1).max(50),
  dist: z.number().int().min(0),
  style: z.string().optional(),
  speed: z.string().optional(),
  time: z.string().optional(),
  pace: z.string().optional(),
  rec: z.string().optional(),
  rest_to: z.string().optional(),
  aim_snd: z.string().optional(),
  annotation: z.string().optional(),
});

export const moveLapUpdateSchema = moveLapSchema.partial().omit({ child_id: true });

// Workout Info validation
export const workoutInfoSchema = z.object({
  workout_id: z.string().uuid(),
  week_number: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  day_of_week: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  workout_number: z.number().int().min(1),
  name_assigned: z.string().min(1).max(100),
  code_assigned: z.string().min(1).max(10),
  sport_id: z.number().int().min(1),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  weather: z.enum(['Sunny', 'Cloudy', 'Rainy']).optional(),
  location: z.string().optional(),
  surface: z.string().optional(),
  heart_rate: z.number().int().min(0).optional(),
  average_hr: z.number().int().min(0).optional(),
  calories: z.number().int().min(0).optional(),
  feeling_status: z.string().optional(),
  note: z.string().optional(),
});

export const workoutInfoUpdateSchema = workoutInfoSchema.partial().omit({ workout_id: true });

// Day Info validation
export const dayInfoSchema = z.object({
  session_id: z.string().uuid(),
  week_number: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  day_of_week: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  name_of_period: z.string().min(1).max(100),
  weather: z.enum(['Sunny', 'Cloudy', 'Rainy']).optional(),
  feeling_status: z.string().optional(),
  note: z.string().optional(),
});

export const dayInfoUpdateSchema = dayInfoSchema.partial().omit({ session_id: true });

// Sport validation
export const sportSchema = z.object({
  name: z.string().min(1).max(50),
  icon: z.string().optional(),
});

export const sportUpdateSchema = sportSchema.partial();

// ID parameter validation
export const idParamSchema = z.object({
  id: z.string().uuid(),
});

export const parentIdParamSchema = z.object({
  parentId: z.string().uuid(),
});

export const childIdParamSchema = z.object({
  childId: z.string().uuid(),
});

export const workoutIdParamSchema = z.object({
  workoutId: z.string().uuid(),
});

export const sessionIdParamSchema = z.object({
  sessionId: z.string().uuid(),
});

