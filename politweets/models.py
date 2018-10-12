from django.db import models
from localflavor.us.models import USStateField


class Member(models.Model):
    SENATE = 'S'
    HOUSE = 'H'
    CHAMBERS = (
        (SENATE, 'Senate'),
        (HOUSE, 'House'),
    )

    REPUBLICAN = 'R'
    DEMOCRAT = 'D'
    INDEPENDENT = 'I'
    PARTIES = (
        (REPUBLICAN, 'Republican'),
        (DEMOCRAT, 'Democrat'),
        (INDEPENDENT, 'Independent'),
    )

    propublica_id = models.CharField(max_length=255)

    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255)
    suffix = models.CharField(max_length=255, blank=True, null=True)

    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=1)

    chamber = models.CharField(max_length=1, choices=CHAMBERS)
    party = models.CharField(max_length=1, choices=PARTIES)
    state = USStateField()
    twitter = models.CharField(max_length=255, blank=True, null=True)

    active = models.BooleanField(help_text='Still in office', default=True)


class Tweet(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    twitter_tweet_id = models.CharField(max_length=255)
    time = models.DateTimeField()
    text = models.TextField()
    source = models.CharField(max_length=255)
    link = models.URLField()
