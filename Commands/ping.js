module.exports.name="ping";
module.exports.syntax="ping";
module.exports.execute=(msg,args,client)=>{
  let a = new Date();
  msg.reply("Pong").then(sent=>sent.edit("Pong! Latency : "+msg.createdAt-new Date()+" ms."))
}
