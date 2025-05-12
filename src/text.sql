-- Table: Role
CREATE TABLE Role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Table: User
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    role_id INT REFERENCES Role(id),
    khmer_name VARCHAR(100),
    english_name VARCHAR(100),
    age INT,
    national VARCHAR(100),
    position VARCHAR(100),
    email VARCHAR(100) UNIQUE
);


-- Table: Camp_event
CREATE TABLE Camp_event (
    id SERIAL PRIMARY KEY,
    camp_event_name VARCHAR(100) NOT NULL
);

-- Table: Camp
CREATE TABLE Camp (
    id SERIAL PRIMARY KEY,
    camp_event_id INT REFERENCES Camp_event(id),
    camp_name VARCHAR(100) NOT NULL
);

-- Table: Camp_Character
CREATE TABLE Camp_Character (
    id SERIAL PRIMARY KEY,
    camp_id INT REFERENCES Camp(id),
    user_id INT REFERENCES "users"(id),
    is_active BOOLEAN DEFAULT TRUE
);

-- Table: Children
CREATE TABLE Children (
    id SERIAL PRIMARY KEY,
    english_name VARCHAR(100) NOT NULL,
    khmer_name VARCHAR(100) NOT NULL,
    family_id INT,
    age INT,
    gender VARCHAR(10),
    image_url TEXT, 
    registered_date DATE,
    description TEXT, 
    camp_id INT REFERENCES Camp(id)
);

-- Table: Children_Attendance
CREATE TABLE Children_Attendance (
    id SERIAL PRIMARY KEY,
    children_id INT REFERENCES Children(id),
    monitor_user_id INT REFERENCES "users"(id),
    attendance_date DATE NOT NULL,
    description TEXT
);
