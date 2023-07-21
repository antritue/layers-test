# Lambda Layers usage within service

## Description

This repository contains AWS Lambda layers used within our service to share common dependencies and reusable functions across multiple Lambda functions.

## Layers

### 1. Dependencies

The `dependencies` is a Lambda layer that includes common dependencies required by our Lambda functions. It helps us manage and maintain consistent versions of libraries and packages across all functions in the service.

### 2. Utilities

The `utilities` is a Lambda layer that provides a set of shared functions that are frequently used across our Lambda functions. These utility functions help improve code maintainability and reduce duplication.

## Usage

### Folder structure

```markdown
- layers/
  - dependencies/
    - node_modules/
    - package.json
    - package-lock.json
  - utilities
    - node_modules/
      - functionName/
        - index.js
- src/
- .gitignore
```

**Keynotes**

- `dependencies`: install npm packages inside **layers/dependencies/** in order to use shared dependencies and libraries
- `utilities`: put all functions inside **layers/utilities/node_modules/** with function name as the name of the folder
- `.gitignore`: add this line to `.gitignore` to prevent code loss in `utilities` when commiting and pushing code to GitHub

```
!layers/utilities/node_modules/
```

### Define layers in serverless.yml

In your serverless.yml file, define the layers as follows:

```
layers:
  dependencies:
    path: layers/dependencies
    description: "Shared dependencies within service"
  utilities:
    path: layers/utilities
    description: "Shared functions within service"
```

This configuration will create two layers: dependencies and utilities in your service.

### Reference layers in provider

In the provider section of your serverless.yml file, include the layers you defined:

```
provider:
  name: aws
  runtime: nodejs14.x
  region: ap-southeast-1
  environment:
    NODE_PATH: "./:/opt/node_modules"
  layers:
    - !Ref DependenciesLambdaLayer
    - !Ref UtilitiesLambdaLayer
```

To use a layer in the same service, use a CloudFormation `Ref`. The name of your layer in the CloudFormation template will be your layer name TitleCased (without spaces) and have `LambdaLayer` appended to the end

**Additional note**

- If you are using the nodejs14.x runtime, make sure to add the `NODE_PATH` environment variable in the provider section

### Usage in the function

#### Create a reusable function in utilities layer

Create a new file named `index.js` inside the `layers/utilities/node_modules/logging/` directory.

`index.js`

```javascript
module.exports.log = () => {
  return "Logging from layer";
};
```

This will define a simple function named log in the logging module.

#### Use the reusable function in the Lambda function

`src/handler.js`

```javascript
const logging = require("logging");
module.exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: logging.log(),
      },
      null,
      2
    ),
  };
};
```

Import the `logging` module and use the `log` function in the handler Lambda function. The `log` function from the `utilities` layer will be invoked and the message "Logging from layer" will be returned as a response.
