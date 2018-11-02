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

Getting the Data
----------------

To get data, you will need access to both the ProPublica Congress API and the Twitter API.

* [Request access to the ProPublica Congress API](https://projects.propublica.org/api-docs/congress-api/)
* [Create a Twitter App to get Twitter API credentials](https://developer.twitter.com/en/apps)

Once you have your credentials, create a `.env` file in the root of the repository. This file is ignored by git to prevent you from publishing your secret keys. The `.env` file should look like this:

```sh
PROPUBLICA_API_KEY='XXXXXXXXXX'
PROPUBLICA_API_BASE='https://api.propublica.org/congress/v1/'

TWITTER_CONSUMER_KEY='XXXXXXXXXX'
TWITTER_CONSUMER_SECRET='XXXXXXXXXX'
TWITTER_ACCESS_TOKEN='XXXXXXXXXX'
TWITTER_ACCESS_TOKEN_SECRET='XXXXXXXXXX'
```

You may need to restart `docker-compose` after creating this file.

With the API credentials in place, run these commands to synchronize data:

```sh
# Sync members of congress to the database
docker-compose exec django pipenv run ./manage.py sync_members
# Sync new tweets to the database
docker-compose exec django pipenv run ./manage.py sync_tweets
```
