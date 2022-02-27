//Modules
const Discord = require("discord.js");
const { Client, Collection } = require("discord.js");
const config = require("./config.json"); //loading config file with token and prefix
const Disbut = require("discord-buttons");
const fs = require("fs"); //this package is for reading files and getting their inputs
const client = new Client({
  messageCacheLifetime: 1,
  fetchAllMembers: false,
  messageCacheMaxSize: 1,
  shards: "auto",
  disableEveryone: true,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
}); //creating the client with partials, so you can fetch OLD messages
//the Buttons Client extender
Disbut(client);
const Enmap = require("enmap");

client.commands = new Collection(); //an collection (like a digital map(database)) for all your commands
client.aliases = new Collection(); //an collection for all your command-aliases
const cooldowns = new Collection(); //an collection for cooldown commands of each user

client.settings = new Enmap({ name: "settings" }); 
client.suggestionsDb  = new Enmap({ name: "suggestionsDb" });
client.categories = fs.readdirSync("./commands/"); //categories 

["command"].forEach(handler => {
    require(`./handlers/command`)(client);
}); //this is for command loading in the handler file, one fireing for each cmd
const eventhandler = require("./handlers/events"); 
eventhandler(client); //this is for event handling  




const suggest = require("./modules/suggest")
suggest(client)
/*
client.on("ready", () => {
  client.guilds.cache.each(g=>{
    client.settings.ensure(g.id, {
      prefix: ">>",
      channel: "",
      command: "feedback",
      approvemsg: "✅ Accepted Idea! Expect this soon.",
      denymsg: "❌ Thank you for the feedback, but we are not interested in this idea at this time.",
      maybemsg: "💢 We are thinking about this idea!",
      statustext: "💢 Waiting for Community Feedback, please vote!",
      footertext: "Want to suggest / Feedback something? Simply type in this channel!",
      approveemoji: "✅",
      denyemoji: "❌",
      role: "",
      });
    if(client.settings.set(g.id, client.settings.get(g.id, "maybemsg").replace("<:suggest:778599541812363276>", "💢"), "maybemsg"))
    if(client.settings.set(g.id, client.settings.get(g.id, "statustext").replace("<:suggest:778599541812363276>", "💢"), "statustext"))
    client.settings.set(g.id, "✅", "approveemoji")
    client.settings.set(g.id, "❌", "denyemoji")
  })
})*/
//fires each time the bot receives a message
client.on("message", async message => {

    if (message.author.bot) return;// if the message  author is a bot, return aka ignore the inputs
    if (!message.guild) return; //if the message is not in a guild (aka in dms), return aka ignore the inputs

    client.settings.ensure(message.guild.id, {
      prefix: ">>",
      channel: "",
      command: "feedback",
      approvemsg: "<a:yes:833101995723194437> Accepted Idea! Expect this soon.",
      denymsg: "<:no:833101993668771842>  Thank you for the feedback, but we are not interested in this idea at this time.",
      maybemsg: "💡 We are thinking about this idea!",
      statustext: "💡 Waiting for Community Feedback, please vote!",
      footertext: "Want to suggest / Feedback something? Simply type in this channel!",
      duplicatetext: "This Suggestion is a duplicate!",
      approveemoji: "833101995723194437",
      denyemoji: "833101993668771842",
      role: "",
    });


    let prefix = client.settings.get(message.guild.id, `prefix`);
    
    //CHECK IF IN A BOT CHANNEL OR NOT
    if(!message.content.startsWith(prefix)&& message.content.startsWith(client.user.id)) message.reply(`My Prefix is: **\`${prefix}\`**, tpye \`${prefix}help\` for more information!`); //if the messages is not a command and someone tags the bot, then send an info msg
    if (!message.content.startsWith(prefix)) return; //if the message does not starts with the prefix, return, so only commands are fired!
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g); //creating the argumest (each space == 1 arg)
    const cmd = args.shift().toLowerCase(); //creating the cmd argument by shifting the args by 1
    
    if(!message.content.startsWith(prefix) || cmd.length === 0) return;
    if (message.content.includes(client.user.id)) { //if message contains musicium as a ping
       return message.reply(new Discord.MessageEmbed().setColor("#ff712e").setAuthor(`${message.author.username}, My Prefix is ${prefix}, to get started; type ${prefix}help`, message.author.displayAvatarURL({ dynamic: true }), "https://su.musicium.eu"));
    }
    
    let command = client.commands.get(cmd); //get the command from the collection
    if (!command) command = client.commands.get(client.aliases.get(cmd)); //if the command does not exist, try to get it by his alias

   
    if (command) //if the command is now valid
    {
        if (!cooldowns.has(command.name)) { //if its not in the cooldown, set it too there
            cooldowns.set(command.name, new Collection());
        }
        
        const now = Date.now(); //get the current time
        const timestamps = cooldowns.get(command.name); //get the timestamp of the last used commands
        const cooldownAmount = (command.cooldown || 1) * 1000; //get the cooldownamount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
      
        if (timestamps.has(message.author.id)) { //if the user is on cooldown
          const expirationTime = timestamps.get(message.author.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
      
          if (now < expirationTime) { //if he is still on cooldonw
            const timeLeft = (expirationTime - now) / 1000; //get the lefttime
            return message.reply( 
              `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
            ); //send an information message
          }
        }
      
        timestamps.set(message.author.id, now); //if he is not on cooldown, set it to the cooldown
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); //set a timeout function with the cooldown, so it gets deleted later on again
      try{
        command.run(client, message, args, message.author, args.join(" "), prefix); //run the command with the parameters:  client, message, args, user, text, prefix, 
        /* /////////////////////////////////////////
        HERE AN EXAMPLE:

            User: Tomato#6966   types command:

                !say Hello World, HEY!

                what you can get from say cmd parameters: 
                    client is: the <DiscordClient>
                    message is: the <Message>
                    user is: the <DiscordUser>
                    text is: <everything fter the command:   Hello World, HEY!>
                    prefix is: <config.PREFIX:   !>
        */ ///////////////////////////////////////////////////////
      }catch (error){
        console.log(error)
        return message.reply("Something went wrong while, running the: `" + command.name + "` command")
      }
    } 
    else //if the command is not found send an info msg
    return message.reply(`Unkown command, try: **\`${prefix}help\`**`)
    
});



client.login(config.TOKEN); //login into the bot