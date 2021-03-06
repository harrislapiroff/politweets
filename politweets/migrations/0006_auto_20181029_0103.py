# Generated by Django 2.1.2 on 2018-10-29 01:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('politweets', '0005_auto_20181019_2021'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='tweet',
            options={'get_latest_by': 'twitter_tweet_id', 'ordering': ['-twitter_tweet_id']},
        ),
        migrations.AlterField(
            model_name='tweet',
            name='twitter_tweet_id',
            field=models.BigIntegerField(unique=True),
        ),
    ]
