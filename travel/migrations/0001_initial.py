# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-05-04 03:05
from __future__ import unicode_literals

import DjangoUeditor.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Attention',
            fields=[
                ('aid', models.AutoField(primary_key=True, serialize=False)),
                ('uid', models.CharField(max_length=400)),
                ('other_uid', models.CharField(max_length=400)),
            ],
            options={
                'db_table': 'attention',
            },
        ),
        migrations.CreateModel(
            name='Code',
            fields=[
                ('code_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('email', models.CharField(blank=True, max_length=200, null=True)),
                ('code', models.CharField(max_length=20)),
                ('created_at', models.CharField(default=1525403107.0106194, max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Collection',
            fields=[
                ('cid', models.AutoField(primary_key=True, serialize=False)),
                ('uid', models.CharField(max_length=400)),
                ('rid', models.CharField(max_length=400)),
            ],
            options={
                'db_table': 'collection',
            },
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('comment_id', models.AutoField(primary_key=True, serialize=False)),
                ('uid', models.CharField(max_length=500)),
                ('rid', models.CharField(max_length=500)),
                ('created_at', models.CharField(max_length=128)),
                ('content', models.TextField(blank=True, null=True)),
                ('like_counts', models.IntegerField()),
                ('reply', models.IntegerField()),
            ],
            options={
                'db_table': 'comments',
            },
        ),
        migrations.CreateModel(
            name='Praise',
            fields=[
                ('praise_id', models.AutoField(primary_key=True, serialize=False)),
                ('uid', models.CharField(max_length=400)),
                ('comment_id', models.CharField(max_length=400)),
            ],
            options={
                'db_table': 'praise',
            },
        ),
        migrations.CreateModel(
            name='Raider',
            fields=[
                ('rid', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=256)),
                ('content', DjangoUeditor.models.UEditorField(blank=True)),
                ('created_at', models.CharField(max_length=128)),
                ('description', models.TextField(blank=True, null=True)),
                ('play_counts', models.IntegerField()),
                ('like_counts', models.IntegerField()),
                ('thumbnail', models.FileField(upload_to='cover/')),
            ],
            options={
                'db_table': 'raiders',
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('uid', models.AutoField(primary_key=True, serialize=False)),
                ('banner', models.CharField(max_length=512, null=True)),
                ('avatar', models.FileField(upload_to='avatar/')),
                ('name', models.CharField(max_length=128)),
                ('intro', models.TextField(blank=True, null=True)),
                ('like_counts', models.IntegerField(default=0)),
                ('follow_counts', models.IntegerField(default=0)),
                ('email', models.CharField(blank=True, max_length=100, null=True)),
                ('account_num', models.CharField(default=12, max_length=50)),
                ('password', models.CharField(blank=True, max_length=100, null=True)),
            ],
            options={
                'db_table': 'users',
            },
        ),
        migrations.AddField(
            model_name='raider',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='travel.User'),
        ),
        migrations.AddField(
            model_name='comment',
            name='raider',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='travel.Raider'),
        ),
    ]
