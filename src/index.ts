import express from "express";
import {exec} from "child_process";
import outletJson from "../outlets.json";

const ping = require ("net-ping");
const wol = require('wakeonlan');

const app = express();
require('dotenv').config()
const session = ping.createSession ();
// default port to listen
const port = (process.env.PORT);
const outlets = outletJson.outlets;

type Outlet = {
    systemCode: string,
	unitCode: string,
	status:  number
}

app.use(express.static('public'));
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

app.get("/funkAn", (reg,res) =>{
    const specifiedOutlet = getOutlet(reg);
    if(specifiedOutlet === undefined){
        res.send("not found");
        return;
    }

    specifiedOutlet.status = 1;
    sendOutletCommand(specifiedOutlet)

    res.send("funk ist an");
});


function getOutlet(reg: any){
    const systemCode: string = String(reg.query.systemCode);
    const unitCode: string = String(reg.query.unitCode);
    return outlets.find(outlet => outlet.systemCode === systemCode && outlet.unitCode === unitCode);
}

function sendOutletCommand(specifiedOutlet: Outlet){
    exec(`${process.env.sendPath} ${specifiedOutlet.systemCode} ${specifiedOutlet.unitCode} ${specifiedOutlet.status}`, (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          return;
        }
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
}

app.get("/funkOff", (reg,res) =>{




    const specifiedOutlet = getOutlet(reg);
    if(specifiedOutlet === undefined){
        res.send("not found");
        return;
    }

    specifiedOutlet.status = 0;
    sendOutletCommand(specifiedOutlet)

    res.send("funk ist aus");
});

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