# Generated by Django 5.1.6 on 2025-03-03 02:20

# import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hawkloop_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BusLocation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bus_id', models.CharField(max_length=50, unique=True)),
                ('route_id', models.CharField(max_length=50)),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                # ('location', django.contrib.gis.db.models.fields.PointField(geography=True, srid=4326)),
            ],
        ),
    ]
