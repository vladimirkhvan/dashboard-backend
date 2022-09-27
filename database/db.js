import mysql from 'mysql';

export let db;

const db_config = {
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'bf12b8de10a36e',
    password: '0e2e857c',
    database: 'heroku_bc558aeaefc8cb6',
};

try {
    db = mysql.createConnection(db_config);
} catch (error) {
    console.log('cannot connect db');
}
