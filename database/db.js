import mysql from 'mysql';

export let db;

const db_config = {
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'bf12b8de10a36e',
    password: '0e2e857c',
    database: 'heroku_bc558aeaefc8cb6',
};

function handleDisconnect() {
    db = mysql.createConnection(db_config);

    db.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    })
    
    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect()
        }
    });
}

handleDisconnect();
