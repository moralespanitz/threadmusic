# 🖥️ Auth
Backend service for ThreadMusic

:hammer: To-dos
----
The following tasks are necessary to complete the ThreadMusic backend. Please follow Test-Driven Development to increase efficiency. Every scheme should be incorporated in the `docs` folder.

### How to run

```bash
$ docker-compose up --build -d
$ docker-compose logs -f
$ docker-compose down
```


### Auth System
- [x] **Authentication**: Users can authenticate with Clerk (Google, LinkedIn, Microsoft).
- [x] **Authorization**: Users can restrict specific endpoints with rules.