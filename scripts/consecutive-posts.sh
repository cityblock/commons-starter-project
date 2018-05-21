AUTHTOKEN='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiZmE1ZTkyNS01ZWYxLTQ5NGQtYjNjNi00NTE5MTYxZDMyNDQiLCJwZXJtaXNzaW9ucyI6ImdyZWVuIiwibGFzdExvZ2luQXQiOiIyMDE4LTA1LTIxVDE2OjEzOjA1LjA2MloiLCJpYXQiOjE1MjY5MTkxODUsImV4cCI6MTUyNzAwNTU4NX0.KZFJqO2wLRwwvC61hjqz-9DNG9Zm1DTtgwsR5MkpfyQ'
URL='localhost:3000'
QUERY='{"foo": "bar"}'

curl -H "authToken: $AUTHTOKEN" -H 'Content-Type: application/json; charset=utf-8' -d "$QUERY" -X POST "$URL/graphql"
pidlist="$pidlist $!"
curl -H "authToken: $AUTHTOKEN" -H 'Content-Type: application/json; charset=utf-8' -d "$QUERY" -X POST "$URL/graphql"
pidlist="$pidlist $!"
curl -H "authToken: $AUTHTOKEN" -H 'Content-Type: application/json; charset=utf-8' -d "$QUERY" -X POST "$URL/graphql"
pidlist="$pidlist $!"
curl -H "authToken: $AUTHTOKEN" -H 'Content-Type: application/json; charset=utf-8' -d "$QUERY" -X POST "$URL/graphql"
pidlist="$pidlist $!"
curl -H "authToken: $AUTHTOKEN" -H 'Content-Type: application/json; charset=utf-8' -d "$QUERY" -X POST "$URL/graphql"
pidlist="$pidlist $!"
curl -H "authToken: $AUTHTOKEN" -H 'Content-Type: application/json; charset=utf-8' -d "$QUERY" -X POST "$URL/graphql"
pidlist="$pidlist $!"
curl -H "authToken: $AUTHTOKEN" -H 'Content-Type: application/json; charset=utf-8' -d "$QUERY" -X POST "$URL/graphql"
pidlist="$pidlist $!"

for job in $pidlist; do
  echo $job
  wait $job || let "FAIL+=1"
done

if [ "$FAIL" == "0" ]; then
  echo "YAY!"
else
  echo "FAIL! ($FAIL)"
fi