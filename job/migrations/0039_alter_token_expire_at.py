# Generated by Django 4.0.2 on 2022-03-21 14:09

from django.db import migrations, models
import job.models


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0038_alter_token_expire_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='token',
            name='expire_at',
            field=models.DateTimeField(default=job.models.token_expiration),
        ),
    ]
