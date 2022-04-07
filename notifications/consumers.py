import json
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync


class NotificationsConsumer(JsonWebsocketConsumer):
    def connect(self):
        print(self.scope['user'].is_anonymous)
        if self.scope['user'].is_anonymous:
            self.close()
        else:
            self.group_name = f"user_{self.scope['user'].pk}"
            async_to_sync(self.channel_layer.group_add)(
                self.group_name,
                self.channel_name
            )
            self.accept()
            self.send_json({
                "content": f'etasdasd USER {self.group_name} {self.channel_name}'
            })

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )
        self.close()

    def receive_json(self, content, **kwargs):
        print("Received event: {}".format(content))
        self.send_json(content)

    def event_notify(self, event):
        self.send_json({
            "content": event['content']
        })
