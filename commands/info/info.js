//Here the command starts
const Discord = require("discord.js")
const config = require("../../config.json");
const { MessageButton } = require('discord-buttons')
const { MessageEmbed } = require("discord.js")
const cpuStat = require("cpu-stat")
module.exports = {
  name: "info",
  aliases: ["botinfo", "about", "stats"],
  category: "🔰 Info",
  description: "Sends detailed info about the client",
  usage: "info",
  run: async (client, message, args, cmduser, text, prefix) => {
  try{
    let tempmsg = await message.channel.send(new Discord.MessageEmbed().setColor("#ff712e").setAuthor("GETTING BOT INFORMATION DATA", "https://cdn.discordapp.com/emojis/756773010123522058.gif"))
    cpuStat.usagePercent(function (e, percent, seconds) {
        if (e) {
            return console.log(String(e.stack).red);
        }
        let connectedchannelsamount = 0;
        let guilds = client.guilds.cache.map((guild) => guild);
        for (let i = 0; i < guilds.length; i++) {
            if (guilds[i].me.voice.channel) connectedchannelsamount += 1;
        }
      const totalGuilds = client.guilds.cache.size;
      const totalMembers = client.users.cache.size;
                    
      let countertest = 0;
      countertest = 0;
      const botinfo = new Discord.MessageEmbed()
          .setAuthor(client.user.tag + " Information",  config.AVATARURL, "https://discord.com/api/oauth2/authorize?client_id=754017241992921238&permissions=8&scope=bot") 
          .setDescription(`\`\`\`yml\nName: ${client.user.tag} [${client.user.id}]\nBot Latency: ${Math.round(Date.now() - message.createdTimestamp)}ms\nApi Latency: ${Math.round(client.ws.ping)}ms\nRuntime: ${duration(client.uptime).join(", ")}\`\`\``)
          .setColor("#ff712e")
          .setFooter(client.user.username, config.AVATARURL)  
          .addField("<:arrow:832598861813776394> General -- Stats", `\`\`\`yml\nServers: ${totalGuilds}\nUsers: ${totalMembers}\nConnections: ${connectedchannelsamount}\`\`\``, true)
          .addField("<:arrow:832598861813776394> Bot -- Stats", `\`\`\`yml\nNode.js: ${process.version}\nDiscord.js: v${Discord.version}\nEnmap: v5.8.4\`\`\``, true)
          .addField("<:arrow:832598861813776394> System -- Stats", `\`\`\`yml\nOS: Linux | Debian\nCPU Usage: ${percent.toFixed(2)} %\nRAM usage: ${(process.memoryUsage().heapUsed/1024/1024).toFixed(2)} MB\`\`\``, true)
          .addField("<:arrow:832598861813776394> Developer", `\`\`\`yml\nName: Tomato#6966 [442355791412854784]\`\`\``)
          .addField("<:arrow:832598861813776394> Important Links", `**[Invite Link](https://discord.com/api/oauth2/authorize?client_id=754017241992921238&permissions=8&scope=bot)\`|\`[Support Server](https://discord.gg/pe3V7uT)\`|\`[Website](https://milrato.eu)\`|\`[Get Free Bots](https://discord.gg/milrato )**`)
      console.log("TEST")
      tempmsg.edit({embed: botinfo});
    });
  } catch (e) {
      console.log(String(e.stack).bgRed)
      return message.channel.send(new Discord.MessageEmbed()
      .setColor("#ff712e")
      .setFooter(client.user.username, config.AVATARURL)  
          .setTitle(`ERROR | An error occurred`)
          .setDescription(`\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\``)
      );
  }
},
};
function parseDuration(duration) {
  let remain = duration
  let days = Math.floor(remain / (1000 * 60 * 60 * 24))
  remain = remain % (1000 * 60 * 60 * 24)

  let hours = Math.floor(remain / (1000 * 60 * 60))
  remain = remain % (1000 * 60 * 60)

  let minutes = Math.floor(remain / (1000 * 60))
  remain = remain % (1000 * 60)

  let seconds = Math.floor(remain / (1000))
  remain = remain % (1000)

  let milliseconds = remain

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds
  };
}

function formatTime(o, useMilli = false) {
  let parts = []
  if (o.days) {
    let ret = o.days + ' Day'
    if (o.days !== 1) {
      ret += 's'
    }
    parts.push(ret)
  }
  if (o.hours) {
    let ret = o.hours + ' Hr'
    if (o.hours !== 1) {
      ret += 's'
    }
    parts.push(ret)
  }
  if (o.minutes) {
    let ret = o.minutes + ' Min'
    if (o.minutes !== 1) {
      ret += 's'
    }
    parts.push(ret)

  }
  if (o.seconds) {
    let ret = o.seconds + ' Sec'
    if (o.seconds !== 1) {
      ret += 's'
    }
    parts.push(ret)
  }
  if (useMilli && o.milliseconds) {
    let ret = o.milliseconds + ' ms'
    parts.push(ret)
  }
  if (parts.length === 0) {
    return 'instantly'
  } else {
    return parts
  }
}


function duration(duration, useMilli = false) {
  let time = parseDuration(duration)
  return formatTime(time, useMilli)
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