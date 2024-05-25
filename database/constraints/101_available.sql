CREATE FUNCTION check_availability()
RETURNS TRIGGER AS $$
DECLARE
    seat_count INT;
    seat_booked INT;
BEGIN
    SELECT ticket_count
    INTO seat_count
    FROM flight_ticket_count
    WHERE flight_id = NEW.flight_id
    AND ticket_class = NEW.class;

    SELECT COUNT(*)
    INTO seat_booked
    FROM ticket
    WHERE class = NEW.class
    AND flight_id = NEW.flight_ID
    AND (status = 'booked' OR status = 'confirmed');

    IF seat_booked >= seat_count THEN
        RAISE EXCEPTION 'Flight % is already fully booked', NEW.flight_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER book_available
    BEFORE INSERT OR UPDATE ON ticket
    FOR EACH ROW
    EXECUTE FUNCTION check_availability();
