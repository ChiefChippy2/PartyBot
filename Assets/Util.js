let CLient=""
module.exports={
async parseUser(userResolvable,channel){
Client=channel.client
const guild=channel.guild
let user="";
//if user is a mention or id
let id=userResolvable.match(/[0-9]{17,19}/g);
if(id) user=Client.users.fetch(id);
try{return await user;}catch(e){}
user=Client.users.cache.find(x=>x.name.toLowerCase()===userResolvable.toLowerCase())
if(user) return user;
//if user is an uncached name
if(guild){
try{
user=await guild.members.fetch({query:userResolvable,limit:1});
return user.user;
}catch(e){}
}
//meh 
throw new Error("Not Found");
}





}
