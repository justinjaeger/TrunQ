<p align="center"><img src="./assets/trunQiconblack.png" width='135' height='110' style="margin-top: 10px; margin-bottom: -10px;"></p>

#
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/oslabs-beta/trunQ/blob/master/LICENSE)
![AppVeyor](https://img.shields.io/badge/build-passing-brightgreen.svg)
![AppVeyor](https://img.shields.io/badge/version-1.0.2-blue.svg)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/oslabs-beta/trunQ/issues)

# TrunQ-Server Beta
TrunQ-Server is the back half of TrunQ. TrunQ is an open-source NPM package developed by OS-labs providing an easy and intuitive implementation for caching GraphQL responses on the client and/or server side storage.

This package is for server-side caching ONLY. `trunq-server` will only work if `trunq` is also implemented on the client side. Download both `trunq` and `trunq-server` to be able to implement Redis server-side caching.

When full version is released, seperate implementations will be possible.

Developed by Ben Ray, Brian Haller, Gordon Campbell, and Michael Evans.

## Features

TrunQ has been designed to give the developer the most flexible out-of-the-box caching solution for 3rd party APIs or remote servers.

As of now, TrunQ offers:

storage inside sessionStorage for easy client-side caching
an easily configurable Redis database with minimal setup for lightning-fast server-side caching
unique key generation for response data to avoid developer having to tag for cache
partial and exact matching for query fields in the developer's GraphQL API
rebuilding GraphQL queries based on cache to fetch only missing data, lessening data loads
ability to handle and seperately cache multiple queries inside one GraphQL request
an easy toggle to specify caching in Redis, sessionStorage, or both
handling all fetching and subsequent response from GraphQL endpoint with only one line of code in client and four lines in server
Note: TrunQ will not work when implemented directly on a GraphQL server, and only works when querying an external GraphQL endpoint.

## Basic Implementation

### Setup

Download TrunQ-Server from NPM in your terminal with `npm i trunq-server`.

If not on your server, install Redis
- Mac-Homebrew: 
  - in terminal, type `brew install redis`.
  - after installation completes, type `redis-server`. 
  - your server should now have a Redis database connection open.
- Linux/Non-Homebrew:
  - head-over to [redis.io/download](https://redis.io/download)
  - follow cli installation instructions
  - be sure to locate the file path from your project directory to your redis server

Note: at the bottom are helpful articles to trouble-shoot common installation challenges based on your computer's configuration

### Server-side Implementation

We're going to show how to implement TrunQ for server side caching. 

Require in trunq-server NPM package to your server file with `import { TrunQServer } from 'trunq-server'`.

Create an instance of trunq-server and pass in the URI for your graphQL endpoint.

`const trunQ = new TrunQServer(graphQL_API_URL, [redisPort], [cacheExpire]);`

Breakdown of the parameters developers have to supply:
- argument(0) (string) is your external graphQL API URL.
- argument(1) (number) `| Optional` the default provided is configured for Redis' default port.
- argument(2) (number) `| Optional` specify the time in `seconds` you would like redis to store cached data. The current default setting is 600 seconds.

Then place the TrunQ middleware in your Express chain:
- Be sure to construct your client response with trunQ.data

```
app.use('/graphql', trunQ.getAllData, (req, res, next) => {
    res.status(200).json(trunQ.data);
})
```

And that's it for server side implementation as long as your Redis database is up and running!

Note: we are currently not configured to hash any data within the Redis server.

### Application Configuration

We're going to show you how spin up your application with Redis now that it is configured to cache data!

Add a script 'redis-start' to your Package.json:
```
"scripts": {
    "start": "NODE_ENV=production node server/startServer.js",
    "redis-start": "TRUNQ_REDIS=process.env.TRUNQ_REDIS & npm start"
    }
```

Add a .env file to your project and declare a variable TRUNQ_REDIS:
```
TRUNQ_REDIS=[Redis file path]/src/redis-server
```

Note: don't forget to place your .env file into a .gitignore file to not expose your file directory

#### Redis Installation Notes
- [zsh/wget command issues](https://github.com/robbyrussell/oh-my-zsh/issues/7085)
- [invalid active developer path issue](https://apple.stackexchange.com/questions/254380/why-am-i-getting-an-invalid-active-developer-path-when-attempting-to-use-git-a)



#### This is for server-side caching implementation. For client-side caching, download trunq from NPM and follow the README.
