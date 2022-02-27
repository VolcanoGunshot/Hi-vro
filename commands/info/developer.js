//Here the command starts
const Discord = require("discord.js")
const config = require("../../config.json");
const { MessageButton } = require('discord-buttons')
const { MessageEmbed } = require("discord.js")
module.exports = {
	name: "developer",
	category: "🔰 Info",
	aliases: ["dev", "tomato"],
	description: "Shows Information about the Developer",
	Usage: "developer",
	run: async (client, message, args) => {
		try {
			let button_public_invite = new MessageButton().setStyle('url').setLabel('Invite Suggestions').setURL("https://discord.com/oauth2/authorize?client_id=754017241992921238&scope=bot&permissions=8")
			let button_support_dc = new MessageButton().setStyle('url').setLabel('Get yourself a own Bot').setURL("https://discord.gg/milrato ")
			let button_invite = new MessageButton().setStyle('url').setLabel('Public Bot-List-Website').setURL(`https://botlist.milrato.eu`)
			const allbuttons = [button_public_invite, button_support_dc, button_invite]
			message.channel.send({embed: new MessageEmbed()
				
				.setColor("#ff712e")
				.setFooter(client.user.username + " | Sponsor: Bittmax.de | Code  'x10'  == -5%", client.AVATARURL)
				.setTimestamp()
				.setThumbnail("https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp?size=1024")
				.setTitle("Tomato#6966 | Dev of 3 Orgs | Developer of 200+ BOTS")
				.setURL("https://milrato.eu")
				.setDescription(`
<:arrow:832598861813776394> Hello I am **Tomato** <@442355791412854784> *(\`Tomato#6966\`)*, and i made more then 200 different Discord Bots: [My Bot List](https://bots.musicium.eu)

<:arrow:832598861813776394> I am very proud for all of my verified and not verified Discord Bots, but the Bot I am the most proud of is: [**LAVA MUSIC** | \`2021\'s Best Music Bot\`](https://lava.milrato.eu) <@742672021422342165>

<:arrow:832598861813776394> I made this Bot, and you can get a free Bot too! Just go to: [My Service](https://milrato)

<:arrow:832598861813776394> I am also a **Website** Developer and **Plugin** dev. I made **Modules** like a **SPEECH Module** [SEE IT](https://cdn.discordapp.com/attachments/778714123785076768/801606374105546782/2021-01-21_01-15-50.mp4)

<:arrow:832598861813776394> Yeah i hope you like my stuff :v: <3`),
buttons: allbuttons
			}).catch(error => console.log(error));
		} catch (e) {
			console.log(String(e.stack).bgRed)
			return message.channel.send(new MessageEmbed()
				.setColor("RED")
				.setFooter(client.user.username, client.AVATARURL)
				.setTitle(`ERROR | An error occurred`)
				.setDescription(`\`\`\`${String(e.stack).substr(0, 2000)}\`\`\``)
			);
		}
	}
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
