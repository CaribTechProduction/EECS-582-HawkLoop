from channels.generic.websocket import AsyncJsonWebsocketConsumer
"""This is the file for establishing the connection between the Vechiles list pulled up in the rest api to the 
websockets for showing the real-time location of the bus.""" 

class VehicleConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        print("WebSocket CONNECTED")
        await self.channel_layer.group_add("vehicles", self.channel_name)
        await self.accept()


    async def disconnect(self, close_code):
        print("WebSocket DISCONNECTED")
        await self.channel_layer.group_discard("vehicles", self.channel_name)

    #sends data from the vehicle views.py file.
    async def vehicle_update(self, event):
        await self.send_json(event["data"])
