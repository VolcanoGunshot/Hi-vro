//Here the command starts
const config = require("../../config.json");
const Discord = require("discord.js")
module.exports = {
   //definition
	name: "resetsettings", //the name of the command 
	category: "setup", //the category this will be listed at, for the help cmd
	aliases: [""], //every parameter can be an alias
	cooldown: 2, //this will set it to a 2 second cooldown
	usage: "resetsettings", //this is for the help command for EACH cmd
  	description: "Setups the channel setup of the current channel", //the description of the command

	//running the command with the parameters: client, message, args, user, text, prefix
  run: async (client, message, args, user, text, prefix) => {
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("NOT ENOUGH PERMISSIONS!");    

            message.reply( 
                new Discord.MessageEmbed()
                    .setTitle("Successfully resetted the Settings!")
                    .setColor("#ff712e")
                    .setDescription(`Setup a Channel with \`>>setup\` in the Channel`)
                    .setFooter(client.user.username, config.AVATARURL)  
                )
            
                client.settings.set(message.guild.id, {
                  prefix: ">>",
                  channel: "",
                  command: "feedback",
                  approvemsg: "<a:yes:833101995723194437> Accepted Idea! Expect this soon.",
                  denymsg: "<:no:833101993668771842> Thank you for the feedback, but we are not interested in this idea at this time.",
                  maybemsg: "💡 We are thinking about this idea!",
                  statustext: "💡 Waiting for Community Feedback, please vote!",
                  maybemsg: `💡 We are thinking about this idea!`,
                  duplicatemsg: `💢 This is a duplicated Suggestion`,
                  soonmsg: `👌 Expect this Feature Soon!`,
                  footertext: "Want to suggest / Feedback something? Simply type in this channel!",
                  duplicatetext: "This Suggestion is a duplicate!",
                  approveemoji: "833101995723194437",
                  denyemoji: "833101993668771842",
                  role: "",
                });
    }
}
