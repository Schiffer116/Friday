CREATE FUNCTION schedule_ticket_status_change()
RETURNS TRIGGER AS $body$
DECLARE
    job_id INT;
BEGIN
    INSERT INTO pgagent.pga_job (jobjclid, jobname)
    VALUES (1, 'ticket status')
    RETURNING jobid INTO job_id;

    INSERT INTO pgagent.pga_jobstep (jstjobid, jstname, jstkind, jstcode, jstdbname)
    VALUES (
            job_id,
            'update ticket status for flight ' || NEW.id,
            's',
            $step$
                UPDATE ticket
                SET status = 'expired'
                WHERE ticket.flight_id = NEW.id;
            $step$,
            'flight_ticket_management'
        );

    INSERT INTO pgagent.pga_schedule (jscjobid, jscname, jscstart, jscend)
    VALUES (job_id, 'schedule', NEW.date_time, NEW.date_time + '1 minute'::INTERVAL);
    RETURN NEW;
END;
$body$ LANGUAGE plpgsql;

CREATE TRIGGER change_ticket_status
    AFTER INSERT ON flight
    FOR EACH ROW
    EXECUTE FUNCTION schedule_ticket_status_change();
