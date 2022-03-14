import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync


class NotificationsConsumer(WebsocketConsumer):
    def connect(self):
        print(self.scope['user'].is_anonymous)
        if self.scope['user'].is_anonymous:
            self.close()
        else:
            self.group_name = str(self.scope['user'].pk)
            async_to_sync(self.channel_layer.group_add)(
                self.group_name,
                self.channel_name
            )
            self.accept()

    def disconnect(self, close_code):
        self.close()

    def notify(self, event):
        self.send(text_data=json.dumps(event['text']))
