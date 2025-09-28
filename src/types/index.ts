// Frontend data types mapped to backend interfaces

export interface WorkoutSession {
  id: string;
  no_workout: string;
  color: string;
  name: string;
  week: string;
  date: string;
  match_done: string;
  s1_ico: string;
  s1_sport_name: string;
  s1_distance: string;
  s1_duration: string;
  s1_k: string;
  s2_ico: string;
  s2_sport_name: string;
  s2_distance: string;
  s2_duration: string;
  s2_k: string;
  s3_ico: string;
  s3_sport_name: string;
  s3_distance: string;
  s3_duration: string;
  s3_k: string;
  s4_ico: string;
  s4_sport_name: string;
  s4_distance: string;
  s4_duration: string;
  s4_k: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Workout {
  id: string;
  parent_id: string;
  match_done: string;
  s1_ico: string;
  s1_sport_name: string;
  s1_distance: string;
  s1_duration: string;
  s1_k: string;
  s2_ico: string;
  s2_sport_name: string;
  s2_distance: string;
  s2_duration: string;
  s2_k: string;
  s3_ico: string;
  s3_sport_name: string;
  s3_distance: string;
  s3_duration: string;
  s3_k: string;
  s4_ico: string;
  s4_sport_name: string;
  s4_distance: string;
  s4_duration: string;
  s4_k: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface MoveFrame {
  id: string;
  parent_id: string;
  mf: string;
  color: string;
  section: string;
  sport: string;
  description: string;
  rip: string;
  macro: string;
  alarm: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface MoveLap {
  id: string;
  child_id: string;
  mf: string;
  color: string;
  code_section: string;
  action: string;
  dist: number;
  style: string;
  speed: string;
  time: string;
  pace: string;
  rec: string;
  rest_to: string;
  aim_snd: string;
  annotation: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface WorkoutInfo {
  id: string;
  workout_id: string;
  week_number: string;
  day_of_week: string;
  workout_number: number;
  name_assigned: string;
  code_assigned: string;
  sport_id: number;
  time: string;
  weather: string;
  location: string;
  surface: string;
  heart_rate: number;
  average_hr: number;
  calories: number;
  feeling_status: string;
  note: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface DayInfo {
  id: string;
  session_id: string;
  week_number: string;
  day_of_week: string;
  name_of_period: string;
  weather: string;
  feeling_status: string;
  note: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Sport {
  id: number;
  name: string;
  icon: string;
  created_at?: Date;
  updated_at?: Date;
}

// Database row types (what comes from MySQL)
export interface DbWorkoutSession extends Omit<WorkoutSession, 'date'> {
  date: Date;
}

export interface DbWorkoutInfo extends Omit<WorkoutInfo, 'week_number'> {
  week_number: Date;
}

export interface DbDayInfo extends Omit<DayInfo, 'week_number'> {
  week_number: Date;
}

