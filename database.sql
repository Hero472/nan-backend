CREATE TYPE LevelEnum AS ENUM ('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'); 
CREATE TYPE DayEnum AS ENUM ('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'); 
CREATE TYPE BlockEnum AS ENUM ('A', 'B', 'C', 'D', 'E');
CREATE TYPE StatusEnum AS ENUM ()

-- Parent table
CREATE TABLE parent (
    id_parent SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE CHECK (email ~* '^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$'),
    password BYTEA NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    access_token_expires_at TIMESTAMPTZ,
    refresh_token_expires_at TIMESTAMPTZ
);

-- Student table
CREATE TABLE student (
    id_student SERIAL PRIMARY KEY,
    id_parent INT REFERENCES Parent(id_parent),
    name TEXT NOT NULL,
    level LevelEnum,
    email TEXT NOT NULL UNIQUE CHECK (email ~* '^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$'),
    password BYTEA NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    access_token_expires_at TIMESTAMPTZ,
    refresh_token_expires_at TIMESTAMPTZ
);

-- Professor table
CREATE TABLE professor (
    id_professor SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE CHECK (email ~* '^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$'),
    password BYTEA NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    access_token_expires_at TIMESTAMPTZ,
    refresh_token_expires_at TIMESTAMPTZ
);

-- Subject table
CREATE TABLE subject (
    id_subject SERIAL PRIMARY KEY,
    id_professor INT REFERENCES Professor(id_professor),
    name TEXT NOT NULL,
    level LevelEnum,
    day DayEnum,
    block BlockEnum
);

-- Table to store grades
CREATE TABLE grade (
    id_grade SERIAL PRIMARY KEY,
    id_student INT REFERENCES Student(id_student),
    id_subject INT REFERENCES Subject(id_subject),
    grade FLOAT CHECK (grade >= 1 AND grade <= 7)
);

-- Table to store medical information
CREATE TABLE medical_info (
    id_medical_info SERIAL PRIMARY KEY,
    id_student INT REFERENCES Student(id_student),
    medical_condition TEXT,
    medications TEXT,
    allergies TEXT
);

-- Table to track attendance
CREATE TABLE attendance (
    id_attendance SERIAL PRIMARY KEY,
    id_student INT REFERENCES Student(id_student),
    id_subject INT REFERENCES Subject(id_subject),
    date DATE NOT NULL,
    status BOOLEAN NOT NULL
);

-- Table to the classes of the week
CREATE TABLE schedule (
    id_schedule SERIAL PRIMARY KEY,
    level LevelEnum NOT NULL,
    id_subject INT REFERENCES Subject(id_subject),
    day DayEnum NOT NULL,
    block BlockEnum NOT NULL,
    UNIQUE (level, day, block) -- Ensures no overlapping schedules for the same level
);