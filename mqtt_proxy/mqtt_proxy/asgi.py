"""
ASGI config for mqtt_proxy project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ChannelNameRouter, ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import mqtt_stream.routing
from chanmqttproxy import MqttConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mqtt_proxy.settings')

application = ProtocolTypeRouter({
    "channel": ChannelNameRouter({
        "mqtt": MqttConsumer.as_asgi()
    }),
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            mqtt_stream.routing.websocket_urlpatterns
        )
    ),
})
