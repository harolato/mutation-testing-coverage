# Generated by Django 3.2.8 on 2021-12-08 20:14

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0022_auto_20211208_2112'),
    ]

    operations = [
        migrations.AlterField(
            model_name='token',
            name='expire_at',
            field=models.DateTimeField(default=datetime.datetime(2022, 2, 6, 20, 14, 11, 351024, tzinfo=utc)),
        ),
        migrations.DeleteModel(
            name='Reaction',
        ),
    ]