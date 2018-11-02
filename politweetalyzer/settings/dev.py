from .base import *  # noqa: F403 F401

# Put any settings overrides in settings_local.py
try:
    from .local import *  # noqa: F403 F401
except ImportError:
    pass
