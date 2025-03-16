import passiogo_up

system = passiogo_up.getSystemFromID(4834)
routes = system.getRoutes()
for r in routes:
    print(f"r_id: {r.id}")