//Here the command starts
const Discord = require("discord.js")
const config = require("../../config.json");
const { MessageButton } = require('discord-buttons')
const { MessageEmbed } = require("discord.js")
module.exports = {
  name: "support",
  category: "🔰 Info",
  usage: "support",
  description: "Sends you the Support Server Link",
  run: async (client, message, args, cmduser, text, prefix) => {
    try {
      let button_public_invite = new MessageButton().setStyle('url').setLabel('Invite Public Bot').setURL("https://clan.milrato.eu")
      let button_support_dc = new MessageButton().setStyle('url').setLabel('Support Server').setURL("https://discord.com/invite/milrato ")
      let button_invite = new MessageButton().setStyle('url').setLabel('Invite this Bot').setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
      //array of all buttons
      const allbuttons = [button_public_invite, button_support_dc, button_invite]
      message.channel.send({
        embed: new MessageEmbed()
          .setColor("#ff712e")
         .setTitle(":tickets: You need help? **JOIN OUR SUPPORT SERVER**")
          .setDescription(`**[Invite Public Bot](https://discord.com/api/oauth2/authorize?client_id=754017241992921238&permissions=8&scope=bot)  •  [WEBSITE](https://milrato.eu)  •  [Support Server/Get your Own Bot](https://discord.com/invite/milrato )**`)
          .setFooter("Suggestions | powered by milrato.eu", "https://imgur.com/jPItIw0.gif")
          .setURL("https://discord.com/api/oauth2/authorize?client_id=754017241992921238&permissions=8&scope=bot"),
        buttons: allbuttons
      });
    } catch (e) {
      console.log(String(e.stack).bgRed)
      return message.channel.send(new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(es.footertext, es.footericon).setThumbnail(es.thumb ? es.footericon : null)
        .setTitle(`ERROR | An error occurred`)
        .setDescription(`\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\``)
      );
    }
  }
}