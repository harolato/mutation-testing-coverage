# Generated by Django 4.0.2 on 2022-02-08 21:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('testamp', '0002_alter_amplifiedtest_source_code_edited_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='amplifiedtesttask',
            name='completed_at',
            field=models.DateTimeField(null=True),
        ),
    ]
