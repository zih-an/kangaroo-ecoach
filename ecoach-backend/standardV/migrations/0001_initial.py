# Generated by Django 4.0.1 on 2022-01-29 02:57

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='standardV',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sv_path', models.CharField(max_length=500, verbose_name='存储路径')),
                ('sketch_sv_path', models.CharField(max_length=500, verbose_name='缩略图存储路径')),
                ('title', models.CharField(max_length=255, verbose_name='视频标题')),
                ('introduction', models.TextField(blank=True, max_length=1023, verbose_name='视频简介')),
                ('skeleton_pic', models.CharField(max_length=500, verbose_name='骨架图存储路径')),
                ('A_intensity', models.IntegerField(blank=True, verbose_name='难度系数')),
                ('action_tag', models.CharField(default=[0, 0, 0, 0, 0, 0, 0, 0, 0], max_length=100, validators=[django.core.validators.int_list_validator])),
            ],
            options={
                'verbose_name': '标准视频',
                'verbose_name_plural': '标准视频',
                'db_table': 'standardV',
            },
        ),
    ]