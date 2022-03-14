# Generated by Django 4.0.2 on 2022-02-08 21:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('testamp', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='amplifiedtest',
            name='source_code_edited',
            field=models.TextField(help_text='Use this field save edited amplified test method', null=True),
        ),
        migrations.AlterField(
            model_name='amplifiedtest',
            name='status',
            field=models.IntegerField(choices=[(0, 'Pending'), (1, 'Approved'), (2, 'Ignored')], default=0),
        ),
        migrations.AlterField(
            model_name='amplifiedtesttask',
            name='status',
            field=models.IntegerField(choices=[(1, 'Complete'), (2, 'Pending'), (3, 'Failed')], default=2),
        ),
    ]