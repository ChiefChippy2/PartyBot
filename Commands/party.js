const Discord=require("discord.js")
const fs=require("fs")
const pcommands=new Discord.Collection(fs.readdirSync(__dirname+"/Party").map(x=>{
const p=require(__dirname+"/Party/"+x)
return [p.name,p]

}))
const {parseUser}=require("../Assets/Util.js")
module.exports={
"name":"party",
"aliases":["p","z"],
"guildOnly":true,
"description":"Party Commands",
"syntax":"party <["+fs.readdirSync(__dirname+"/Party").sort().join("|")+"]> <[DiscordUser1]> ...[DiscordUserN]",
"execute":async (msg,args,client)=>{
if(!args[0]){ 
msg.content="/help party"
return client.emit("message",msg)}
try{
//console.log(msg)
let subcom=pcommands.get(args[0])
if(!subcom&&await parseUser(args[1])){ args.unshift("invite");subcom=pcommands.get("invite")};
subcom.execute(msg,args,client,Discord)
}catch(e){console.log(e); msg.reply("Something went wrong uh oh")}

}


}
