-- Table: Role
CREATE TABLE Role (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Table: Users
CREATE TABLE Users (
    id UUID PRIMARY KEY,
    role_id UUID REFERENCES Role(id),
    khmer_name VARCHAR(100),
    english_name VARCHAR(100),
    password VARCHAR(255),
    date_of_birth DATE,
    national VARCHAR(100),
    position VARCHAR(100),
    email VARCHAR(100) UNIQUE
);

-- Table: Camp_event
CREATE TABLE Camp_event (
    id UUID PRIMARY KEY,
    camp_event_name VARCHAR(100) NOT NULL
);

-- Table: Camp
CREATE TABLE Camp (
    id UUID PRIMARY KEY,
    camp_event_id UUID REFERENCES Camp_event(id),
    camp_name VARCHAR(100) NOT NULL
);

-- Table: Camp_Character
CREATE TABLE Camp_Character (
    id UUID PRIMARY KEY,
    camp_id UUID REFERENCES Camp(id),
    user_id UUID REFERENCES Users(id),
    is_active BOOLEAN DEFAULT TRUE
);

-- Table: Children
CREATE TABLE Children (
    id UUID PRIMARY KEY,
    english_name VARCHAR(100) NOT NULL,
    khmer_name VARCHAR(100) NOT NULL,
    family_id UUID,
    age INT,
    gender VARCHAR(10),
    image_url TEXT, 
    registered_date DATE,
    description TEXT, 
    camp_id UUID REFERENCES Camp(id)
);

-- Table: Children_Attendance
CREATE TABLE Children_Attendance (
    id UUID PRIMARY KEY,
    children_id UUID REFERENCES Children(id),
    monitor_user_id UUID REFERENCES Users(id),
    attendance_date DATE NOT NULL,
    description TEXT
);
