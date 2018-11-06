from .base import *  # noqa: F403 F401

if DEBUG:  # noqa: 5405
    MIDDLEWARE = MIDDLEWARE + [  # noqa: 5405
        'debug_toolbar.middleware.DebugToolbarMiddleware',
    ]

    INSTALLED_APPS += ['debug_toolbar']  # noqa: 5405

    DEBUG_TOOLBAR_CONFIG = {
        "SHOW_TOOLBAR_CALLBACK" : lambda x: True,  # noqa: E203
    }


# Put any settings overrides in local.py
try:
    from .local import *  # noqa: F403 F401
except ImportError:
    pass
