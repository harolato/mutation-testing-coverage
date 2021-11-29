# Generated by Django 3.2.8 on 2021-11-08 17:53

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('job', '0008_job_project'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='project',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='project', to='job.project'),
        ),
        migrations.AlterField(
            model_name='project',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='project_user', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Token',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=255)),
                ('token', models.TextField()),
                ('project', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='project_tokens', to='job.project')),
                ('user', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='user_tokens', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'project_token',
            },
        ),
    ]