# Generated by Django 4.0.2 on 2022-02-08 21:01

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0031_alter_token_expire_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='token',
            name='expire_at',
            field=models.DateTimeField(default=datetime.datetime(2022, 4, 9, 21, 1, 4, 981286, tzinfo=utc)),
        ),
    ]
