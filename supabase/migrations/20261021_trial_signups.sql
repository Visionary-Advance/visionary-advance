-- Free-trial spots for the /free-trial ad page
-- Run against the main Supabase instance (NEXT_PUBLIC_SUPABASE_URL).
-- The page's "X spots left" banner is the spot count (lib/trial.js) minus the
-- rows here with status 'trial'. Signups past the limit land as 'waitlist'.

CREATE TABLE IF NOT EXISTS trial_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- One row per person, so restyling or refilling the form never takes a second spot
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  phone TEXT,
  business_name TEXT,
  google_place_id TEXT,
  -- trial: got a spot | waitlist: signed up after the spots ran out
  status TEXT NOT NULL CHECK (status IN ('trial', 'waitlist')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE trial_signups ENABLE ROW LEVEL SECURITY;

-- Takes a spot if one is left, otherwise joins the waitlist, and returns which.
-- The advisory lock serializes signups so two people can't both take the last spot.
CREATE OR REPLACE FUNCTION claim_trial_spot(
  p_email TEXT,
  p_name TEXT,
  p_phone TEXT,
  p_business_name TEXT,
  p_place_id TEXT,
  p_spots INTEGER
) RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  existing TEXT;
  taken INTEGER;
  new_status TEXT;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('trial_signups'));

  SELECT status INTO existing FROM trial_signups WHERE email = p_email;
  IF existing IS NOT NULL THEN
    RETURN existing;
  END IF;

  SELECT COUNT(*) INTO taken FROM trial_signups WHERE status = 'trial';
  new_status := CASE WHEN taken < p_spots THEN 'trial' ELSE 'waitlist' END;

  INSERT INTO trial_signups (email, name, phone, business_name, google_place_id, status)
  VALUES (p_email, p_name, p_phone, p_business_name, p_place_id, new_status);

  RETURN new_status;
END;
$$;

-- Server routes call this with the service role; nobody else should
REVOKE EXECUTE ON FUNCTION claim_trial_spot(TEXT, TEXT, TEXT, TEXT, TEXT, INTEGER) FROM PUBLIC, anon, authenticated;
