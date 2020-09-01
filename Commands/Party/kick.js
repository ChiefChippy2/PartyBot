const db=require("../../Assets/db.js")
const {parseUser}= require("../../Assets/Util.js")
const {partyKick,partyDisband,partyEmpty}=require("../../Assets/Party.js")
module.exports={
name:"kick",
aliases:["remove","r","k"],
async execute(msg,args,client,discord){
  Promise.all(args.map(x=>parseUser(x,msg.channel))).then(async users=>{
const pinfo=await db.get("PARTYINFO"+msg.author.id)
if(!pinfo) return msg.reply("User not in party.");
if(!["owner","admin"].includes(pinfo.role)) return msg.reply("You can't kick people from the party you are in because you are not the owner or an admin of the party");
if(users.every(x=>!x)) return msg.reply("All invalid users. PLease @mention them, give their ID, or type their entire username.")
users=users.filter(x=>x)
let partyKicks=users.each(x=>partyKick(x,party.id,msg.guild,msg.author.id))
Promise.all(partyKicks).then(suc=>{
if(await partyEmpty(party.id)) return partyDisband(party.id,msg.guild)
msg.reply("Successfully removed "+suc.map(x=>x.username).slice(0,4).join(", ")+(suc.length>5?" and **"+suc.length-5+"** more people":"")+" from the party!")
}).catch(e=>msg.reply("Error whilst adding users to party. Some or all of them might not be in the party. Error : "+e))


}).catch(e=>msg.reply("Error."))

}




}
