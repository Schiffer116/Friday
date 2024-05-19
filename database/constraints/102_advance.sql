\c flight_ticket_management

CREATE FUNCTION check_book_time()
RETURNS TRIGGER AS $$
DECLARE
    departure_time TIMESTAMP;
    advance_book INTERVAL;
BEGIN
    SELECT date_time
    INTO departure_time
    FROM flight
    WHERE id = NEW.flight_id;

    SELECT advance_book_deadline
    INTO advance_book
    FROM policy;

    IF NEW.book_time > departure_time - advance_book THEN
        RAISE EXCEPTION 'Booking was too late';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER advance_book_requirement
    BEFORE INSERT ON ticket
    FOR EACH ROW
    EXECUTE FUNCTION check_book_time();
