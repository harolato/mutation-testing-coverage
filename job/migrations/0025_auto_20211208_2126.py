# Generated by Django 3.2.8 on 2021-12-08 20:26

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('job', '0024_alter_token_expire_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='token',
            name='expire_at',
            field=models.DateTimeField(default=datetime.datetime(2022, 2, 6, 20, 26, 8, 133526, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='token',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='project_tokens', to='job.project'),
        ),
        migrations.AlterField(
            model_name='token',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_tokens', to=settings.AUTH_USER_MODEL),
        ),
    ]