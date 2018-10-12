from django.core.management.base import BaseCommand, CommandError
from django.conf import settings

from politweets.utils.sync_members import sync_members_from_propublica


class Command(BaseCommand):
    help = 'Sync congress members from the ProPublica Congress API'

    def add_arguments(self, parser):
        parser.add_argument(
            '--api-base',
            nargs='?',
            default=settings.PROPUBLICA_API_BASE
        )
        parser.add_argument(
            '--api-key',
            nargs='?',
            default=settings.PROPUBLICA_API_KEY
        )

    def handle(self, *args, **options):
        api_base = options['api_base']
        api_key = options['api_key']

        senators = sync_members_from_propublica(
            '{}{}'.format(api_base, '115/senate/members.json'),
            api_key
        )
        representatives = sync_members_from_propublica(
            '{}{}'.format(api_base, '115/house/members.json'),
            api_key
        )

        new_senators = list(filter(lambda x: x[1] == True, senators))
        new_representatives = list(filter(lambda x: x[1] == True, representatives))
        up_senators = list(filter(lambda x: x[1] == False, senators))
        up_representatives = list(filter(lambda x: x[1] == False, representatives))

        self.stdout.write('Synced:')
        self.stdout.write(
            '- {} new senators'.format(len(new_senators))
        )
        self.stdout.write(
            '- {} new representatives'.format(len(new_representatives))
        )
        self.stdout.write(
            '- {} updated senators'.format(len(up_senators))
        )
        self.stdout.write(
            '- {} updated representatives'.format(len(up_representatives))
        )
