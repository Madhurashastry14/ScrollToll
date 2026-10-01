CREATE DATABASE IF NOT EXISTS scrolltoll;

USE scrolltoll;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE focus_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    duration_seconds INT NOT NULL,
    goal VARCHAR(255) NULL,
    outcome ENUM(
        'completed',
        'partial',
        'not_completed'
    ) NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_focus_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_focus_user (user_id)
);

CREATE TABLE focus_game_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    game_type ENUM(
        'target_focus',
        'odd_one_out',
        'color_challenge',
        'sequence_recall',
        'distraction_challenge'
    ) NOT NULL,

    rounds_played INT NOT NULL DEFAULT 0,

    rounds_completed INT NOT NULL DEFAULT 0,

    score INT NOT NULL DEFAULT 0,

    tokens_earned INT NOT NULL DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_focus_game_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_focus_game_user (user_id),
    INDEX idx_focus_game_type (game_type)
);

CREATE TABLE brain_gym_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,

    domain ENUM(
        'logic',
        'patterns',
        'quick_math',
        'memory',
        'attention'
    ) NOT NULL,

    question TEXT NOT NULL,

    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,

    correct_answer ENUM(
        'A',
        'B',
        'C',
        'D'
    ) NOT NULL,

    difficulty ENUM(
        'easy',
        'medium',
        'hard'
    ) NOT NULL DEFAULT 'easy',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_brain_gym_domain (domain),
    INDEX idx_brain_gym_difficulty (difficulty)
);

CREATE TABLE brain_gym_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    domain ENUM(
        'logic',
        'patterns',
        'quick_math',
        'memory',
        'attention'
    ) NOT NULL,

    question_ids JSON NOT NULL,

    completed BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_brain_gym_attempt_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_brain_gym_attempt_user (user_id)
);

CREATE TABLE brain_gym_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    questions_answered INT NOT NULL DEFAULT 0,
    correct_answers INT NOT NULL DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_brain_gym_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_brain_gym_user (user_id)
);

CREATE TABLE scroll_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    duration_seconds INT NOT NULL DEFAULT 0,

    intentionality ENUM(
        'intentional',
        'habitual',
        'unknown'
    ) DEFAULT 'unknown',

    reason VARCHAR(100) NULL,

    CONSTRAINT fk_scroll_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_scroll_user (user_id)
);

CREATE TABLE unlock_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,

    method ENUM(
    'scroll_tokens'
    ) NOT NULL,

    toll_level INT NOT NULL DEFAULT 1,
    scroll_minutes INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_unlock_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_unlock_user (user_id)
);

CREATE TABLE reflections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reflection_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_reflection_user (user_id)
);

CREATE TABLE user_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    balance INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_tokens_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);