const {parseUser}= require("./Assets/Util.js")
const {partyAdd,partyCreate}=require("./Assets/Party.js")
const db=require("./Assets/db.js")

module.exports={
name:"invite",
execute(msg,args,client,Discord){
Promise.all(args.map(x=>parseUser(x,msg.channel))).then(async users=>{
const party=await db.get("PARTYINFO"+msg.author.id);
if(!party) await partyCreate(msg.author,msg.guild);
if(!["owner","admin"].includes(party.role)) return msg.reply("You can't invite people to join the party you are in because you are not the owner or an admin of the party");
if(users.every(x=>!x)) return msg.reply("All invalid users. PLease @mention them, give their ID, or type their entire username.")
users=users.filter(x=>x)
let partyAdds=users.each(x=>partyAdd(x,party.id,msg.guild))
Promise.all(partyAdds).then(suc=>{
msg.reply("Successfully added "+suc.map(x=>x.username).slice(0,4).join(", ")+(suc.length>5?" and **"+suc.length-5+"** more people":"")+" to the party! Time to party!")
}).catch(e=>msg.reply("Error whilst adding users to party. Some or all of them might not be in the party."))


}).catch(e=>msg.reply("Error ."))
}







}
