"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionIdParamSchema = exports.workoutIdParamSchema = exports.childIdParamSchema = exports.parentIdParamSchema = exports.idParamSchema = exports.sportUpdateSchema = exports.sportSchema = exports.dayInfoUpdateSchema = exports.dayInfoSchema = exports.workoutInfoUpdateSchema = exports.workoutInfoSchema = exports.moveLapUpdateSchema = exports.moveLapSchema = exports.moveFrameUpdateSchema = exports.moveFrameSchema = exports.workoutUpdateSchema = exports.workoutSchema = exports.workoutSessionUpdateSchema = exports.workoutSessionSchema = void 0;
const zod_1 = require("zod");
// Workout Session validation
exports.workoutSessionSchema = zod_1.z.object({
    no_workout: zod_1.z.string().optional(),
    color: zod_1.z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().or(zod_1.z.literal('')),
    name: zod_1.z.string().min(1).max(100),
    week: zod_1.z.string().min(1).max(20),
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    match_done: zod_1.z.string().optional(),
    s1_ico: zod_1.z.string().optional(),
    s1_sport_name: zod_1.z.string().optional(),
    s1_distance: zod_1.z.string().optional(),
    s1_duration: zod_1.z.string().optional(),
    s1_k: zod_1.z.string().optional(),
    s2_ico: zod_1.z.string().optional(),
    s2_sport_name: zod_1.z.string().optional(),
    s2_distance: zod_1.z.string().optional(),
    s2_duration: zod_1.z.string().optional(),
    s2_k: zod_1.z.string().optional(),
    s3_ico: zod_1.z.string().optional(),
    s3_sport_name: zod_1.z.string().optional(),
    s3_distance: zod_1.z.string().optional(),
    s3_duration: zod_1.z.string().optional(),
    s3_k: zod_1.z.string().optional(),
    s4_ico: zod_1.z.string().optional(),
    s4_sport_name: zod_1.z.string().optional(),
    s4_distance: zod_1.z.string().optional(),
    s4_duration: zod_1.z.string().optional(),
    s4_k: zod_1.z.string().optional(),
});
exports.workoutSessionUpdateSchema = exports.workoutSessionSchema.partial();
// Workout validation
exports.workoutSchema = zod_1.z.object({
    parent_id: zod_1.z.string().uuid(),
    match_done: zod_1.z.string().optional(),
    s1_ico: zod_1.z.string().optional(),
    s1_sport_name: zod_1.z.string().optional(),
    s1_distance: zod_1.z.string().optional(),
    s1_duration: zod_1.z.string().optional(),
    s1_k: zod_1.z.string().optional(),
    s2_ico: zod_1.z.string().optional(),
    s2_sport_name: zod_1.z.string().optional(),
    s2_distance: zod_1.z.string().optional(),
    s2_duration: zod_1.z.string().optional(),
    s2_k: zod_1.z.string().optional(),
    s3_ico: zod_1.z.string().optional(),
    s3_sport_name: zod_1.z.string().optional(),
    s3_distance: zod_1.z.string().optional(),
    s3_duration: zod_1.z.string().optional(),
    s3_k: zod_1.z.string().optional(),
    s4_ico: zod_1.z.string().optional(),
    s4_sport_name: zod_1.z.string().optional(),
    s4_distance: zod_1.z.string().optional(),
    s4_duration: zod_1.z.string().optional(),
    s4_k: zod_1.z.string().optional(),
});
exports.workoutUpdateSchema = exports.workoutSchema.partial().omit({ parent_id: true });
// MoveFrame validation
exports.moveFrameSchema = zod_1.z.object({
    parent_id: zod_1.z.string().uuid(),
    mf: zod_1.z.string().min(1).max(10),
    color: zod_1.z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().or(zod_1.z.literal('')),
    section: zod_1.z.string().min(1).max(50),
    sport: zod_1.z.string().min(1).max(50),
    description: zod_1.z.string().optional(),
    rip: zod_1.z.string().optional(),
    macro: zod_1.z.string().optional(),
    alarm: zod_1.z.string().optional(),
});
exports.moveFrameUpdateSchema = exports.moveFrameSchema.partial().omit({ parent_id: true });
// MoveLap validation
exports.moveLapSchema = zod_1.z.object({
    child_id: zod_1.z.string().uuid(),
    mf: zod_1.z.string().min(1).max(10),
    color: zod_1.z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().or(zod_1.z.literal('')),
    code_section: zod_1.z.string().min(1).max(50),
    action: zod_1.z.string().min(1).max(50),
    dist: zod_1.z.number().int().min(0),
    style: zod_1.z.string().optional(),
    speed: zod_1.z.string().optional(),
    time: zod_1.z.string().optional(),
    pace: zod_1.z.string().optional(),
    rec: zod_1.z.string().optional(),
    rest_to: zod_1.z.string().optional(),
    aim_snd: zod_1.z.string().optional(),
    annotation: zod_1.z.string().optional(),
});
exports.moveLapUpdateSchema = exports.moveLapSchema.partial().omit({ child_id: true });
// Workout Info validation
exports.workoutInfoSchema = zod_1.z.object({
    workout_id: zod_1.z.string().uuid(),
    week_number: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    day_of_week: zod_1.z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
    workout_number: zod_1.z.number().int().min(1),
    name_assigned: zod_1.z.string().min(1).max(100),
    code_assigned: zod_1.z.string().min(1).max(10),
    sport_id: zod_1.z.number().int().min(1),
    time: zod_1.z.string().regex(/^\d{2}:\d{2}$/).optional(),
    weather: zod_1.z.enum(['Sunny', 'Cloudy', 'Rainy']).optional(),
    location: zod_1.z.string().optional(),
    surface: zod_1.z.string().optional(),
    heart_rate: zod_1.z.number().int().min(0).optional(),
    average_hr: zod_1.z.number().int().min(0).optional(),
    calories: zod_1.z.number().int().min(0).optional(),
    feeling_status: zod_1.z.string().optional(),
    note: zod_1.z.string().optional(),
});
exports.workoutInfoUpdateSchema = exports.workoutInfoSchema.partial().omit({ workout_id: true });
// Day Info validation
exports.dayInfoSchema = zod_1.z.object({
    session_id: zod_1.z.string().uuid(),
    week_number: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    day_of_week: zod_1.z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
    name_of_period: zod_1.z.string().min(1).max(100),
    weather: zod_1.z.enum(['Sunny', 'Cloudy', 'Rainy']).optional(),
    feeling_status: zod_1.z.string().optional(),
    note: zod_1.z.string().optional(),
});
exports.dayInfoUpdateSchema = exports.dayInfoSchema.partial().omit({ session_id: true });
// Sport validation
exports.sportSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(50),
    icon: zod_1.z.string().optional(),
});
exports.sportUpdateSchema = exports.sportSchema.partial();
// ID parameter validation
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.parentIdParamSchema = zod_1.z.object({
    parentId: zod_1.z.string().uuid(),
});
exports.childIdParamSchema = zod_1.z.object({
    childId: zod_1.z.string().uuid(),
});
exports.workoutIdParamSchema = zod_1.z.object({
    workoutId: zod_1.z.string().uuid(),
});
exports.sessionIdParamSchema = zod_1.z.object({
    sessionId: zod_1.z.string().uuid(),
});
