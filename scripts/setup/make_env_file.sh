echo "ProPublica API key?"
echo -n "> " 
read resp
PP_API_KEY=${resp}

echo "Twitter consumer key?"
echo -n "> " 
read resp
TW_CONSUMER_KEY=${resp}

echo "Twitter consumer secret?"
echo -n "> " 
read resp
TWITTER_CONSUMER_SECRET=${resp}

echo "Twitter access token?"
echo -n "> " 
read resp
TW_ACCESS_TOKEN=${resp}

echo "Twitter access token secret?"
echo -n "> " 
read resp
TW_ACCESS_TOKEN_SECRET=${resp}

echo "PROPUBLICA_API_KEY='${PP_API_KEY}'
PROPUBLICA_API_BASE='https://api.propublica.org/congress/v1/'

TWITTER_CONSUMER_KEY='${TW_CONSUMER_KEY}'
TWITTER_CONSUMER_SECRET='${TWITTER_CONSUMER_SECRET}'
TWITTER_ACCESS_TOKEN='${TW_ACCESS_TOKEN}'
TWITTER_ACCESS_TOKEN_SECRET='${TW_ACCESS_TOKEN_SECRET}'
" > .env