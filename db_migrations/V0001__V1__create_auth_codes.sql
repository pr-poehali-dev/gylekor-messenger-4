CREATE TABLE IF NOT EXISTS auth_codes (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '10 minutes'),
    used BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_auth_codes_phone_email ON auth_codes(phone, email);
