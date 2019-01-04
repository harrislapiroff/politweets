from django.contrib.postgres.fields import JSONField
from django.db import models
from localflavor.us.models import USStateField


RE_HASHTAG_FORMAT = r'(^|\s)#{}\M'


class Member(models.Model):
    """
    Represents a single term from a current member of congress.

    Note: the name of this model is slightly misleading and we may wish to
    rename or restructure it in the future. This represents all of the data
    for a member during a single term of congress. If a congressperson served
    multiple terms, there will be a corresponding Member object for each term
    that they served.

    Aggregations for a single individual could be made by comparing across
    unique `propublica_id`s
    """

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
    # district is a CharField because some reps are "at-large"
    district = models.CharField(max_length=255, blank=True, null=True)
    twitter = models.CharField(max_length=255, blank=True, null=True)

    session = models.PositiveIntegerField()

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

    def get_latest_tweet(self):
        """
        A hacky method to get the latest tweet from either this Member or a
        previous Member with the same ProPublica ID. This is necessary until
        such time that we separate this model into Term and Member models as
        described in the model's docstring
        """
        return Tweet.objects.filter(member__propublica_id=self.propublica_id)\
                            .latest()

    class Meta:
        indexes = [
            models.Index(fields=['party']),
            models.Index(fields=['chamber']),
            models.Index(fields=['gender']),
            models.Index(fields=['session']),
        ]


class TweetQuerySet(models.QuerySet):
    def with_hashtag(self, hashtag: str, case_sensitive: bool = False):
        if (hashtag[0] == '#'):
            hashtag = hashtag[1:]
        keyword = 'text__iregex' if not case_sensitive else 'text__regex'
        value = RE_HASHTAG_FORMAT.format(hashtag)
        return self.filter(**{keyword: value})


class Tweet(models.Model):
    member = models.ForeignKey(
        Member,
        related_name='tweets',
        on_delete=models.CASCADE,
    )
    twitter_tweet_id = models.BigIntegerField(unique=True)
    time = models.DateTimeField()
    text = models.TextField()
    source = models.CharField(max_length=255)
    original_data = JSONField(blank=True, null=True)

    objects = models.Manager.from_queryset(TweetQuerySet)()

    class Meta:
        get_latest_by = 'twitter_tweet_id'
        ordering = ['-twitter_tweet_id']
        indexes = [
            models.Index(fields=['twitter_tweet_id']),
            models.Index(fields=['text']),
            models.Index(fields=['time']),
        ]
