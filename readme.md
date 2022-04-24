# nest-grpc-rxjs-flickr

## flickr-server
Сервер, читающий список изображений из flickr. Настройки подключения к POSTGRES в .env

`npm start`

## flickr-client

Клиент, подключающийся к серверу и читающий grpc-стрим.

`npx nestjs-command tags limit`

Как пример - будут работать параллельно и независимо друг от друга два клиента.

`npx nestjs-command russia 5`

`npx nestjs-command instagram 3`
