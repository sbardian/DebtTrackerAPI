## DEBT TRACKER:

nodemon dist/server/index.js --session-secret 'shit sandwich dawg'
--database-url 'mongodb://localhost/DeptTracker'

nodemon dist/server/index.js

DT_SESSION_SECRET='shit sandwich dawg' DT_TEST=true yarn run test
DT_SESSION_SECRET='shit sandwich dawg' DT_TEST=true yarn run test:watch

DT_SESSION_SECRET='shit sandwich dawg'
DT_DATABASE_URL='mongodb://localhost/DeptTracker' DT_TEST=true yarn run test
