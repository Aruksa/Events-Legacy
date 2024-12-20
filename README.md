# Tech Stack

React, Express.js, Django, PostgreSQL, Elasticsearch, Jest, Selenium, TanStack Query

# Initial Project Showcase

https://www.youtube.com/watch?v=z_Kp-MQ0eeU

# Events Manager Legacy

- Reviewed existing code base & fixed bugs and errors
- Written unit tests for api service using Jest
- Made controller functions **pure** by extracting the database interaction into services that do the actual data handling
- Applied **Single Responsibility Principle** by separating the database queries from the controller functions
- Applied **Open Closed Principle** by isolating the filters of search query so that more filters can be added in the future without changing any existing code.
- Applied client side caching using tanstack query to limit api usage
- End to end authentication test is done using Selenium
- Refactored code to avoid code smell, applied best practices for REST api and architecture

## Django server

- Converted the existing Express server to Django entirely including JWT Token Auth using dj-rest-auth
- CRUD operations and their authorizations are handled accordingly
