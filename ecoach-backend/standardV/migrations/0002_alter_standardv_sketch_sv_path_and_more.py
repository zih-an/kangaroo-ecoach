# Generated by Django 4.0.1 on 2022-02-04 08:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('standardV', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='standardv',
            name='sketch_sv_path',
            field=models.URLField(max_length=500, verbose_name='缩略图存储路径'),
        ),
        migrations.AlterField(
            model_name='standardv',
            name='sv_path',
            field=models.URLField(max_length=500, verbose_name='存储路径'),
        ),
    ]
