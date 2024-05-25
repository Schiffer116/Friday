CREATE FUNCTION check_flight_duration()
RETURNS TRIGGER AS $$
DECLARE
    min_duration INTERVAL;
BEGIN
    SELECT min_flight_duration
    INTO min_duration
    FROM policy;

    IF NEW.duration < min_duration THEN
        RAISE EXCEPTION 'Flight % duration (%) is less than the limit (%)',
        NEW.id,
        NEW.duration,
        min_duration;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER flight_duration
    BEFORE INSERT ON flight
    FOR EACH ROW
    EXECUTE FUNCTION check_flight_duration();

--------------------------------------------------------------------------------

CREATE FUNCTION check_layover_duration()
RETURNS TRIGGER AS $$
DECLARE
    min_duration INTERVAL;
    max_duration INTERVAL;
BEGIN
    SELECT min_layover_duration
    INTO min_duration
    FROM policy;

    SELECT max_layover_duration
    INTO max_duration
    FROM policy;

    IF NEW.duration < min_duration OR NEW.duration > max_duration THEN
        RAISE EXCEPTION 'Layover (%) for flight (%) duration (%) is not within the limit (% and %)',
        NEW.ordinal,
        NEW.flight_id,
        NEW.duration,
        min_duration,
        max_duration;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER layover_duration
    BEFORE INSERT ON layover
    FOR EACH ROW
    EXECUTE FUNCTION check_layover_duration();

--------------------------------------------------------------------------------

CREATE FUNCTION check_layover_count()
RETURNS TRIGGER AS $$
DECLARE
    layover_count INT;
    max_layover INT;
BEGIN
    SELECT COUNT(*)
    INTO layover_count
    FROM layover
    WHERE flight_id = NEW.flight_id;

    SELECT max_layover_count
    INTO max_layover
    FROM policy;

    IF layover_count >= max_layover THEN
        RAISE EXCEPTION 'Flight (%) exceed layover limit (%)',
        NEW.flight_id,
        max_layover;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER max_layover
    BEFORE INSERT ON layover
    FOR EACH ROW
    EXECUTE FUNCTION check_layover_count();
