INSERT INTO thresholds (cold_max, hot_min)
VALUES (22.0, 35.0)
ON CONFLICT DO NOTHING;
