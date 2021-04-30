import express from "express"
const wol = require('wakeonlan')
const app = express();

const ping = require ("net-ping");
const session = ping.createSession ();
require('dotenv').config() // default port to listen
const port = 8081;
// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
    console.log(process.env.MAC_ADDRESS_OF_PC_TO_MANIPULATE);
    console.log(process.env.IP_ADDRESS_OF_PC_TO_MANIPULATE);


} );

app.get("/pc_an", async (req, res) => {
    try{
        const success = await wol(`${process.env.MAC_ADDRESS_OF_PC_TO_MANIPULATE}`)
        res.send("WOL send");
    }
    catch(err){
        console.log(err);
        res.send("WOL failed: " + err);
    }


})

app.get("/pc_status", (req, res) => {
    session.pingHost (`${process.env.IP_ADDRESS_OF_PC_TO_MANIPULATE}`,(error: any, target: any) =>{
        if (error){
            res.send("0");
            console.log(error);
        }

        else
            res.send("1");
    });
})

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
});