# Generated by Django 3.2.8 on 2022-02-07 14:42

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0029_alter_token_expire_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='token',
            name='expire_at',
            field=models.DateTimeField(default=datetime.datetime(2022, 4, 8, 14, 42, 44, 649614, tzinfo=utc)),
        ),
    ]
