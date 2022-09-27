import mysql from 'mysql';

export const db = mysql.createConnection({
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'bf12b8de10a36e',
    password: '0e2e857c',
    database: 'heroku_bc558aeaefc8cb6',
});
