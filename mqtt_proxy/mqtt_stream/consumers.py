# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class StreamConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Pridruzi se skupini
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Zapusti skupino
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Prejmi paket prek WebSocket
    async def receive(self, text_data=None, bytes_data=None):
        data = bytes_data
        # Poslji sporocilo ostalim v skupini
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'stream_chunk',
                'message': data
            }
        )

    # Sprejmi sporocilo ostalih v skupini
    async def stream_chunk(self, event):
        message = event['message']
        # Poslji paket prek WebSocket
        # Poslijamo le binarne podatke
        await self.send(bytes_data=message)



