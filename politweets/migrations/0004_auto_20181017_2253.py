# Generated by Django 2.1.2 on 2018-10-17 22:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('politweets', '0003_remove_tweet_link'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tweet',
            name='twitter_tweet_id',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]
