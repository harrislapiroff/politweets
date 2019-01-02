import datetime
import math


def congress_session(date: datetime.date) -> int:
    """
    Return the active congress session for a specified date

    The current congress session increases by 1 every other year on January 3rd
    starting in 1788
    """

    if date.month > 1 or date.day >= 3:
        year = date.year
    else:
        year = date.year - 1

    return math.ceil((year - 1788) / 2)


def current_congress_session() -> int:
    "Shortcut to return the current congress session"
    return congress_session(datetime.date.today())
