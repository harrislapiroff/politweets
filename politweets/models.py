from django.contrib.postgres.fields import JSONField
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

    def get_full_name(self):
        if self.middle_name:
            return '{} {} {}'.format(
                self.first_name,
                self.middle_name,
                self.last_name
            )
        return '{} {}'.format(
            self.first_name,
            self.last_name
        )


class Tweet(models.Model):
    member = models.ForeignKey(
        Member,
        related_name='tweets',
        on_delete=models.CASCADE,
    )
    twitter_tweet_id = models.CharField(max_length=255, unique=True)
    time = models.DateTimeField()
    text = models.TextField()
    source = models.CharField(max_length=255)
    original_data = JSONField(blank=True, null=True)

    class Meta:
        get_latest_by = 'time'
        ordering = ['-time']
