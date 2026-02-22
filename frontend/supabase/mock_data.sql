-- =========================================================
-- ELDERINK MOCK DATA GENERATOR
-- =========================================================
-- This script safely injects mock health metrics, medications, 
-- symptoms, and connections for a specific user email.
-- =========================================================

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- 1. Try to find the user by email in Supabase auth table
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'vvictort20@gmail.com' LIMIT 1;
  
  -- If user does not exist, we cannot safely insert mock data
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'User vvictort20@gmail.com not found. Please sign up in the app first!';
    RETURN;
  END IF;

  -- 2. Update their profile name if needed
  UPDATE public.profiles SET full_name = 'Victor T' WHERE id = v_user_id;

  -- 3. Clear existing mock data to prevent duplicates on rerun
  DELETE FROM public.health_metrics WHERE user_id = v_user_id;
  DELETE FROM public.medications WHERE user_id = v_user_id;
  DELETE FROM public.symptoms WHERE user_id = v_user_id;
  DELETE FROM public.connections WHERE elder_id = v_user_id;
  
  -- 4. Insert Health Metrics (Blood Pressure structured JSON)
  INSERT INTO public.health_metrics (user_id, type, value_json, recorded_at) VALUES
    (v_user_id, 'blood_pressure', '{"sys": 146, "dia": 78}', now() - interval '6 days'),
    (v_user_id, 'blood_pressure', '{"sys": 190, "dia": 98}', now() - interval '5 days'),
    (v_user_id, 'blood_pressure', '{"sys": 136, "dia": 96}', now() - interval '4 days'),
    (v_user_id, 'blood_pressure', '{"sys": 164, "dia": 108}', now() - interval '3 days'),
    (v_user_id, 'blood_pressure', '{"sys": 136, "dia": 92}', now() - interval '2 days'),
    (v_user_id, 'blood_pressure', '{"sys": 182, "dia": 82}', now() - interval '1 day'),
    (v_user_id, 'blood_pressure', '{"sys": 156, "dia": 124}', now());

  -- 5. Insert Health Metrics (Glucose, Oxygen Numeric)
  INSERT INTO public.health_metrics (user_id, type, value_numeric, recorded_at) VALUES
    (v_user_id, 'glucose', 130, now() - interval '2 days'),
    (v_user_id, 'glucose', 142, now() - interval '5 hours'),
    (v_user_id, 'oxygen', 95, now() - interval '2 days'),
    (v_user_id, 'oxygen', 98, now());

  -- 6. Insert Medications
  INSERT INTO public.medications (user_id, name, dosage, frequency, reminder_time) VALUES
    (v_user_id, 'Lisinopril', '10mg', 'Daily', '08:00:00'),
    (v_user_id, 'Metformin', '500mg', 'Twice a day', '09:00:00'),
    (v_user_id, 'Atorvastatin', '20mg', 'Daily at bedtime', '21:00:00');

  -- 7. Insert Symptoms
  INSERT INTO public.symptoms (user_id, description, severity, recorded_at) VALUES
    (v_user_id, 'Mild headache in the morning', 2, now() - interval '2 days'),
    (v_user_id, 'Slight dizziness when standing up fast', 3, now() - interval '5 hours');

  -- 8. Insert Care Circle Connections (Mock Loved Ones / Doctors)
  INSERT INTO public.connections (elder_id, invite_email, loved_one_name, relationship, phone_number, status) VALUES
    (v_user_id, 'jane.doe@example.com', 'Jane Doe', 'Daughter', '1-555-0198', 'accepted'),
    (v_user_id, 'dr.mckinney@example.com', 'Dr. McKinney', 'Cardiologist', '1-555-0155', 'accepted');

  RAISE NOTICE 'Successfully inserted mock data for %', v_user_id;
END $$;
