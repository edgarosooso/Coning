import sql from "mssql";

const dbSetting = {
    user: "con",
    password: "ConIng2429*",
    //server: "181.129.59.85",
    server : "localhost",
    database: "CONING",
    options: {
        trustedconnection: false,
        enableArithAbort: false,
        //instancename: <nombre de instaancia> 
        encrypt: false, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}


export async function getConnection() {
    try {
        const pool = await sql.connect(dbSetting)

        // const result = await pool.request().query("select * from jugadores WHERE nombre = 'eli' and password = '1234'");
        // console.log(result.recordset), 1
        // sql.close();

        return pool;
    } catch (error) {
        console.log(error.message);
    }
}

export { sql }; // la exporto para que otros modulos la utilizen

getConnection();
