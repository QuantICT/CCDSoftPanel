#!/usr/bin/env node
require('dotenv').config();
const mysql = require('mysql');
const fs = require('fs');

setInterval(queryDb, 5000);

function queryDb() {
  const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DP_PASSWORD,
    database: process.env.DB_DB,
  });

  con.connect((err) => {
    if (err) {
      console.log('Error connecting to the database');
      return;
    }
    console.log('Connected to database');
  });

  con.query('SELECT * FROM agents ORDER BY extension ASC', (err, rows) => {
    if (err) throw err;
    var obj = {};
    var key = 'agents';
    obj[key] = [];
    for (let i = 0; i < rows.length; i++) {
      var agent = {
        name: rows[i].name,
        extension: rows[i].extension,
        station: rows[i].station,
        loggedOn: rows[i].logged_on,
        pg: rows[i].pg,
        state: rows[i].state,
        withdrawal: rows[i].withdrawal,
        dynamicState: rows[i].dynamic_state,
        office: rows[i].office,
      };
      console.log('Agent Name ' + agent.name);
      console.log('Agent Office' + agent.office);
      obj[key].push(agent);
    }
    fs.writeFile('/home/sdeferme/ccd/db.json', JSON.stringify(obj), function (err) {
      if (err) throw err;
      console.log('File saved!');
    });
  });

  con.end((err) => {
    // The connection is terminated gracefully
    // Ensures all remaining queries are executed
    // Then sends a quit packet to the MySQL server.
    console.log('Disconnected from database');
  });
}
