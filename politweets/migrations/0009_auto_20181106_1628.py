# Generated by Django 2.1.3 on 2018-11-06 16:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('politweets', '0008_delete_rts'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='member',
            index=models.Index(fields=['party'], name='politweets__party_f052cc_idx'),
        ),
        migrations.AddIndex(
            model_name='member',
            index=models.Index(fields=['chamber'], name='politweets__chamber_933e51_idx'),
        ),
        migrations.AddIndex(
            model_name='member',
            index=models.Index(fields=['gender'], name='politweets__gender_a73e41_idx'),
        ),
        migrations.AddIndex(
            model_name='tweet',
            index=models.Index(fields=['twitter_tweet_id'], name='politweets__twitter_3847cf_idx'),
        ),
        migrations.AddIndex(
            model_name='tweet',
            index=models.Index(fields=['text'], name='politweets__text_5c069c_idx'),
        ),
        migrations.AddIndex(
            model_name='tweet',
            index=models.Index(fields=['time'], name='politweets__time_ffa5e8_idx'),
        ),
    ]
