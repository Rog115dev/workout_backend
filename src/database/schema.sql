-- Create database if not exists
CREATE DATABASE IF NOT EXISTS movebook;
USE movebook;

-- Sports table for reference data
CREATE TABLE IF NOT EXISTS sports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default sports
INSERT INTO sports (name, icon) VALUES
('Swim', '/img/icons/sports/swimming.jpg'),
('Run', '/img/icons/sports/running.jpg'),
('Bike', '/img/icons/sports/cycling.jpg'),
('Pilates', '/img/icons/sports/pilates.jpg'),
('Ski', '/img/icons/sports/ski-slalom.jpg'),
('Weights', '/img/icons/sports/weights.jpg'),
('Rower', '/img/icons/sports/rowing.jpg'),
('Skate', '/img/icons/sports/skating.jpg'),
('Gymnastic', '/img/icons/sports/gymnastic.jpg'),
('Stretching', '/img/icons/sports/stretching.jpg'),
('Technical', '/img/icons/sports/technital.jpg');

-- Parent table (Workout Sessions)
CREATE TABLE IF NOT EXISTS workout_sessions (
  id VARCHAR(36) PRIMARY KEY,
  no_workout VARCHAR(50),
  color VARCHAR(7),
  name VARCHAR(100),
  week VARCHAR(20),
  date DATE,
  match_done VARCHAR(50),
  s1_ico VARCHAR(255),
  s1_sport_name VARCHAR(50),
  s1_distance VARCHAR(20),
  s1_duration VARCHAR(20),
  s1_k VARCHAR(20),
  s2_ico VARCHAR(255),
  s2_sport_name VARCHAR(50),
  s2_distance VARCHAR(20),
  s2_duration VARCHAR(20),
  s2_k VARCHAR(20),
  s3_ico VARCHAR(255),
  s3_sport_name VARCHAR(50),
  s3_distance VARCHAR(20),
  s3_duration VARCHAR(20),
  s3_k VARCHAR(20),
  s4_ico VARCHAR(255),
  s4_sport_name VARCHAR(50),
  s4_distance VARCHAR(20),
  s4_duration VARCHAR(20),
  s4_k VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sub-parent table (Individual Workouts)
CREATE TABLE IF NOT EXISTS workouts (
  id VARCHAR(36) PRIMARY KEY,
  parent_id VARCHAR(36),
  match_done VARCHAR(50),
  s1_ico VARCHAR(255),
  s1_sport_name VARCHAR(50),
  s1_distance VARCHAR(20),
  s1_duration VARCHAR(20),
  s1_k VARCHAR(20),
  s2_ico VARCHAR(255),
  s2_sport_name VARCHAR(50),
  s2_distance VARCHAR(20),
  s2_duration VARCHAR(20),
  s2_k VARCHAR(20),
  s3_ico VARCHAR(255),
  s3_sport_name VARCHAR(50),
  s3_distance VARCHAR(20),
  s3_duration VARCHAR(20),
  s3_k VARCHAR(20),
  s4_ico VARCHAR(255),
  s4_sport_name VARCHAR(50),
  s4_distance VARCHAR(20),
  s4_duration VARCHAR(20),
  s4_k VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES workout_sessions(id) ON DELETE CASCADE
);

-- Child table (MoveFrames)
CREATE TABLE IF NOT EXISTS moveframes (
  id VARCHAR(36) PRIMARY KEY,
  parent_id VARCHAR(36),
  mf VARCHAR(10),
  color VARCHAR(7),
  section VARCHAR(50),
  sport VARCHAR(50),
  description TEXT,
  rip VARCHAR(20),
  macro VARCHAR(20),
  alarm VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES workouts(id) ON DELETE CASCADE
);

-- Sub-child table (MoveLaps)
CREATE TABLE IF NOT EXISTS movelaps (
  id VARCHAR(36) PRIMARY KEY,
  child_id VARCHAR(36),
  mf VARCHAR(10),
  color VARCHAR(7),
  code_section VARCHAR(50),
  action VARCHAR(50),
  dist INT,
  style VARCHAR(50),
  speed VARCHAR(20),
  time VARCHAR(20),
  pace VARCHAR(20),
  rec VARCHAR(20),
  rest_to VARCHAR(20),
  aim_snd VARCHAR(20),
  annotation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES moveframes(id) ON DELETE CASCADE
);

-- Workout Info table (additional workout metadata)
CREATE TABLE IF NOT EXISTS workout_info (
  id VARCHAR(36) PRIMARY KEY,
  workout_id VARCHAR(36),
  week_number DATE,
  day_of_week VARCHAR(20),
  workout_number INT,
  name_assigned VARCHAR(100),
  code_assigned VARCHAR(10),
  sport_id INT,
  time TIME,
  weather VARCHAR(50),
  location VARCHAR(100),
  surface VARCHAR(50),
  heart_rate INT,
  average_hr INT,
  calories INT,
  feeling_status VARCHAR(50),
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
  FOREIGN KEY (sport_id) REFERENCES sports(id)
);

-- Day Info table (daily period information)
CREATE TABLE IF NOT EXISTS day_info (
  id VARCHAR(36) PRIMARY KEY,
  session_id VARCHAR(36),
  week_number DATE,
  day_of_week VARCHAR(20),
  name_of_period VARCHAR(100),
  weather VARCHAR(50),
  feeling_status VARCHAR(50),
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_workout_sessions_date ON workout_sessions(date);
CREATE INDEX idx_workout_sessions_week ON workout_sessions(week);
CREATE INDEX idx_workouts_parent_id ON workouts(parent_id);
CREATE INDEX idx_moveframes_parent_id ON moveframes(parent_id);
CREATE INDEX idx_movelaps_child_id ON movelaps(child_id);
CREATE INDEX idx_workout_info_workout_id ON workout_info(workout_id);
CREATE INDEX idx_day_info_session_id ON day_info(session_id);

