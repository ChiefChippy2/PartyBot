const db=require("./db.js")
const perms=require("./Perms/perms.json")
module.exports={
async partyCreate(owner,guild){
let tasks=[];

/*then create the channel*/
const prefs=await db.get("GUILDPREF"+guild.id)
tasks.push(guild.channels.create(owner.username+"'s Party",{parent:prefs?prefs.partyChannel:undefined,type:"text",permissionOverwrites:[
{
id:guild.id,
deny:["VIEW_CHANNEL"]
},
{
id:owner,
allow:["VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES","ADD_REACTIONS","USE_EXTERNAL_EMOJIS","EMBED_LINKS","ATTACH_FILES"]
},
  {
id:guild.me.id,
allow:["VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES","ADD_REACTIONS","USE_EXTERNAL_EMOJIS","EMBED_LINKS","ATTACH_FILES"]
},
]
}))
tasks.push(guild.channels.create(owner.username+"'s Party VC",{parent:prefs?prefs.partyChannel:undefined,type:"voice",permissionOverwrites:[
{
id:guild.id,
deny:["VIEW_CHANNEL"]
},
{
id:owner,
allow:66061568/*View Channel,Connect,Mute Members,Move Members,Speak,Deafen Members,Use Voice Activity,Priority Speaker*/
},
  {
id:guild.me.id,
allow:66061568/*View Channel,Connect,Mute Members,Move Members,Speak,Deafen Members,Use Voice Activity,Priority Speaker*/
},
]
}))
let chs=await Promise.all(tasks)
console.log("P created");
/*register party*/
await db.set("PARTY"+owner.id,{"guild":guild.id,"channels":chs.map(x=>x.id),"id":owner.id});
  await db.set("PARTYINFO"+owner.id,{"guild":guild.id,"channels":chs.map(x=>x.id),"id":owner.id,"role":"owner"});
await chs[0].send(owner.toString()+", here is your party channel!")
return await db.get("PARTYINFO"+owner.id)

},
async partyAdd(user,partyid,guild){
const party=await db.get("PARTY"+partyid)
if(!party) throw new Error("Party Not Found.");
if(await module.exports.isAdmin(user,party)) throw new Error("Missing Perms.");
/*now party is found, add user to it*/
await Promise.all(party.channels.map(x=>guild.channels.cache.get(x)).map(x=>x.createOverwrite(user,perms.member,"Party Invite")))
party.role="member";
await db.set("PARTYINFO"+user.id,party)
return user

},
async partyKick(user,partyid,guild,oid){
const party=await db.get("PARTY"+partyid)
if(!party) throw new Error("Party Not Found.");
if(oid!==party.id&&await module.exports.isAdmin(user,party)) throw new Error("Missing Perms.");
/*now party is found, remove user from it*/
await Promise.all(party.channels.map(x=>guild.channels.cache.get(x)).map(x=>x.updateOverwrite(user,{"VIEW_CHANNEL":false},"Party Kick")))
await db.delete("PARTYINFO"+user.id)
return user

},
  async isAdmin(user){
  const party=db.get("PARTYINFO"+user.id)
  return !party&&party.role!=="member";
  
  
  }, 
async partyDisband(partyid,guild) {
const party=await db.get("PARTY"+partyid)
if(!party) throw new Error("Party Not Found.");
//grab all users first
await Promise.all(guild.channels.cache.get(party.channels[0]).permissionOverwrites.map(x=>db.delete("PARTYINFO"+x.id)))
await Promise.all(party.channels.map(x=>guild.channels.cache.get(x)).map(x=>x.delete()))
await db.delete("PARTY"+partyid)
return partyid
},
  async partyEmpty(chan){
    return (chan.permissionOverwrites.size===0)
  }



}
