CREATE FUNCTION check_cancell_time()
RETURNS TRIGGER AS $$
DECLARE
    cancel_req INTERVAL;
    fly_time TIMESTAMP;
BEGIN
    SELECT cancellation_deadline
    INTO cancel_req
    FROM policy;

    SELECT date_time
    INTO fly_time
    FROM flight
    WHERE flight.id = OLD.flight_id;

    IF NOW() + cancel_req > fly_time THEN
        RAISE EXCEPTION 'Cancellation was too late';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cancell_requirement
    BEFORE UPDATE ON ticket
    FOR EACH ROW
    EXECUTE FUNCTION check_cancell_time();
