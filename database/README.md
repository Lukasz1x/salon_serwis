# Database

The project uses a PostgreSQL database hosted on `neon.com`. The file `schema.sql` contains the full database structure, including custom types, constraints and relationships. 

## Overview
Our database is designed with a modular approach to cater for both car dealership (sales) and service needs. It includes advanced PostgreSQL features such as custom `ENUM` types to ensure data integrity as well as `JSONB` columns in tables for flexibility and ease of programming.

### Custom types
To enforce data integrity across the system, we use `ENUM` types:
- `user_role` defines system access levels (types of accounts possible to create in the system) - `ADMIN`, `SALES_REP`, `MECHANIC` and `CLIENT`;
- `location_type` specifies possible locations - `SALON`, `SERVICE` or `HYBRID`;
- `vehicle_status` tracks the lifecycle of a car, e.g. `AVAILABLE`, `SOLD`, `UNDER_REPAIR` or `READY_FOR_PICKUP`;
- `salon_appointment_status` and `service_status` define states of appointments, e.g. `SCHEDULED` or `CANCELED`;
- `salon_appointment_type` and `service_type` specify types of meetings and maintenance, such as `TEST_DRIVE` or `FILTER_CHANGE`.

### Main tables
| Table                  | Description                                               |
|------------------------|-----------------------------------------------------------|
| `users`                | Personal information, credentials and roles.              |
| `vehicles`             | Fleet management, including technical spec and pricing.   |
| `locations`            | Adressess, GPS coordinates and anything location-related. |
| `salon_appointments`   | Consultation schedule and information for sales reps.     |
| `service_appointments` | Repair schedule and information for mechanics.            |
| `invoices`             | Financial documents linked with sales or repairs.         |

## Seed data
It is recommended to add seed data to the main script. At the very least you need to insert an `ADMIN` account and locations for the salon and the service.
Sample inserts:
```sql
INSERT INTO users (last_name, first_name, phone, email, hashed_password, role)
VALUES ('Smith', 'John', '123456789', 'johnsmith@email.com', '<insert_bcypt_hash_here>', 'ADMIN');
```
```sql
INSERT INTO locations (name, phone, street, city, zip_code, latitude, longitude, type) 
VALUES ('Salon in Warsaw', '22 48 567 56', 'Nowy Świat', 'Warsaw', '00-001', 52.235633, 21.018361, 'SALON');
```
```sql
INSERT INTO locations (name, phone, street, city, zip_code, latitude, longitude, type) 
VALUES ('Service in Warsaw', '22 48 567 56', 'Nowy Świat', 'Warsaw', '00-001', 52.235633, 21.018361, 'Service');
```
To test the whole system, you also need accounts of types `SALES_REP`, `MECHANIC` and `CLIENT`. You have two ways of obtaining these:
- insert the accounts similarly to the `ADMIN` account;

or
- launch the server, register three `CLIENT` accounts through the web interface, login as admin and change types of two of those as needed.

## Initialization
To set up the database:
1. Execute `schema.sql` in your PostgreSQL terminal or Neon SQL editor.
2. Set your environment variables:
- `DB_CONNECT_URL=jdbc:postgresql://<host>:<port>/<dbname>`
- `DB_USER=<your_username>`
- `DB_PASSWORD=<your_password>`