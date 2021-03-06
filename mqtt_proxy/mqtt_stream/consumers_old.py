# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        # Join mqtt group
        await self.channel_layer.group_add(
            "mqttgroup",
            self.channel_name
        )
        # Ensure MQTT messages come to the room
        # This simplistic approach subscribes the room every
        # time a websocket connects but that's OK
        await self.channel_layer.send(
            "mqtt",
            {
                "type": "mqtt_subscribe",
                "topic": f"{self.room_name}/data",
                "group": "mqttgroup",
        })
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room grou
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data, bytes_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        data = bytes_data
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': data
            }
        )
        # Publish on mqtt too
        await self.channel_layer.send(
            "mqtt",
            {
                "type": "mqtt_publish",
                "publish": {  # These form the kwargs for mqtt.publish
                    #"topic": f"stream/{self.room_name}_out",
                    "topic": f"{self.room_name}/control",
                    "payload": message,
                    "qos": 1,
                    "retain": False,
                    }
        })

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(bytes_data=message)
        # await self.send(text_data=json.dumps({
        #     'message': message
        # }))

    # Receive message from mqtt group and send to websocket
    # async def mqtt_message(self, event):
    #     message = event['message']
    #     topic = message["topic"]
    #     payload = message["payload"]
    #     # Send message to WebSocket
    #     #await self.send(payload)
    #     await self.send(text_data=json.dumps({
    #         'message': payload
    #     }))
