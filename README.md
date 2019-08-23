# node-mq-test

## you can configure to queue endpoints in /config/config.js 

``` npm install ```

``` npm start ```


# Publishing to queue message with a post method

``` curl -X POST \
  http://localhost:3000/api/rmq/publish \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 3f173159-71ac-4c22-96f4-f6ed9809feb1' \
  -H 'cache-control: no-cache' \
  -d '{
	"message":"Test RMQ publish message"
}'

```





