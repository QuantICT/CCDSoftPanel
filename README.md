# CCDSoftPanel
CCD Agents status display

## Components

### java/src
- fetch Agent properties from OXE
- write Agent properties to database

### nodejs/src/app.js
- read Agent properties from the mysql database
- mysql result to db.json file

### json-server (embedded)
- installed on server
- serve db.json file (GET)
- startup command: `/usr/bin/json-server --watch /home/user/ccd/db.json --port 3007 --host 1<ip-address>`

### public/js/index.js
- GET db.json
- add content to public/index.html


