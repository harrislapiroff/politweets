import os
from .base import *  # noqa: F403 F401


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DEBUG = False

WEBPACK_LOADER = {
    'DEFAULT': {
            'BUNDLE_DIR_NAME': '',
            'STATS_FILE': os.path.join(BASE_DIR, 'client', 'dist', 'webpack-stats.build.json'),
        }
}
