import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


WEBPACK_LOADER = {
    'DEFAULT': {
            'BUNDLE_DIR_NAME': '',
            'STATS_FILE': os.path.join(BASE_DIR, 'client', 'dist', 'webpack-stats.build.json'),
        }
}
