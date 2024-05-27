CREATE EXTENSION pgagent;

CREATE TABLE airport (
    id CHAR(3) PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    city VARCHAR(64) NOT NULL,
    status BOOL DEFAULT TRUE NOT NULL
);

CREATE TABLE flight (
    id SERIAL PRIMARY KEY,
    ticket_price MONEY NOT NULL,
    source_airport_id CHAR(3) NOT NULL,
    destination_airport_id CHAR(3) NOT NULL,
    date_time TIMESTAMP NOT NULL,
    duration INTERVAL NOT NULL,
    FOREIGN KEY (source_airport_id) REFERENCES airport (id),
    FOREIGN KEY (destination_airport_id) REFERENCES airport (id)
);

CREATE TABLE layover (
    flight_id INT,
    ordinal SMALLINT,
    airport_id CHAR(3) NOT NULL,
    duration INTERVAL NOT NULL,
    note TEXT NOT NULL,
    PRIMARY KEY (flight_id, ordinal),
    FOREIGN KEY (flight_id) REFERENCES flight (id),
    FOREIGN KEY (airport_id) REFERENCES airport (id)
);

CREATE TABLE ticket_class (
    class VARCHAR(16) PRIMARY KEY,
    multiplier SMALLINT NOT NULL CHECK (multiplier > 0),
    status BOOL DEFAULT TRUE NOT NULL
);

CREATE TABLE passenger_type (
    type VARCHAR(16) PRIMARY KEY,
    multiplier SMALLINT NOT NULL CHECK (multiplier > 0)
);

CREATE TYPE ticket_status AS ENUM ('booked', 'confirmed', 'cancelled', 'expired');
CREATE TYPE user_role AS ENUM ('admin', 'customer');

CREATE TABLE user_data (
    email VARCHAR(254) PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    password_hash CHAR(60) NOT NULL,
    role USER_ROLE DEFAULT 'customer' NOT NULL
);

CREATE TABLE ticket (
    id SERIAL PRIMARY KEY,
    book_email VARCHAR(254) NOT NULL,
    flight_id INT NOT NULL,
    passenger_name VARCHAR(128) NOT NULL,
    passenger_id VARCHAR(16) NOT NULL,
    phone_number VARCHAR(16) NOT NULL,
    class VARCHAR(16) NOT NULL,
    passenger_type VARCHAR(16) NOT NULL,
    book_time TIMESTAMP NOT NULL,
    status TICKET_STATUS DEFAULT 'booked' NOT NULL,
    note TEXT,
    FOREIGN KEY (book_email) REFERENCES user_data (email),
    FOREIGN KEY (class) REFERENCES ticket_class (class),
    FOREIGN KEY (passenger_type) REFERENCES passenger_type (type)
);

CREATE TABLE flight_ticket_count (
    flight_id INT,
    ticket_class VARCHAR(16),
    ticket_count INT NOT NULL CHECK (ticket_count >= 0),
    FOREIGN KEY (flight_id) REFERENCES flight (id),
    FOREIGN KEY (ticket_class) REFERENCES ticket_class (class),
    PRIMARY KEY (flight_id, ticket_class)
);

CREATE TABLE policy (
    lock CHAR(1) DEFAULT 'X' NOT NULL PRIMARY KEY CHECK (lock = 'X'),
    min_flight_duration INTERVAL DEFAULT '30 minutes' NOT NULL CHECK (min_flight_duration > '0'::INTERVAL),
    min_layover_duration INTERVAL DEFAULT '10 minutes' NOT NULL CHECK (min_layover_duration > '0'::INTERVAL),
    max_layover_duration INTERVAL DEFAULT '20 minutes' NOT NULL CHECK (max_layover_duration >= '0'::INTERVAL),
    max_layover_count INT DEFAULT 2 NOT NULL CHECK (max_layover_count >= 0),
    advance_book_deadline INTERVAL DEFAULT '24 hours' NOT NULL CHECK (advance_book_deadline >= '0'::INTERVAL),
    cancellation_deadline INTERVAL DEFAULT '24 hours' NOT NULL CHECK (cancellation_deadline >= '0'::INTERVAL)
);

CREATE TABLE reset_password_token (
    email VARCHAR(254) PRIMARY KEY,
    hash CHAR(60),
    status BOOL,
    FOREIGN KEY (email) REFERENCES user_data (email)
);

INSERT INTO policy (lock) VALUES ('X');

INSERT INTO ticket_class (class, multiplier) VALUES
('1', 105),
('2', 100);

INSERT INTO passenger_type (type, multiplier) VALUES
('adult', 100),
('child', 75),
('infant', 10);
