CREATE DATABASE flight_ticket_management;

\c flight_ticket_management;

CREATE TABLE airport (
    id CHAR(3) PRIMARY KEY,
    name VARCHAR(256),
    country VARCHAR(64)
);

CREATE TABLE flight (
    id SERIAL PRIMARY KEY,
    ticket_price MONEY,
    source_airport_id CHAR(3),
    destination_airport_id CHAR(3),
    date_time TIMESTAMP,
    duration INTERVAL,
    FOREIGN KEY (source_airport_id) REFERENCES airport (id),
    FOREIGN KEY (destination_airport_id) REFERENCES airport (id)
);

CREATE TABLE layover (
    flight_id INT,
    ordinal SMALLINT,
    airport_id CHAR(3),
    duration INTERVAL,
    note TEXT,
    PRIMARY KEY (flight_id, ordinal),
    FOREIGN KEY (flight_id) REFERENCES flight (id),
    FOREIGN KEY (airport_id) REFERENCES airport (id)
);

CREATE TABLE ticket_class (
    class VARCHAR(16) PRIMARY KEY,
    multiplier SMALLINT
);

CREATE TABLE passenger_type (
    type VARCHAR(16) PRIMARY KEY,
    multiplier INT
);

CREATE TABLE ticket_info (
    id SERIAL PRIMARY KEY,
    flight_id INT,
    passenger_name VARCHAR(70),
    passenger_id VARCHAR(12),
    phone_number VARCHAR(16),
    class VARCHAR(16),
    passenger_type VARCHAR(16),
    order_date DATE,
    confirmed BOOLEAN,
    note TEXT,
    FOREIGN KEY (class) REFERENCES ticket_class (class),
    FOREIGN KEY (passenger_type) REFERENCES passenger_type (type)
);

CREATE TABLE flight_ticket_count (
    flight_id INT,
    ticket_class VARCHAR(16),
    ticket_count INT,
    FOREIGN KEY (flight_id) REFERENCES flight (id),
    FOREIGN KEY (ticket_class) REFERENCES ticket_class (class),
    PRIMARY KEY (flight_id, ticket_class)
);

INSERT INTO airport (id, name, country) VALUES ('SGN', 'Tan Son Nhat International Airport', 'Viet Nam');
INSERT INTO airport (id, name, country) VALUES ('HAN', 'Noi Bai International Airport', 'Viet Nam');
INSERT INTO airport (id, name, country) VALUES ('HND', 'Haneda Airport', 'Japan');
INSERT INTO airport (id, name, country) VALUES ('ATL', 'Hartsfield–Jackson Atlanta International Airport', 'USA');
INSERT INTO airport (id, name, country) VALUES ('DXB', 'Dubai International Airport', 'UAE');
INSERT INTO airport (id, name, country) VALUES ('LHR', 'London Heathrow Airport', 'England');
INSERT INTO airport (id, name, country) VALUES ('CAN', 'Guangzhou Baiyun International Airport', 'China');
INSERT INTO airport (id, name, country) VALUES ('DEL', 'Indira Gandhi International Airport', 'India');
INSERT INTO airport (id, name, country) VALUES ('CDG', 'Charles de Gaulle Airport', 'France');
INSERT INTO airport (id, name, country) VALUES ('AMS', 'Schiphol Airport', 'Netherlands');

INSERT INTO ticket_class (class, multiplier) VALUES ('1', 105);
INSERT INTO ticket_class (class, multiplier) VALUES ('2', 100);

INSERT INTO passenger_type (type, multiplier) VALUES ('adult', 100);
INSERT INTO passenger_type (type, multiplier) VALUES ('child', 75);
INSERT INTO passenger_type (type, multiplier) VALUES ('infant', 10);
