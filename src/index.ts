import express from "express"
const wol = require('wakeonlan')
const app = express();
const port = process.env.port || 8080;
const ping = require ("net-ping");
const session = ping.createSession ();
require('dotenv').config() // default port to listen

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
    console.log(process.env.MAC_ADDRESS_OF_PC_TO_MANIPULATE);
    console.log(process.env.IP_ADDRESS_OF_PC_TO_MANIPULATE);


} );

app.get("/pc_an", (req, res) => {
    wol(`${process.env.MAC_ADDRESS_OF_PC_TO_MANIPULATE}`).then(() => {
        console.log('wol sent!')
        res.send( "WOL send ")
      })

})

app.get("/pc_status", (req, res) => {
    session.pingHost (`${process.env.IP_ADDRESS_OF_PC_TO_TURN_ON}`,(error: any, target: any) =>{
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