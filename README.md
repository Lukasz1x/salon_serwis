# Dealership & Service - Management System
A modular web application designed for **managing operations in a car dealership and an authorized service center**. It includes interfaces for dealership staff, mechanics, clients, and administration.

## Technologies and architecture

### Backend
The backend was built using `Java 21` and the `Spring` framework. The project's database was created using the `PostgreSQL` system.

### Frontend
The frontend was developed with `TypeScript` and the `React 18` library. The user interface utilizes the `Material-UI (MUI)` component system and `Font Awesome` icons. `Vite` and `TanStack Query`, along with the `Axios` HTTP client, are responsible for building the project and handling API communication.

## Running the project locally

### Prerequisites
To run the application, the following components are required:
- **Backend**: `Java Development Kit 21 (JDK 21)` and the `Maven` build tool, or an IDE with an integrated build system (e.g., IntelliJ IDEA by JetBrains).
- **Frontend**: `Node.js` runtime environment and the `npm` package manager.
- **Database**: A remotely hosted `PostgreSQL` database (e.g., on `neon.com`). You can also use a local database installation, though this requires configuration changes. It is recommended to insert accounts of types `ADMIN`, `SALES_REP` and `MECHANIC` to the provided database schema. This will allow thorough system testing.

### Running the application
1. Clone the repository.
2. Set up environmental variables and access keys. Using an IDE to manage these variables is recommended so they remain hidden from the `src/main/resources/application.properties` file. The required variables for the system to work properly are:
- `DB_CONNECT_URL`;
- `DB_PASSWORD`;
- `DB_USER`;
- `JWT_SECRET`.
3. Start the backend. This must launch without errors to continue. You can run the `SalonSerwisApplication` class directly from your IDE, or use the terminal:
```bash
mvn spring-boot:run

# if the command above fails, try on Windows (PowerShell):
.\mvnw spring-boot:run

# on Linux/Mac:
./mvnw spring-boot:run
```
4. Navigate to the `frontend` folder in your terminal.
5. Install the required dependencies:
```bash
npm install
```
6. Check code correctness:
```bash
npx tsc --noEmit
```
7. Start the development server:
```bash
npm run dev
```

### Testing
Once started, the server runs at `localhost:3000` (note this differs from the standard `Vite` port of 5173). Navigating to this address will load the system's login page. Registration is available from this page, but only for `CLIENT` accounts. After logging in, you will see a dashboard with tiles for available actions (such as fleet management or scheduling appointments), which redirect to the appropriate pages and forms.