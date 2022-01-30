from django.apps import AppConfig


class MeasurementConfig(AppConfig):
    name = 'measurement'

    def ready(self):
        import mqtt_proxy.measurement.signals.handlers 



