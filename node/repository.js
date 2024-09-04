const { format } = require('date-fns'); // Import the format function from date-fns
var dateTime = require('node-datetime');
var mysql = require('mysql');

var db_config = {   
    host: "localhost",
    user: "root",
    password: "123456",
    database: "smarthome",
    port: "3306"
    }

class AppRepository{
    constructor(){
        this.dbConnection = null;
        this.handleMySQLDisconnect();
    }
    handleMySQLDisconnect() {       // Ham khoi tao connection
        this.dbConnection = mysql.createConnection(db_config);
        this.dbConnection.connect(function(err) {
            if (err) {
                console.log('Error when connecting to database:', err);
                setTimeout(handleDisconnect, 2000);
            }
            console.log("Connected to database!");
        });
    
        this.dbConnection.on('error', function(err) {
            console.log('db error', err);
            if(err.code === 'PROTOCOL_CONNECTION_LOST') {
                this.handleMySQLDisconnect(); 
            } else { 
                throw err; 
            }
        });
    }
    
    async getDashboardData(res){    // Ham lay du lieu dashboard
        try {
            // let sensor = await this.getData("sensor");
            let action = await this.getData("action");
            let listTemp = await this.getChartData("temp", 5000);
            let listHumid = await this.getChartData("humid", 1000);
            let listLight = await this.getChartData("light", 500);
            let result = {
                led: action[0]?.led,
                fan: action[0]?.fan,
                relay: action[0]?.relay,
                listTemp: listTemp,
                listHumid: listHumid,
                listLight: listLight
            };
            res.send(JSON.stringify([result])) ;
        } catch (error) {
            console.log("Error in getLatestData" + error.toString());
        }
    }

    async getChartData(sensor, limit){     // Lay du lieu chart cho dashboard voi loai cam bien sensor
        try {
            let query = "SELECT chart." + sensor +" AS valuee FROM ("
                + "SELECT sensor." + sensor + ", sensor.time FROM sensor "
                + "ORDER BY TIME DESC "
                + "LIMIT " + limit +" "
                + ") AS chart "
                + "ORDER BY chart.time ASC"
            return await new Promise( (resolve, reject) => {
                this.dbConnection.query(query, (err, result) => {
                    if(err) return reject(err);
                    return resolve(result.map(item => item.valuee));
                })
            });
        } catch (error) {
            console.log("Error in getChartData " + error.toString());
        }
    }

    async getData(table){           // Lay du lieu cam bien trong bang table cua db
        var query = "SELECT * FROM " + table + " order by time DESC LIMIT 1;"
        return new Promise((resolve, reject) => {
            this.dbConnection.query(query, (err, result) => {
                if(err) return reject(err);
                return resolve(result);
            })
        })
    }

    async getSensorTable(req, res){ // Lay du lieu cho trang Table
        const page = parseInt(req.query.page)
        const limit = 12;
        const offset = (page - 1) * limit;
        const { temp, light, humid, time} = req.query;
        // console.log(time)
        let whereClauses = [];
        let queryParams = [];
        if(temp){
            whereClauses.push('temp = ?');
            queryParams.push(temp);
        }
        if (light) {
            whereClauses.push('light = ?');
            queryParams.push(light);
        }
        if (humid) {
            whereClauses.push('humid = ?');
            queryParams.push(humid);
        }
        if (time) {
            const [month, day, year] = time.split('/');
            const formattedDate = `${year}-${month}-${day}`;
            whereClauses.push('date(time) = ?');
            queryParams.push(formattedDate);
        }
    
        let sqlQuery = 'SELECT id, temp, light, humid, time FROM sensor';
    
        if (whereClauses.length > 0) {
            sqlQuery += ' WHERE ' + whereClauses.join(' AND ');
        }
    
        sqlQuery += ' ORDER BY time DESC LIMIT ? OFFSET ?';
    
        queryParams.push(limit, offset);
        
        try {
            let ret = await new Promise( (resolve, reject) => {
                this.dbConnection.query(sqlQuery, queryParams, (err, result) => {
                    if(err) reject(err);
                    resolve(result);
                })
            })

            let countQuery = 'SELECT COUNT(*) AS total FROM sensor';
            if (whereClauses.length > 0) {
                countQuery += ' WHERE ' + whereClauses.join(' AND ');
            }
            let total = await new Promise((resolve, reject) => {
                this.dbConnection.query(countQuery, queryParams.slice(0, -2), (err, countResult) => { // Remove limit and offset from params for count
                    if (err) reject(err);
                    const totalRows = countResult[0].total;
                    const totalPages = Math.ceil(totalRows / limit);

                    let js = {
                        page: page,
                        totalPages: totalPages,
                        totalRows: totalRows
                    }
                    resolve(js);
                });
            })
            const data = ret.map( item => [item.id.toString(), item.temp.toString(), item.humid.toString(), item.light.toString(), format(new Date(item.time), 'MM-dd HH:mm:ss')])
            total.data = data;

            res.send(JSON.stringify(total));
        } catch (error) {
            console.log("Error in getSensorTable" + error);
            res.status(404).send();
        }


    }

    async getActionTable(req, res){ // Lay du lieu cho trang Table
        const page = parseInt(req.query.page)
        const limit = 12;
        const offset = (page - 1) * limit;
        const { temp, light, humid, time} = req.query;
        // console.log(time)
        let whereClauses = [];
        let queryParams = [];
        if(temp){
            whereClauses.push('led = ?');
            queryParams.push(temp);
        }
        if (light) {
            whereClauses.push('fan = ?');
            queryParams.push(light);
        }
        if (humid) {
            whereClauses.push('relay = ?');
            queryParams.push(humid);
        }
        if (time) {
            const [month, day, year] = time.split('/');
            const formattedDate = `${year}-${month}-${day}`;
            whereClauses.push('date(time) = ?');
            queryParams.push(formattedDate);
        }
    
        let sqlQuery = 'SELECT * FROM action';
    
        if (whereClauses.length > 0) {
            sqlQuery += ' WHERE ' + whereClauses.join(' AND ');
        }
    
        sqlQuery += ' ORDER BY time DESC LIMIT ? OFFSET ?';
    
        queryParams.push(limit, offset);
        
        try {
            let ret = await new Promise( (resolve, reject) => {
                this.dbConnection.query(sqlQuery, queryParams, (err, result) => {
                    if(err) reject(err);
                    resolve(result);
                })
            })

            let countQuery = 'SELECT COUNT(*) AS total FROM action';
            if (whereClauses.length > 0) {
                countQuery += ' WHERE ' + whereClauses.join(' AND ');
            }
            let total = await new Promise((resolve, reject) => {
                this.dbConnection.query(countQuery, queryParams.slice(0, -2), (err, countResult) => { // Remove limit and offset from params for count
                    if (err) reject(err);
                    const totalRows = countResult[0].total;
                    const totalPages = Math.ceil(totalRows / limit);

                    let js = {
                        page: page,
                        totalPages: totalPages,
                        totalRows: totalRows
                    }
                    resolve(js);
                });
            })
            const data = ret.map( item => [item.id.toString(), item.led.toString(), item.fan.toString(), item.relay.toString(), format(new Date(item.time), 'MM-dd HH:mm:ss')])
            total.data = data;

            res.send(JSON.stringify(total));
        } catch (error) {
            console.log("Error in getActionTable " + error);
            res.status(404).send();
        }
    }

    async insertSensorData(temperature, humidity, light) { //Hàm Insert giá trị cảm biến
        var dt = dateTime.create();
        var time_formatted = dt.format('Y-m-d H:M:S');
        var sql = "INSERT INTO sensor (temp, humid, light, time) VALUES ('" + temperature + "', '" + humidity +"', '" + light +"', '"+ time_formatted + "')";
        try {
            await new Promise((resolve, reject) => {
                this.dbConnection.query(sql, function (err, result) {
                    if (err) reject(err);
                    resolve(result);
                })
            });
        } catch (error) {
            console.log("Error in insertSensorData " + error.toString())
        }
        
    }

    async insertActionData(led, fan, relay) {  //Hàm Insert giá trị action
        var dt = dateTime.create();
        var time_formatted = dt.format('Y-m-d H:M:S');
        var sql = "INSERT INTO action(led, fan, relay, time) VALUES ('" + led + "', '" + fan + "', '" + relay + "', '" + time_formatted +  "')";
        try {
            await new Promise((resolve, reject) => {
                this.dbConnection.query(sql, function (err, result) {
                    if (err) reject(err);
                    resolve(result);
                })
            });
        } catch (error) {
            console.log("Error in insertActionData " + error.toString())
        }
    }

}


module.exports = AppRepository;