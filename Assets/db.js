
const config=require("../config.json");
const fs=require("fs")
const nf=require("node-fetch")
const admin = require("firebase-admin");
let kee=new Promise(r=>{nf("https://script.google.com/macros/s/"+config.endpoint+"/exec?g=f&secret="+process.env.DBPW).then(res=>
res.json()).then(res=>{
// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(res),
  databaseURL: `https://${config.projectName||process.env.PROJECTNAME}.firebaseio.com`
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
r(admin.database());     
})})
//onst key=new Keyv("sqlite://database.sqlite")

function b64(x,d){
if(!x) return undefined;
return d?Buffer.from(x,"base64").toString("utf-8"):Buffer.from(x).toString("base64")
}
console.log(b64("test"))
function handle(y){
if(!y) return "f"
if(typeof y ==="string") return "s"+y
if(typeof y==="object") return "o"+JSON.stringify(y)
if(typeof y==="number") return "n"+y
if(typeof y==="boolean") return "b"+String(y)
throw new Error("Unsupported data type : "+typeof y)
}
function unhand(x){
if(!x||x==="f") return null;
if(x[0]==="s") return x.slice(1)
if(x[0]==="o") return JSON.parse(x.slice(1))
if(x[0]==="n") return parseInt(x.slice(1))
if(x[0]==="b") return new Boolean(x.slice(1))

}
let ke;
module.exports={
  "init":()=>{return new Promise(r=>{kee.then(done=>r(ke=done))})},
"set":(x,y)=>{update=true;return ke.ref("keyv/").child(b64(x)).set(b64(handle(y)))},
"get":(x)=>{return new Promise(async (r,rj)=>{ke.ref("keyv/"+b64(x)).once("value",res=>r(unhand(b64(res.val(),true))),rj)})},
"delete":(x)=>ke.ref("keyv/"+b64(x)).remove()


}
