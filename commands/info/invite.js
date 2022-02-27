//Here the command starts
const Discord = require("discord.js")
const config = require("../../config.json");
const { MessageButton } = require('discord-buttons')
const { MessageEmbed } = require("discord.js")
module.exports = {
  name: "invite",
  category: "🔰 Info",
  aliases: ["add"],
  usage: "invite",
  description: "Gives you an Invite link for this Bot",
  run: async (client, message, args, cmduser, text, prefix) => {
    try {
      let button_invite = new MessageButton().setStyle('url').setLabel('Invite Suggestions').setURL("https://discord.com/oauth2/authorize?client_id=754017241992921238&scope=bot&permissions=8")
      let button_support_dc = new MessageButton().setStyle('url').setLabel('Support Server').setURL("https://discord.com/invite/milrato ")
     //array of all buttons
      const allbuttons = [button_invite, button_support_dc]
      message.channel.send({
        embed: new MessageEmbed()
          .setColor("#ff712e")
          .setFooter(client.user.username, config.AVATARURL)  
          .setTitle(":heart: Thanks for inviting Suggestions!")
          .addField(`<:MilratoDevelopment:900389724936609842>  Bot Powered by Milrato.eu`, `**[Invite Public Bot](https://discord.com/api/oauth2/authorize?client_id=784364932149280778&permissions=8&scope=bot)  •  [WEBSITE](https://milrato.eu)  •  [Support Server/Get your Own Bot](https://discord.com/invite/milrato )**\n\n[*Invite* **${client.user.username}**](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)`),
        buttons: allbuttons
      });
    } catch (e) {
      console.log(String(e.stack).bgRed)
      return message.channel.send(new MessageEmbed()
        .setColor("RED")
        .setFooter(client.user.username, client.AVATARURL)
        .setTitle(`ERROR | An error occurred`)
        .setDescription(`\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\``)
      );
    }
  }
}