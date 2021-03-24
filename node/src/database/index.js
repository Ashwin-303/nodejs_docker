import mysql from 'mysql'
import config from '../config'
class Database {
    constructor() {
        this.DBConnection = mysql.createConnection({
            host: config.DATABASE_SERVER,
            user: config.DATABASE_USER,
            password: config.DATABASE_PASSWORD,
            database: config.DATABASE_NAME,
            multipleStatements: true
        });
    }
    async status() {
        await this.DBConnection.connect((err) => {
            if (!err)
                console.log('Connection Established Successfully');
            else
                console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
        });
    }
}

export default Database
