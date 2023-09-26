
## How to run
1. Run `npm i --force`
2. Copy `.env.sample` and create `.env` at root folder
3. Run `npm run start:dev`

Note: reason for force is because I am using an old nestjs memory data store. Could not find anything else.

## Below is my thought process

### Modularization
I am using nestjs that works as spring boot framework but for typescript. This framework supports injecting dependencies.

### Logging
I am using Logger module from nestjs to intercept all http request and response. CorrelationId is added as well for tracing purpose in a distributed environment.

### Error Handling
All error is captured and logged then throw back to the root module to be handled automatically by nestjs as a 500 response

### Functionality
GET
Paste in browser url
`http://localhost:3000/api/v1/game`

POST
Open web developer console and paste below code
fetch('http://localhost:3000/api/v1/game', { method: 'POST', headers:{'content-type': 'application/json'}, body: JSON.stringify(
    {
        "id": "6690cf59-79de-445c-b9f7-04b7f1ee7990",
        "start": "2018-10-10T22:00:00.000Z",
        "end": "2018-10-11T01:00:00.000Z",
        "arrive": "2018-10-10T21:30:00.000Z"
    })
});


### Code Style and Quality
Eslint


### Testing
Did not have time to work on this but well ..... Just unit test and integration test. Automation test is a different beast

### Documentation
Did not have time


### Data Validation
Did not have time otherwise I would have implemented middleware at ORM level to check duplicate and such

### Mock Data
```
fetch('http://localhost:3000/api/v1/game', { method: 'POST', headers:{'content-type': 'application/json'}, body: JSON.stringify(
    {
        "id": "6690cf59-79de-445c-b9f7-04b7f1ee7990",
        "start": "2018-10-10T22:00:00.000Z",
        "end": "2018-10-11T01:00:00.000Z",
        "arrive": "2018-10-10T21:30:00.000Z"
    })
});

fetch('http://localhost:3000/api/v1/game/6690cf59-79de-445c-b9f7-04b7f1ee7990/event', { method: 'POST', headers:{'content-type': 'application/json'}, body: JSON.stringify(
    {
        "game_id": "6690cf59-79de-445c-b9f7-04b7f1ee7990",
        "timestamp": "2018-10-10T22:03:56.413Z",
        "data": {
            "code": "pitch",
            "attributes": {
                "advances_count": true,
                "result": "ball_in_play"
            }
        }
    })
});
```