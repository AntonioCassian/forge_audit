
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL
        CHECK (role IN ('OPERATOR', 'SUPERVISOR', 'AUDITOR')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS machines (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    asset_code VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL
        CHECK (status IN ('OPERATIONAL', 'MAINTENANCE', 'FAILED')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS production_orders (
    id UUID PRIMARY KEY,
    production_code VARCHAR(100) NOT NULL UNIQUE,
    machine_id UUID NOT NULL,
    planned_quantity INTEGER NOT NULL
        CHECK (planned_quantity > 0),
    produced_quantity INTEGER NOT NULL DEFAULT 0
        CHECK (produced_quantity >= 0),
    status VARCHAR(50) NOT NULL
        CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'SUSPENDED', 'COMPLETED')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_production_orders_machine
        FOREIGN KEY (machine_id)
        REFERENCES machines(id)
        ON DELETE RESTRICT
);
