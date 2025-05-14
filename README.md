# Pandemic Resilience System Dashboard

This is the React frontend for the Pandemic Resilience System (PRS).

## Setup Instructions

### Prerequisites

- Node.js (version 16 or higher)
- npm (version 8 or higher)
- PostgreSQL (version 12 or higher)
- Python (version 3.8 or higher)
- Flask backend (see Backend Setup)

### Frontend Installation

1. Clone the repository
2. Install dependencies:

```bash
cd prs-dashboard
npm install
```

3. Start the development server:

```bash
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Backend Setup

The React frontend communicates with a Flask API backend, which connects to a PostgreSQL database.

### Setting Up the API

1. Navigate to the API directory:

```bash
cd prs_system
```

2. Create a virtual environment:

```bash
python -m venv venv
```

3. Activate the virtual environment:

- Windows:
```bash
venv\Scripts\activate
```

- macOS/Linux:
```bash
source venv/bin/activate
```

4. Install dependencies:

```bash
pip install flask flask-sqlalchemy flask-cors flask-jwt-extended psycopg2-binary python-dotenv cryptography
```

5. Create a `.env` file in the root of the API project with the following variables:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=prs_db
DB_USER=prs_app_user
DB_PASSWORD=your_secure_password
JWT_SECRET_KEY=your_jwt_secret_key
DOCUMENT_STORAGE_PATH=C:/prs_documents
```

Replace `your_secure_password` and `your_jwt_secret_key` with actual secure values.

### PostgreSQL Database Setup

1. Install PostgreSQL if you haven't already
2. Create a database and user:

```sql
CREATE DATABASE prs_db;
CREATE USER prs_app_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE prs_db TO prs_app_user;
```

3. Initialize the database schema:

```bash
flask init-db
```

4. If you want sample data, you can seed the database:

```bash
flask seed-db
```

## Running the Full Stack

1. Start the Flask API backend:

```bash
cd prs_system
flask run
```

2. In a separate terminal, start the React frontend:

```bash
cd prs-dashboard
npm start
```

3. The application will be available at [http://localhost:3000](http://localhost:3000)

## Demo Login Credentials

For testing, you can use the following credentials:

- Public User: 
  - PRS ID: PRS123456
  - Password: password

- Merchant User:
  - PRS ID: PRS234567
  - Password: password

- Government Official:
  - PRS ID: GOVPRS789
  - Password: password

## API Connection

The frontend uses a proxy configuration to connect to the backend API. This is defined in the `package.json` file with:

```json
"proxy": "http://localhost:5000"
```

This allows API requests to be forwarded to the Flask server running on port 5000.

## Using PostgreSQL

The React application doesn't directly connect to PostgreSQL. Instead, it communicates with the Flask API, which handles the database operations. The connection details for PostgreSQL are managed in the Flask backend's `.env` file.

All database models and API routes are implemented in the Flask backend, providing a secure and organized architecture.

## Document Storage

Vaccination documents and other files are stored in the file system path specified by `DOCUMENT_STORAGE_PATH` in the .env file. Make sure this directory exists and has proper access permissions.
