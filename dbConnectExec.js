const sql = require('mssql')
const mcvayConfig = require('./config.js')

const config = {
    user: mcvayConfig.DB.user,
    password: mcvayConfig.DB.password,
    server: mcvayConfig.DB.server, 
    database: mcvayConfig.DB.database,
}

async function executeQuery(aQuery){
    var connection = await sql.connect(config)
    var result = await connection.query(aQuery)
       
    return result.recordset
    // console.log(result)   
}

module.exports = {executeQuery: executeQuery}
// executeQuery(`SELECT *
//     FROM book
//     LEFT JOIN genre
//     ON genre.GenrePK = book.GenreFK`)