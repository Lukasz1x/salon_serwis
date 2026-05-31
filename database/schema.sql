DROP TYPE IF EXISTS user_role                   CASCADE;
DROP TYPE IF EXISTS location_type               CASCADE;
DROP TYPE IF EXISTS vehicle_status              CASCADE;
DROP TYPE IF EXISTS salon_appointment_type      CASCADE;
DROP TYPE IF EXISTS salon_appointment_status    CASCADE;
DROP TYPE IF EXISTS service_type                CASCADE;
DROP TYPE IF EXISTS service_status              CASCADE;

DROP TABLE IF EXISTS users                      CASCADE;
DROP TABLE IF EXISTS locations                  CASCADE;
DROP TABLE IF EXISTS vehicles                   CASCADE;
DROP TABLE IF EXISTS salon_appointments         CASCADE;
DROP TABLE IF EXISTS sales_orders               CASCADE;
DROP TABLE IF EXISTS service_appointments       CASCADE;
DROP TABLE IF EXISTS repair_orders              CASCADE;
DROP TABLE IF EXISTS invoices                   CASCADE;
DROP TABLE IF EXISTS sales_order_items          CASCADE;

CREATE TYPE user_role AS ENUM (
  'CLIENT',
  'ADMIN',
  'SALES_REP',
  'MECHANIC'
);

CREATE TYPE location_type AS ENUM (
  'SALON',
  'SERVICE',
  'HYBRID'
);

CREATE TYPE vehicle_status AS ENUM (
  'AVAILABLE',
  'RESERVED',
  'SOLD',
  'AWAITING_REPAIR',
  'UNDER_REPAIR',
  'CANCELLED_REPAIR',
  'READY_FOR_PICKUP'
);

CREATE TYPE salon_appointment_type AS ENUM (
  'VIEWING',
  'TEST_DRIVE',
  'PURCHASE',
  'CONSULTATION'
);

CREATE TYPE salon_appointment_status AS ENUM (
  'SCHEDULED',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED'
);

CREATE TYPE service_type AS ENUM (
  'INSPECTION',
  'REPAIR',
  'TIRE_CHANGE',
  'OIL_SERVICE',
  'FILTER_CHANGE'
);

CREATE TYPE service_status AS ENUM (
  'SCHEDULED',
  'IN_PROGRESS',
  'READY_FOR_PICKUP',
  'CANCELLED'
);

CREATE TABLE locations (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    latitude NUMERIC(9,6) NOT NULL,
    longitude NUMERIC(9,6) NOT NULL,
    type location_type NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    last_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    role user_role NOT NULL,
    location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
    -- CONSTRAINT check_user_location CHECK ((role = 'CLIENT' OR role = 'ADMIN' AND location_id IS NULL) OR (role != 'CLIENT' AND location_id IS NOT NULL))
);

CREATE TABLE vehicles (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    model TEXT NOT NULL,
    production_year INTEGER NOT NULL,
    vin TEXT NOT NULL UNIQUE,
    engine_spec TEXT,
    equipment_details JSONB,
    catalogue_price NUMERIC(14, 2) NOT NULL,
    margin_price NUMERIC(14, 2) NOT NULL,
    location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status vehicle_status NOT NULL,
    last_status_change TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE salon_appointments (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    client_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
    location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    appointment_date TIMESTAMP NOT NULL,
    type salon_appointment_type NOT NULL,
    status salon_appointment_status NOT NULL,
    last_status_change TIMESTAMP,
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE sales_orders (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    client_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sale_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    final_price NUMERIC(14, 2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE sales_order_items (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sales_order_id INTEGER NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
    vehicle_id INTEGER NOT NULL UNIQUE REFERENCES vehicles(id) ON DELETE CASCADE,
    price NUMERIC(14, 2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE service_appointments (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    client_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    type service_type NOT NULL,
    issue_description TEXT,
    appointment_date TIMESTAMP NOT NULL,
    status service_status NOT NULL,
    last_status_change TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE repair_orders (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    appointment_id INTEGER NOT NULL REFERENCES service_appointments(id) ON DELETE CASCADE,
    mechanic_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    work_description JSONB NOT NULL,
    ordered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE invoices (
    id TEXT PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    total_amount NUMERIC(14, 2) NOT NULL,
    sales_order_id INTEGER REFERENCES sales_orders(id) ON DELETE CASCADE,
    repair_order_id INTEGER REFERENCES repair_orders(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
    CONSTRAINT check_invoice_source CHECK ((sales_order_id IS NOT NULL AND repair_order_id IS NULL) OR (sales_order_id IS NULL AND repair_order_id IS NOT NULL))
);

