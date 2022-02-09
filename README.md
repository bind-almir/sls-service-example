## Getting Started

Execute  `./work-offline` to setup and run local environment. Local instance of dynamodb is running in the container. 

execute `sls deploy` to deploy your serverless application. Note that before deploying, you need to run `npm i` to install dependencies. Default stage is `dev`. If you want to deploy to a different stage or a region, you can specify them as an arguments i.e. `sls deploy --stage prod --region us-west-2`.
