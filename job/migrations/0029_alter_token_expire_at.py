# Generated by Django 3.2.8 on 2022-02-07 14:36

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0028_alter_token_expire_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='token',
            name='expire_at',
            field=models.DateTimeField(default=datetime.datetime(2022, 4, 8, 14, 36, 26, 281660, tzinfo=utc)),
        ),
    ]
