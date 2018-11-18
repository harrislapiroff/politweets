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
        for result in sync_all_tweets(overwrite=options['overwrite']):
            if result.status == SUCCESS:
                self.stdout.write('Synced {} tweets from {} ({})'.format(
                    len(result.tweets),
                    result.member.get_full_name(),
                    result.member.twitter
                ))
            else:
                self.stderr.write('Failed to sync tweets from {} ({}): {} - {}'.format(
                    result.member.get_full_name(),
                    result.member.twitter,
                    result.exception.__class__.__name__,
                    str(result.exception)
                ))

                # If the error is too many requests, bail, to avoid continuing
                # to trigger it
                if result.exception.status_code == 429:
                    self.stderr.write(
                        'Encountered 429 Too Many Requests. Halting sync...'
                    )
                    return

                if result.exception.status_code == 401:
                    self.stderr.write(
                        'Encountered 401 Unauthorized. Are your Twitter API '
                        'credentials correct? Halting sync...'
                    )
                    return
