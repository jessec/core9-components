Same stuff as above but using curl instead of httpie to upload an image named "maurizio.png":

Create a database, if not existing yet
curl -u user:password -X PUT -H "Content-Type: application/json" 192.168.59.103:8080/testdb

Create the collection (it must end with ".files" to mark this as a special collection for files)
curl -v -u user:password -X PUT -H "Content-Type: application/json" 192.168.59.103:8080/testdb/mybucket.files

Upload the file (the 'properties' are optional but if missing then the filename will be 'null')
curl -v -u user:password -X POST -F 'properties={"filename":"maurizio.png"}' -F "file=@maurizio.png" 192.168.59.103:8080/testdb/mybucket.files

You will see an HTTP response header like below:

*   Trying 192.168.59.103...
* Connected to 192.168.59.103 (192.168.59.103) port 8080 (#0)
* Server auth using Basic with user 'a'
> POST /testdb/mybucket.files HTTP/1.1
> Authorization: Basic YTph
> User-Agent: curl/7.37.1
> Host: 192.168.59.103:8080
> Accept: */*
> Content-Length: 29324
> Expect: 100-continue
> Content-Type: multipart/form-data; boundary=------------------------895c08ced0e0f00b
> 
< HTTP/1.1 100 Continue
< Content-Length: 0
< HTTP/1.1 201 Created
< Auth-Token-Location: /_authtokens/a
< Location: http://192.168.59.103:8080/testdb/mybucket.files/552e1e89e4b019b2fa790f3f
< Access-Control-Expose-Headers: Location, ETag, Auth-Token, Auth-Token-Valid-Until, Auth-Token-Location
< Date: Wed, 15 Apr 2015 08:17:13 GMT
< Auth-Token: e3a68770-3096-4032-ab86-cf31d3f887da
< Connection: keep-alive
< Access-Control-Allow-Origin: *
< Auth-Token-Valid-Until: 2015-04-15T08:32:13.774Z
< Access-Control-Allow-Credentials: true
< Content-Length: 0
< 
* Connection #0 to host 192.168.59.103 left intact
The following line in the response header gives you the location:
Location: http://192.168.59.103:8080/testdb/mybucket.files/552e1e89e4b019b2fa790f3f

You can GET the HAL representation for the newly created file like this:
curl -u user:password http://192.168.59.103:8080/testdb/mybucket.files/552e1e89e4b019b2fa790f3f

if you GET the above url appending /binary you can dowload the binary content stored into GridFS:
curl -u user:password http://192.168.59.103:8080/testdb/mybucket.files/552e1e89e4b019b2fa790f3f/binary

As explained, the underlying storage mechanism is just plain MongoDB's GridFS, so there aren't file size limits.