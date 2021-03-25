##
## testing api
## php -S localhost:4000

#
# create element
curl -v -H "Content-Type: application/json" --data @artist.json http://localhost:4000/artist

#
# list all
curl -v -H "Content-Type: application/json"  http://localhost:4000/artist

#
# update one
curl -X PUT -v -H "Content-Type: application/json" --data @artist.json http://localhost:4000/artist/1

#
# get one
curl -v -H "Content-Type: application/json"  http://localhost:4000/artist/1
