import factory
from factory.django import DjangoModelFactory

from politweets.models import Tweet, Member


class MemberFactory(DjangoModelFactory):
    propublica_id = 'A000000'
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    gender = '?'
    chamber = Member.SENATE
    party = Member.DEMOCRAT
    state = 'CA'
    twitter = 'twitter'
    session = 115

    class Meta:
        model = Member


class TweetFactory(DjangoModelFactory):
    member = factory.SubFactory(MemberFactory)
    twitter_tweet_id = factory.Sequence(lambda n: n)
    time = factory.Faker(
        'date_time_between',
        start_date='-10y',
        end_date='now'
    )
    text = factory.Faker('text', max_nb_chars=240)
    source = '<a href="http://twitter.com" rel="nofollow">Twitter Web Client</a>'

    class Meta:
        model = Tweet
