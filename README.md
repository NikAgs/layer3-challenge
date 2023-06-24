# Layer3 Challenge

Hey Layer3 team! 👋

This is my solution to the take home assignment. I have to admit I haven't worked with Typescript or Postgres in a while but was able to rely on support docs and stackoverflow to put this together.

## Environment
I hosted a local Postgres instance on my desktop and created the tables + sample rows using pgAdmin. Please note, you'll need to populate the .env variables with db configurations to connect.

I spun up a typescript/express api using node.js and ran a local dev server to test it out. I created a Postman collection to send the requests to the server.

## The Solution
I created 3 endpoints:
- api/quests/popular
- api/quests/mostPaid
- api/users/[id]/totalRewarded

All endpoints use simple SQL join queries to get data and return it. However, the users endpoint can also convert ETH to USD using coingecko's public api. Here, I opted to use the conversion rate of the most recent quest completion instead of converting on each date because of API limitations. If I were confident the API wouldn't throttle us, I would convert each quest completion earnings to USD and add them up.

I haven't written unit tests, but would added some basic error handling and smoke tested everything locally. If we were launching this to production and customers depended on it, I would create a simple test suite and seek 100% code coverage.

## Deployment/Scaling
There's a lot of service providers that host an express api like this. I would recommend Vercel because it integrates easily with CI/CD and can handle layer3's user traffic.

We would also want to ensure that our Postgres instance can handle the extra reads.
