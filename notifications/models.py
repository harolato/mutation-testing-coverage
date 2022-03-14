from django.contrib.auth.models import User
from django.db import models

# Create your models here.
from config.utils import Timestampable


class Notification(Timestampable):
    class NotificationType(models.IntegerChoices):
        GENERAL = 1
        TEST_AMP = 2

    class NotificationContentType(models.IntegerChoices):
        TEXT = 1
        JSON = 2

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content_type = models.IntegerField(choices=NotificationContentType.choices)
    content = models.TextField()
    seen = models.BooleanField(default=False)
    type = models.IntegerField(choices=NotificationType.choices)

    class Meta:
        db_table = 'notification'

