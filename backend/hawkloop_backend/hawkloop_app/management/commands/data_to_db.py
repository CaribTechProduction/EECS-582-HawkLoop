import os
import psycopg2
import passiogo_up
from dotenv import load_dotenv
from django.core.management.base import BaseCommand

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), "../../../db.env")
load_dotenv(dotenv_path)

class Command(BaseCommand):
    help = "Fetch and load route and stop data from the PassioGo API into PostgreSQL."

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
            system_id = 4834  # Replace with the actual system ID for your university
            system = passiogo_up.getSystemFromID(system_id)

            # Create required tables if they don’t exist
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS route_mapping (
                    route_myid TEXT PRIMARY KEY,
                    real_route_id INT REFERENCES routes(route_id) ON DELETE CASCADE
                );
            """)

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS stop_route_mapping (
                    stop_id INT,
                    route_id INT REFERENCES routes(route_id) ON DELETE CASCADE,
                    stop_position INT,
                    PRIMARY KEY (stop_id, route_id)
                );
            """)
            
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS stops (
                    stop_id INT PRIMARY KEY,
                    stop_name TEXT,
                    latitude FLOAT,
                    longitude FLOAT
                );
            """)

            # Fetch and insert route data
            routes = system.getRoutes()
            for route in routes:
                # Insert into routes table
                cursor.execute(
                    """
                    INSERT INTO routes (route_id, route_name)
                    VALUES (%s, %s)
                    ON CONFLICT (route_id) DO NOTHING
                    """,
                    (route.id, route.name)
                )

                # Insert mapping into route_mapping table
                cursor.execute(
                    """
                    INSERT INTO route_mapping (route_myid, real_route_id)
                    VALUES (%s, %s)
                    ON CONFLICT (route_myid) DO NOTHING
                    """,
                    (route.myid, route.id)
                )

            # Fetch and insert stop-route mapping
            stops = system.getStops()
            for stop in stops:
                #print(f"Stop ID: {stop.id}, routesAndPositions: {stop.routesAndPositions}")  # Debugging

                for route_myid, positions in stop.routesAndPositions.items():
                    # Get the actual route_id from route_mapping
                    cursor.execute("SELECT real_route_id FROM route_mapping WHERE route_myid = %s", (route_myid,))
                    route_id_result = cursor.fetchone()

                    if route_id_result:
                        route_id = route_id_result[0]  # Extract integer route_id
                        for position in positions:
                            print(f"Inserting Stop {stop.id} with Route {route_id}, Position {position}")  # Debugging

                            cursor.execute(
                                """
                                INSERT INTO stop_route_mapping (stop_id, route_id, stop_position)
                                VALUES (%s, %s, %s)
                                ON CONFLICT (stop_id, route_id) DO NOTHING
                                """,
                                (stop.id, route_id, position)
                            )

            # Commit changes and close connection
            conn.commit()
            cursor.close()
            conn.close()

            self.stdout.write(self.style.SUCCESS("Successfully loaded route and stop data!"))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Error: {e}"))
