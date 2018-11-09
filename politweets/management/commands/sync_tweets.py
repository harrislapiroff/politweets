from django.core.management.base import BaseCommand

from politweets.utils.sync_tweets import sync_all_tweets, SUCCESS


class Command(BaseCommand):
    help = 'Sync tweets from the Twitter API'

    def add_arguments(self, parser):
        parser.add_argument(
            '--overwrite', '-O',
            action='store_true',
            dest='overwrite',
            default=False
        )

    def handle(self, *args, **options):
        for status, member, result in sync_all_tweets(overwrite=True):
            if status == SUCCESS:
                self.stdout.write('Synced {} tweets from {} ({})'.format(
                    len(result),
                    member.get_full_name(),
                    member.twitter
                ))
            else:
                self.stderr.write('Failed to sync tweets from {} ({}): {} - {}'.format(
                    member.get_full_name(),
                    member.twitter,
                    result.__class__.__name__,
                    str(result)
                ))
