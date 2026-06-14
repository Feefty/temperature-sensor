CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE temperature_captures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    value DECIMAL(5, 2) NOT NULL,
    state VARCHAR(10) NOT NULL CHECK (state IN ('HOT', 'COLD', 'WARM')),
    captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE thresholds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cold_max DECIMAL(5, 2) NOT NULL DEFAULT 22.0,
    hot_min DECIMAL(5, 2) NOT NULL DEFAULT 35.0,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_captures_captured_at ON temperature_captures(captured_at DESC);
