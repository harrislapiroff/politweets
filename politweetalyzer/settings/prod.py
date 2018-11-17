import os
from .base import *  # noqa: F403 F401


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

DEBUG = os.environ.get('DEBUG', False)

WEBPACK_LOADER = {
    'DEFAULT': {
            'BUNDLE_DIR_NAME': '',
            'STATS_FILE': os.path.join(BASE_DIR, 'client', 'dist', 'webpack-stats.build.json'),
        }
}

STATIC_ROOT = os.path.join(BASE_DIR, '/static/')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MIDDLEWARE = MIDDLEWARE[0:1] + [  # noqa: F405
    'whitenoise.middleware.WhiteNoiseMiddleware',
] + MIDDLEWARE[1:]  # noqa: F405

# 24 hour caching
WHITENOISE_MAX_AGE = 86400
