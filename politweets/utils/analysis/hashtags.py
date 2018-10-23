from collections import Counter
import re
from typing import TYPE_CHECKING, Tuple, Iterable

if TYPE_CHECKING:
    from django.db.models import QuerySet  # noqa F401


RE_HASHTAG = r'\B#\w*[a-zA-Z]+\w*'


def hashtag_counts(tweets: 'QuerySet') -> Iterable[Tuple[str, int]]:
    corpus = '\n'.join(tweets.values_list('text', flat=True))
    hashtags = re.findall(RE_HASHTAG, corpus)

    counter = Counter(map(str.lower, hashtags))

    # Get the most common capitalization of each hashtag
    for hashtag, count in counter.most_common():
        capitalizations = filter(lambda x: x.lower() == hashtag, hashtags)
        capitalization_counter = Counter(capitalizations)
        yield (
            capitalization_counter.most_common(1)[0][0],
            count
        )
