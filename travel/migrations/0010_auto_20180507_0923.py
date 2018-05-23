# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-05-07 01:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('travel', '0009_auto_20180506_1746'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='comment_type',
            field=models.CharField(default='comment', max_length=20),
        ),
        migrations.AlterField(
            model_name='code',
            name='created_at',
            field=models.CharField(default=1525656235.2151415, max_length=50),
        ),
        migrations.AlterField(
            model_name='reply',
            name='reply_type',
            field=models.CharField(default='comment', max_length=20),
        ),
    ]
