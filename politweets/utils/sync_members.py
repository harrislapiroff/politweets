import requests
import datetime
from typing import Tuple, Iterable

from politweets.models import Member
from politweets.utils.congress import current_congress_session


parse_date = lambda d: datetime.date(*map(int, d.split('-')))


def update_or_create_member(data: dict, chamber: str) -> Tuple[Member, bool]:
    "Accept Propublica data and update or create a new congress member"

    if data['party'] == 'D':
        party = Member.DEMOCRAT
    elif data['party'] == 'R':
        party = Member.REPUBLICAN
    else:
        party = Member.INDEPENDENT

    current_session = current_congress_session()

    defaults = {
        'propublica_id': data['id'],
        'first_name': data['first_name'],
        'middle_name': data['middle_name'],
        'last_name': data['last_name'],
        'suffix': data['suffix'],
        'date_of_birth': parse_date(data['date_of_birth']),
        'gender': data['gender'],
        'chamber': chamber,
        'party': party,
        'state': data['state'],
        'twitter': data['twitter_account'],
        'session': current_session,
    }
    if 'district' in data:
        defaults['district'] = data['district']

    return Member.objects.update_or_create(
        defaults=defaults,
        propublica_id=data['id'],
        session=current_session,
    )


def sync_members_from_propublica(
    data_url: str,
    authentication_key: str
) -> Iterable[Tuple[Member, bool]]:
    response = requests.get(
        data_url,
        headers={'X-API-Key': authentication_key}
    )
    data = response.json()
    results = data['results'][0]
    chamber = Member.SENATE if results['chamber'] == 'Senate' else Member.HOUSE
    members_data = results['members']

    # Update or create all members returned in the response
    members = map(
        update_or_create_member,
        members_data,
        (chamber,) * len(members_data)
    )

    return members

    # TODO: Handle deactivating absent members
