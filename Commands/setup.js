const db=require("../Assets/db.js")
module.exports={
"name":"setup",
"aliases":["s","config"],
"cooldown":"1/15",
"guildOnly":true,
"description:"Sets up the server preferences",
async execute(message,args){
  if(!message.member.hasPermission("MANAGE_SERVER")) return msg.reply("You can't run setup for server because you do not have MANAGE_SERVER perms.")
  msg.channel.send("Ok, setup starting... this will be quite brief")
  let resp=await question("Would you like parties to be in a certain category? If not, say NONE. If yes, mention/name the channel or say "NEW" to create a new category for it.",msg.channel,msg.author)
  if(!resp.success) return;
  await setChan(resp.first(),msg)
  let ev=await question("Would you like to disable common prefix `/` (maybe conflicting prefixes)? Type Y or N.",msg.channel,msg.author)
  await if(!ev.success) return;
  setNoS(["yes","no"].some(x=>x.startsWith(ev.first().content.toLowerCase())||x===ev.first().content.toLowerCase()),msg)
  msg.channel.send("All set, tysm!")


}


}

async function quesetion(q,channel,target,options){
try{
options={...({"max":1,"time":60000,"errors":["time"]}),...options}
filter=(msg)=>target.id===msg.author.id
await channel.send(q)
let resps=await channel.awaitMessages(filter,options)
return {"success":true,"msg":resps}

}catch(e){
return {"success":false,"msg":"Timeout"}
}
}
async function setChan(resp,msg){
const chann=resp.content==="NEW"?await msg.guild.channels.create("Parties",{type:"category"}):(resp.mentions.roles.first()||msg.guild.channels.cache.get(resp.content)||msg.guild.channels.cache.find(x=>x.name.toLowerCase()===resp.content&&x.type==="category"))
if(!chann||chann.type!=="category") return "Invalid Category."
await db.set("GUILDPREFS"+guild.id,{partyChannel:chann.id})
return "Done"

}
