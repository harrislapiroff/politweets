Politweets
==========

Better name coming soon. 🤷🏻‍♀️

Development
-----------

To run the development server, you must have [Docker](https://store.docker.com/search?type=edition&offering=community) installed.

From the root of the repo, run:

```bash
docker-compose up
```

This will spin up Postgres, Webpack, and Django services.

You can access the application from your web browser at: http://localhost:8000/

You can connect to the PostgreSQL database at `postgres://politweets:politweets@localhost:15432/politweets`

Getting the Data
----------------

To get data, you will need access to both the ProPublica Congress API and the Twitter API.

* [Request access to the ProPublica Congress API](https://projects.propublica.org/api-docs/congress-api/)
* [Create a Twitter App to get Twitter API credentials](https://developer.twitter.com/en/apps)

Once you have your credentials, you will need an `.env` file in the root of the repository with them. This file is ignored by git to prevent you from publishing your secret keys. You can either create an `.env` file with this format:

```sh
PROPUBLICA_API_KEY='XXXXXXXXXX'
PROPUBLICA_API_BASE='https://api.propublica.org/congress/v1/'

TWITTER_CONSUMER_KEY='XXXXXXXXXX'
TWITTER_CONSUMER_SECRET='XXXXXXXXXX'
TWITTER_ACCESS_TOKEN='XXXXXXXXXX'
TWITTER_ACCESS_TOKEN_SECRET='XXXXXXXXXX'
```

Or you can run this script to run through the automated setup wizard:

```sh
scripts/setup
```

You may need to restart `docker-compose` after creating this file.

With the API credentials in place, run these commands to synchronize data:

```sh
# Sync members of congress to the database
docker-compose exec django pipenv run ./manage.py sync_members
# Sync new tweets to the database
docker-compose exec django pipenv run ./manage.py sync_tweets
```

Production Build
----------------

To build production assets run:

```sh
cd client
npm install
npm run build
```

To force Django to use the production assets, create a file `politweetalyzer/settings_local.py`:

```python
import os


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


WEBPACK_LOADER = {
    'DEFAULT': {
            'BUNDLE_DIR_NAME': '',
            'STATS_FILE': os.path.join(BASE_DIR, 'client', 'dist', 'webpack-stats.build.json'),
        }
}
```

Then run the Django server without the Webpack container:

```sh
docker-compose up django
```

Deployment
----------

We use Heroku's container-based deployment. To run deployment commands, you
must have [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
installed and be logged in to [Heroku's container registry](https://devcenter.heroku.com/articles/container-registry-and-runtime#logging-in-to-the-registry). Then run:

```sh
scripts/deploy
```

This script will:

1. Clear precompiled javascript and CSS out of `/client/dist`
2. Reinstall node dependencies and run webpack to compile production-ready
   javascript and Congress
3. Push a docker image to the Heroku registry
4. Release that docker image to the Heroku app
