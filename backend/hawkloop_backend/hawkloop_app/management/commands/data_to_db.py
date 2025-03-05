import os
import psycopg2
import passiogo  # Import PassioGo API
from dotenv import load_dotenv
from django.core.management.base import BaseCommand

# Load environment variables (Ensure the correct path)
dotenv_path = os.path.join(os.path.dirname(__file__), "../../../db.env")
load_dotenv(dotenv_path)

class Command(BaseCommand):
    help = "Fetch and load route and stop data from the local PassioGo API into PostgreSQL."

    def handle(self, *args, **kwargs):
        try:
            # Fetch database credentials from .env
            db_name = os.getenv("DB_NAME")
            db_user = os.getenv("DB_USER")
            db_password = os.getenv("DB_PASSWORD")
            db_host = os.getenv("DB_HOST", "localhost")
            db_port = os.getenv("DB_PORT", "5432")

            if not all([db_name, db_user, db_password, db_host, db_port]):
                raise ValueError("One or more database environment variables are missing!")

            # Connect to PostgreSQL
            conn = psycopg2.connect(
                dbname=db_name,
                user=db_user,
                password=db_password,
                host=db_host,
                port=db_port
            )
            cursor = conn.cursor()

            # Initialize PassioGo System 
            system = passiogo.getSystemFromID(4834)

            # Fetch and insert route data
            routes = system.getRoutes()
            for route in routes:
                cursor.execute(
                    """
                    INSERT INTO routes (route_id, route_name)
                    VALUES (%s, %s)
                    ON CONFLICT (route_id) DO NOTHING
                    """,
                    (route.id, route.name)
                )

            # Fetch and insert stop data
            stops = system.getStops()
            for stop in stops:
                if stop.routesAndPositions:
                    route_id = list(stop.routesAndPositions.keys())[0]  # Fetch first route ID
                else:
                    route_id = None  # Handle cases where no route is linked
                cursor.execute(
                    """
                    INSERT INTO stops (stop_id, route_id, stop_name, latitude, longitude)
                    VALUES (%s, %s, %s, %s, %s)
                    ON CONFLICT (stop_id) DO NOTHING
                    """,
                    (stop.id, route.id, stop.name, stop.latitude, stop.longitude)
                )

            # Commit changes and close connection
            conn.commit()
            cursor.close()
            conn.close()

            self.stdout.write(self.style.SUCCESS("Successfully loaded route and stop data!"))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Error: {e}"))
