//Here the command starts
const Discord = require("discord.js")
const moment = require("moment")
const { MessageButton } = require('discord-buttons')
const { MessageEmbed } = require("discord.js")
module.exports = {
    //definition
     name: "uptime", //the name of the command 
     category: "info", //the category this will be listed at, for the help cmd
     aliases: [""], //every parameter can be an alias or empty for no aliases
     cooldown: 10, //this will set it to a 10 second cooldown
     usage: "uptime", //this is for the help command for EACH cmd
     description: "Returns the duration on how long the Bot is online", //the description of the command
 
     //running the command with the parameters: client, message, args, user, text, prefix
   run: async (client, message, args, user, text, prefix) => {
    // a sub function to get the time    
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
      let date = new Date()
      let timestamp = date.getTime() - Math.floor(client.uptime);
      message.channel.send(new MessageEmbed()
        .setColor("#ff712e")
        .setFooter(client.user.username, config.AVATARURL)  
        .setTitle(`:white_check_mark: **${client.user.username}** Uptime`)
        .setDescription(`\`\`\`css\n${duration(client.uptime).map(i=> `${i}`).join(", ")}\`\`\``)
        .addField("**Date Launched**",  moment(timestamp).format("LLLL"))
      );
    }
}

