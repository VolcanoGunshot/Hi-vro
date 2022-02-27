const { Client, Collection, MessageEmbed, MessageAttachment } = require(`discord.js`);
const {
    MessageButton,
    MessageActionRow
} = require(`discord-buttons`)
module.exports = (client) => {

  client.on(`message`, async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (message.partial) await message.fetch();
    client.settings.ensure(message.guild.id, {
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
    
    let data = client.settings.get(message.guild.id)
    var PREFIX = data.prefix;
    var approveemoji = data.approveemoji;
    var denyemoji = data.denyemoji;
    var approvetext = data.approvemsg;
    var denytext = data.denymsg;
    var maybetext = data.maybemsg;
    var footertext = data.footertext;
    var statustext = data.statustext;
    var soonmsg = data.soonmsg;   
    var duplicatemsg = data.duplicatemsg;   
    var role; 
    let whobutton = new MessageButton().setStyle("blurple").setEmoji("❓").setID("Suggest_who").setLabel("Who voted?")
          
    let upvotebutton = new MessageButton()
      .setStyle("grey") 
      .setEmoji(approveemoji) 
    .setID("Suggest_upvote")
    .setLabel("0")
    let downvotebutton = new MessageButton()
      .setStyle("grey") 
      .setEmoji(denyemoji) 
    .setID("Suggest_downvote")
    .setLabel("0")
    let allbuttons = [upvotebutton, downvotebutton, whobutton];
    
    let supvotebutton = new MessageButton()
      .setStyle("grey") 
      .setEmoji("✅") 
    .setID("Suggest_upvote")
    .setLabel("0")
    let sdownvotebutton = new MessageButton()
      .setStyle("grey") 
      .setEmoji("❌") 
    .setID("Suggest_downvote")
    .setLabel("0")
    let allbuttonsSave = [supvotebutton, sdownvotebutton, whobutton];
    
    try{
      role = message.guild.roles.cache.get(data.role)
    }catch{
      role = "null";
    }
    const feedbackchannel = data.channel;
    if(!feedbackchannel) return;
    if (message.channel.id === feedbackchannel) {
      try{
        message.delete({ timeout: 500 }).catch(e=>{console.log(e)});
      }catch(e){
        console.log(e)
      }
      

      var url = "";

      var embed = new MessageEmbed()
        .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))
        .addField(`:thumbsup: **__Up Votes__**`, `**\`\`\`0 Votes\`\`\`**`, true)
        .addField(`:thumbsdown: **__Down Votes__**`, `**\`\`\`0 Votes\`\`\`**`, true)
        .setColor("#2f3136")
        .setAuthor(message.author.tag + "` Suggestion", message.member.user.displayAvatarURL({ dynamic: true }), `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
        .setDescription("\n" + message.content + "\n")
        .setFooter(footertext, message.guild.iconURL({dynamic: true}))
      //.addField(`Status`, `REASON`)
      if (message.content) {
          embed.setDescription(">>> " + message.content);
      }
      //add images if added (no videos possible)
      if (message.attachments.size > 0){
          if (message.attachments.every(attachIsImage)) {
              const attachment = new MessageAttachment(url, imagename)
              embed.attachFiles(attachment)
              embed.setImage(`attachment://${imagename}`)
          }
      }
      //if no content and no image, return and dont continue
      if (!message.content && message.attachments.size <= 0) return;

      function attachIsImage(msgAttach) {
          url = msgAttach.url;
          imagename = msgAttach.name || `Unknown`;
          return url.indexOf(`png`, url.length - 3 ) !== -1 ||
              url.indexOf(`jpeg`, url.length - 4 ) !== -1 ||
              url.indexOf(`gif`, url.length - 3) !== -1 ||
              url.indexOf(`jpg`, url.length - 3) !== -1;
      }
      message.channel.send({
          embed: embed,
          buttons: allbuttons
      }).then(msg => {
          //ste suggestions Data
          client.suggestionsDb.set(msg.id, {
              upvotes: 0,
              downvotes: 0,
              user: message.author.id,
              voted_ppl: [],
              downvoted_ppl: [],
          })
      }).catch((e)=>{
        console.log(e)
          message.channel.send({
            embed: embed,
            buttons: allbuttonsSave
        }).then(msg => {
            //ste suggestions Data
            client.suggestionsDb.set(msg.id, {
                upvotes: 0,
                downvotes: 0,
                user: message.author.id,
                voted_ppl: [],
                downvoted_ppl: [],
            })
        }).catch((e)=>{
          console.log(e)
        })
      })
    }

    if (message.content.startsWith(`${PREFIX}suggest`) || message.content.startsWith(`${PREFIX}${data.command}`)) {
      if(!role || role === "null") {
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Not enough permissions")
      }
      else{
        if(!message.member.roles.cache.has(role.id) &&!message.member.hasPermission("ADMINISTRATOR")) {console.log("F");return message.reply("Not enough permissions")}
      }
      const args = message.content.slice(PREFIX.length).trim().split(" ");
      var reason = "No reason";
      //wenn kein grund
      if (!args[1]) return message.reply("Please add a method:  `approve` / `deny` / `maybe` / `soon` / `duplicate`\nUsage: \`suggest <approve / deny / maybe / soon / duplicate> <suggest_id>\`");
      //wenn keine nachrichts id
      if (!args[2]) return message.reply("Please add a suggestions message id Example Command: `>>suggest approve 778600880403644426 Good idea!`\nUsage: \`suggest <approve / deny / maybe / soon / duplicate> <suggest_id>\`");
      //wenn kein grund dann nix
      if(args[2].length !== 18) return message.reply("It seems that the suggestion doesnt exist! An ID is 18 letters big.\nUsage: \`suggest <approve / deny / maybe / soon / duplicate> <suggest_id>\`");
      if(args[3]) reason = args.slice(3).join(" ");
      //finde feedbackchannel
      const channel = message.guild.channels.cache.get(feedbackchannel)
      if (!channel) {
        return message.reply("**It seems that the Suggestion's Channel doesn't exists!**");
      }
      //finde die nachricht
      const targetMessage = await channel.messages.fetch(args[2])
      if (!targetMessage) {
        return message.reply(":x: **It seems that the Suggestion's Message doesn't exist!**");
      }
      if(!client.suggestionsDb.has(targetMessage.id) || targetMessage.author.id != client.user.id){
        return message.reply(":x: **This is not a Suggestion from __ME__!**")
      }
      //altes embed
      const oldEmbed = targetMessage.embeds[0];
      if(!oldEmbed) return message.reply(":x: **This Suggestion does not have an Embed!**")
      //bekomme was er machen will
      var color;
      var statustext;

      switch(String(args[1]).toLowerCase()){
        case `approve`:
          color = `GREEN`;
          statustext = `${approvetext}`;
          await message.channel.send(
            new MessageEmbed()
              .setColor(`GREEN`)
              .setTitle(`**✅ | Suggestion got \`approved\`!**`)
              .setDescription(`${channel}\n> https://discord.com/channels/${message.guild.id}/${channel.id}/${targetMessage.id}`)
          );
          break;

        case `deny`:
          color = `RED`;
          statustext = `${denytext}`;
          await message.channel.send(
            new MessageEmbed()
              .setColor(`RED`)
              .setTitle(`**✅ | Suggestion got \`declined\`!**`)
              .setDescription(`${channel}\n> https://discord.com/channels/${message.guild.id}/${channel.id}/${targetMessage.id}`)
          );
        break;

        case `maybe`:
          color = `ORANGE`;
          statustext = `${maybetext}`;
          await message.channel.send(
            new MessageEmbed()
              .setColor("#2f3136")
              .setTitle(`**✅ | Suggestion got \`maybed\`!**`)
              .setDescription(`${channel}\n> https://discord.com/channels/${message.guild.id}/${channel.id}/${targetMessage.id}`)
          );
          break;

        case `soon`:
          color = `#FFFFF9`;
          statustext = `${soonmsg}`;
          await message.channel.send(
            new MessageEmbed()
              .setColor("#2f3136")
              .setTitle(`**✅ | Suggestion got \`sooned\`!**`)
              .setDescription(`${channel}\n> https://discord.com/channels/${message.guild.id}/${channel.id}/${targetMessage.id}`)
          );
          break;
        
        case `duplicate`:
          color = `BLUE`;
          statustext = `${duplicatemsg}`;
          await message.channel.send(
            new MessageEmbed()
              .setColor("#2f3136")
              .setTitle(`**✅ | Suggestion got \`duplicated\`!**`)
              .setDescription(`${channel}\n> https://discord.com/channels/${message.guild.id}/${channel.id}/${targetMessage.id}`)
          );
          break;
        default:
          message.reply(`Please add a method:  \`approve\` / \`deny\` / \`maybe\` / \`soon\` / \`duplicate\``);
        break;
      }

      const embed = oldEmbed.setColor(color)
        if(embed.fields[2]){
          embed.fields[2].name = `<:arrow:832598861813776394> __Reason by **${message.author.tag}**__`;
          embed.fields[2].value = `>>> ${String(reason).substr(0, 1000)}`;
        } else {
          embed.addField(`<:arrow:832598861813776394> __Reason by **${message.author.tag}**__`, `>>> ${String(reason).substr(0, 1000)}`)
        }
        targetMessage.edit({embed: embed})
        try{
          let SuggestionsData = client.suggestionsDb.get(targetMessage.id)
          let member = message.guild.members.cache.get(SuggestionsData.user);
          if(!member) member = await message.guild.members.fetch(SuggestionsData.user).catch(() => {});
          if(member){
            member.send({content: `Your Suggestion in **${message.guild.name}** got an Status Update!\n> https://discord.com/channels/${message.guild.id}/${channel.id}/${targetMessage.id}`,embed: embed}).catch(() => {});
          }
        } catch (e){ console.log(e) }
        targetMessage.edit({embed: embed, files: []})
    }
  })
  //Event for the Mod Log & Suggestions System
  client.on("clickButton", async (button) => {
      if(!button.message.guild || !button.message.channel) return;
      if (button.message.author.id != client.user.id) return;
      let guild = button.message.guild;
      let channel = button.message.channel;
      if (button.id.startsWith("Suggest_")) {
          if(client.settings.get(guild.id, "channel") !== channel.id) return;
          let SuggestionsData = client.suggestionsDb.get(button.message.id)
          if(!SuggestionsData.downvoted_ppl) {
            client.suggestionsDb.set(button.message.id, [], "downvoted_ppl")
            SuggestionsData = client.suggestionsDb.get(button.message.id)
          }
          if(button.id == "Suggest_upvote") {
            if(SuggestionsData.voted_ppl.includes(button.clicker.id)){
                return button.reply.send({content: `You can't upvote the Suggestion of <@${SuggestionsData.user}> twice!`, ephemeral: true})
            }
            //remove the downvote
            if(SuggestionsData.downvoted_ppl.includes(button.clicker.id)){
              client.suggestionsDb.math(button.message.id, "-", 1, "downvotes")
              client.suggestionsDb.remove(button.message.id, button.clicker.id, "downvoted_ppl")
            }
            client.suggestionsDb.math(button.message.id, "+", 1, "upvotes")
            client.suggestionsDb.push(button.message.id, button.clicker.id, "voted_ppl")
          }
          if(button.id == "Suggest_downvote") {
              if(SuggestionsData.downvoted_ppl.includes(button.clicker.id)){
                return button.reply.send({content: `You can't downvote the Suggestion of <@${SuggestionsData.user}> twice!`, ephemeral: true})
              }
              //remove the upvote
              if(SuggestionsData.voted_ppl.includes(button.clicker.id)){
                client.suggestionsDb.math(button.message.id, "-", 1, "upvotes")
                client.suggestionsDb.remove(button.message.id, button.clicker.id, "voted_ppl")
              }
              client.suggestionsDb.math(button.message.id, "+", 1, "downvotes")
              client.suggestionsDb.push(button.message.id, button.clicker.id, "downvoted_ppl")
          }
          if(button.id == "Suggest_who"){
            return button.reply.send({embed: new MessageEmbed()
            .setColor(button.message.embeds[0].color)
            .setTitle(`❓ **Who reacted with what?** ❓`)
            .addField(`${SuggestionsData.upvotes} Upvotes`,`${SuggestionsData.voted_ppl && SuggestionsData.voted_ppl.length > 0 ? SuggestionsData.voted_ppl.length < 20 ? SuggestionsData.voted_ppl.map(r => `<@${r}>`).join("\n") : [...SuggestionsData.voted_ppl.slice(0, 20).map(r => `<@${r}>`), `${SuggestionsData.voted_ppl.length - 20} more...`].join("\n") : "Noone"}`.substr(0, 1024), true)
            .addField(`${SuggestionsData.downvotes} Downvotes`,`${SuggestionsData.downvoted_ppl && SuggestionsData.downvoted_ppl.length > 0 ? SuggestionsData.downvoted_ppl.length < 20 ? SuggestionsData.downvoted_ppl.map(r => `<@${r}>`).join("\n") : [...SuggestionsData.downvoted_ppl.slice(0, 20).map(r => `<@${r}>`), `${SuggestionsData.downvoted_ppl.length - 20} more...`].join("\n") : "Noone"}`.substr(0, 1024), true), ephemeral: true});
          }
          SuggestionsData = client.suggestionsDb.get(button.message.id);
          let embed = button.message.embeds[0];
          embed.fields[0].key = `:thumbsup: **__Up Votes__**`;
          embed.fields[0].value = `**\`\`\`${SuggestionsData.upvotes} Votes\`\`\`**`;
          embed.fields[1].key = `:thumbsdown: **__Down Votes__**`;
          embed.fields[1].value = `**\`\`\`${SuggestionsData.downvotes} Votes\`\`\`**`;
          let whobutton = new MessageButton().setStyle("blurple").setEmoji("❓").setID("Suggest_who").setLabel("Who voted?")
          let upvotebutton = new MessageButton().setStyle("grey").setEmoji(client.settings.get(guild.id, "approveemoji")).setID("Suggest_upvote").setLabel(SuggestionsData.upvotes)
          let downvotebutton = new MessageButton().setStyle("grey").setEmoji(client.settings.get(guild.id, "denyemoji")) .setID("Suggest_downvote").setLabel(SuggestionsData.downvotes)
          let supvotebutton = new MessageButton().setStyle("grey").setEmoji("✅").setID("Suggest_upvote").setLabel(SuggestionsData.upvotes)
          let sdownvotebutton = new MessageButton().setStyle("grey").setEmoji("❌") .setID("Suggest_downvote").setLabel(SuggestionsData.downvotes)
            button.message.edit({embed: embed, buttons: [upvotebutton, downvotebutton, whobutton]}).catch((e)=>{
              button.message.edit({embed: embed, buttons: [supvotebutton, sdownvotebutton, whobutton]}) .catch((e)=>{
                console.log(e)
              })
            })
          button.reply.defer();
      }
  });
  //function for removing Reactions if reacted to smt else
  /*
  client.on("messageReactionAdd", async (reaction, user) => {
    try {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;
        if (!reaction.message.guild) return;
        client.settings.ensure(reaction.message.guild.id, {
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
        const feedbackchannel = client.settings.get(reaction.message.guild.id, "channel");
        if(!feedbackchannel) return;
        if (reaction.message.channel.id !== feedbackchannel) return;
        //REMOVE REACTIONS
        var oldreact = reaction;
        await reaction.message.fetch();
        const userReactions = reaction.message.reactions.cache;
        try {
            for (const reaction of userReactions.values()) {
                if (reaction.users.cache.has(button.clicker.id) && oldreact.emoji.name != reaction.emoji.name) {
                  try {
                    reaction.users.remove(button.clicker.id);
                  } catch {}
                }
            }
        } catch {}
    } catch (e) {
        console.log(e)
    }
})*/
}
