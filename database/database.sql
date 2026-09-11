-- =====================================================================
-- UNIT III: MySQL Database Connectivity
-- Student Web Portal — Internet Programming Lab
-- Import this file via phpMyAdmin (XAMPP) or the mysql CLI to set up
-- everything the PHP backend needs.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS ip_portal
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ip_portal;

-- ---------------------------------------------------------------------
-- Table: students
-- Stores registration form submissions from the front-end (php/register.php)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS students;
CREATE TABLE students (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    phone       VARCHAR(15)   NOT NULL,
    password    VARCHAR(255)  NOT NULL,       -- stores a bcrypt hash, never plain text
    age         INT           NULL,
    course      VARCHAR(100)  NOT NULL,
    gender      VARCHAR(10)   NOT NULL,
    dob         DATE          NOT NULL,
    interests   VARCHAR(255)  NULL,
    favcolor    VARCHAR(20)   NULL,
    notes       TEXT          NULL,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table: quiz_results
-- Stores every quiz attempt submitted from the front-end (php/quiz.php)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS quiz_results;
CREATE TABLE quiz_results (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    student_name     VARCHAR(100) NOT NULL,
    score            INT          NOT NULL,
    total_questions  INT          NOT NULL,
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Seed data so the AJAX search / API / interactive table have something
-- to show immediately after import, without needing to register first.
-- ---------------------------------------------------------------------
INSERT INTO students (name, email, phone, password, age, course, gender, dob, interests, favcolor, notes, created_at) VALUES
('Aditi Sharma', 'aditi@example.com', '9876543210', '$2y$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWX1', 20, 'Internet Programming', 'Female', '2006-04-12', 'Web Dev, AI', '#1b2a4a', 'Excited to learn AJAX!', '2026-07-01 10:15:00'),
('Rohan Verma', 'rohan@example.com', '9876501234', '$2y$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWX2', 21, 'Data Structures', 'Male', '2005-11-02', 'Cloud', '#2f6f62', '', '2026-07-03 09:30:00'),
('Sneha Iyer', 'sneha@example.com', '9876512345', '$2y$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWX3', 19, 'Database Systems', 'Female', '2007-01-22', 'AI', '#e8a33d', 'Interested in SQL optimisation', '2026-07-05 14:00:00'),
('Karan Mehta', 'karan@example.com', '9123456780', '$2y$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWX4', 22, 'Computer Networks', 'Male', '2004-06-18', 'Web Dev', '#b3261e', '', '2026-07-06 16:45:00'),
('Priya Nair', 'priya@example.com', '9988776655', '$2y$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWX5', 20, 'Internet Programming', 'Female', '2006-09-09', 'Web Dev, Cloud', '#1b2a4a', 'Aspiring full-stack developer', '2026-07-07 11:20:00');

INSERT INTO quiz_results (student_name, score, total_questions, created_at) VALUES
('Aditi Sharma', 8, 10, '2026-07-01 10:40:00'),
('Rohan Verma', 6, 10, '2026-07-03 09:50:00'),
('Sneha Iyer', 9, 10, '2026-07-05 14:20:00');

-- ---------------------------------------------------------------------
-- Helpful indexes (UNIT III concept: query optimisation)
-- ---------------------------------------------------------------------
CREATE INDEX idx_students_course ON students(course);
CREATE INDEX idx_quiz_student_name ON quiz_results(student_name);

-- ---------------------------------------------------------------------
-- Table: todos
-- Stores todo list tasks from Activity 10 (php/todo.php)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS todos;
CREATE TABLE todos (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    task        VARCHAR(255) NOT NULL,
    completed   TINYINT(1)   NOT NULL DEFAULT 0,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO todos (task, completed) VALUES
('Learn HTML5 semantics', 1),
('Build a CSS3 playground', 1),
('Write JavaScript validation', 0),
('Create a PHP REST API', 0);
