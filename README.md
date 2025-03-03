# HawkLoop - Real-Time Bus Tracking App

## Overview

HawkLoop is a real-time bus tracking application designed to provide live bus location updates, estimated arrival times, and route suggestions. The application integrates the Passio Go API for real-time tracking and leverages PostgreSQL & PostGIS for geospatial data storage. The front-end is built with React Native, while the backend is powered by Django and Django REST Framework.

## Features

## Backend (Django + DRF + PostgreSQL)

- Set up Django project & Django REST framework

- Integrate Passio Go API for real-time bus tracking

- Create database schema using PostgreSQL & PostGIS for geospatial data

- Implement caching with Redis for optimized query performance

- Develop RESTful API endpoints for:

  - Fetching bus locations

  - Searching routes & stops

  - Fetching estimated arrival times

- Implement WebSockets with Django Channels for real-time updates

- Error handling & logging for API requests

## Frontend (React Native + Expo)

- Set up React Native project & integrate navigation

- Implement real-time bus tracking map using React Native Maps

- Create search functionality for stops and routes

- Display estimated arrival times

- Create basic route suggestions

- Develop favorite routes functionality

- Implement push notifications for delays using Expo

- Optimize performance to minimize battery usage

- Implement offline mode by storing last-known schedule in SQLite

## UI/UX Design

- Wireframe core screens (Home, Map, Search, Favorites)

- Design high-fidelity UI components

- Ensure seamless UI/UX across Android & iOS

- Implement dark mode support

## Testing & Deployment

- Set up Expo push notifications

- Implement notification preferences for users

- Optimize database queries for speed

- Error handling for missing/incorrect data

- Set up CI/CD for automatic deployment

- Conduct unit & integration testing for backend

- Test UI components & interactions

- Deploy backend to AWS

- Publish app on Play Store & App Store

## How the App Works

- management/updated_data.py fetches route, stops, alerts, and vehicle data.

- This data is currently stored in the default Django database but needs to be migrated to PostgreSQL for efficiency.

- The database should be updated every 10 minutes.

- Jawad Ahsan will use this database to calculate estimated arrival times of buses.

## Setup & Development Guidelines

## Backend Setup

# Installation & Setup Guide\*\*

This section provides step-by-step instructions for setting up the **HawkLoop** project, including **PostgreSQL, PostGIS, Django, and React Native**.

---

## Prerequisites\*\*

Before setting up the project, ensure you have the following installed:

- **Python 3.13** → [Download Python](https://www.python.org/downloads/)
- **PostgreSQL 14+ with PostGIS**:

  - **Mac (Homebrew)**:
    ```sh
    brew install postgresql postgis
    brew services start postgresql
    ```
  - **Ubuntu/Linux**:
    ```sh
    sudo apt update
    sudo apt install postgresql postgis
    sudo systemctl start postgresql
    ```
  - **Windows**: [Download PostgreSQL](https://www.postgresql.org/download/) and enable **PostGIS** during installation.

- **Redis** (for caching):
  ```sh
  brew install redis  # Mac
  sudo apt install redis  # Linux
  ```

1. Clone the repository.

   ```bash
   git clone https://github.com/CaribTechProduction/EECS-582-HawkLoop.git
   ```

2. Set up a virtual environment:

```bash
python -m venv env  # or venv
source env/bin/activate  # Mac/Linux
env\Scripts\activate  # Windows
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Set up PostgreSQL database:

- Install PostgreSQL & PostGIS

- Create a database and configure `settings.py `

  - Open PostgreSQL:

  ```sh
  psql -U postgres
  ```

  - Create a database:

  ```sh
  CREATE DATABASE hawkloop;
  ```

  - Enable PostGIS:

  ```sh
  \c hawkloop;
  CREATE EXTENSION postgis;
  ```

  - Grant privileges:

  ```sh
  GRANT ALL PRIVILEGES ON DATABASE hawkloop TO postgres;
  ```

  - Exit:

  ```sh
  \q
  ```

5. Update Django Database Settings

- Edit hawkloop_backend/settings.py:

```sh
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'hawkloop',
        'USER': 'postgres',
        'PASSWORD': 'your_password',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}
```

6. Apply migrations:

```sh
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser
```

7. Run the development server:

```sh
python manage.py runserver
```

# Visit:

- Admin Panel: http://127.0.0.1:8000/admin/
- API Endpoint: http://127.0.0.1:8000/api/
- Live Bus Tracking: http://127.0.0.1:8000/api/live-buses/

## Frontend Setup

1. Navigate to the frontend directory.

2. Install dependencies:

```bash
npm install
```

3. Start the React Native development server:

```bash
npm start
```

4. Test on an emulator or physical device using Expo.

## Database Implementation

- Implement PostgreSQL with PostGIS to store bus locations, routes, and stops.

- Store real-time bus locations fetched from the Passio Go API.

- Ensure data updates every 10 minutes.

## Contribution Guidelines

- Always set up and activate the virtual environment before modifying Django files.

- Implement PostgreSQL database integration as planned.

- Ensure live location tracking is integrated with the backend.

- Maintain clean and optimized code.

- Follow best practices for API error handling and logging.

## Contributors

### Group 39:

- Dev Patel

- Yadhunath Tharakeswaran

- Kemar Wilson

- Sanketh Reddy

- Jawad Ahsan
