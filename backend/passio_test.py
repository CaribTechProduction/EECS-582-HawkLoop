import passiogo

system = passiogo.getSystemFromID(4834)
routes = system.getRoutes()
for r in routes:
    print(f"r_id: {r.id}")
    
vehicles = system.getVehicles()
for v in vehicles:
    print(f"r_id: {v.latitude}")