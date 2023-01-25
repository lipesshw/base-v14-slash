const client = require("../../index");
const Discord = require("discord.js");
const bot = require('../../bot.json');

client.on('guildMemberAdd', (member) => {
    let guild = client.guilds.cache.get('id do seu servidor');
    let channel = guild.channels.cache.get('id do canal de boas vindas');
    let embed = new Discord.EmbedBuilder()
  
      .setColor('#ef3921')
      .setAuthor({ name: `${member.user.tag} | Bem-Vindo(a)!` })
      .setDescription(`Olá, seja muito bem vindo ao ${guild.name}.\n\n`)
      .addFields(
  
        {
          name: '🤗 Sabia que...', value: `Você é o ${guild.memberCount}° membro aqui no servidor?!` , inline: true
        },
        { name: '🛡️ Tag do Usuário', value: member.user.tag + member.user.id, inline: true })
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, format: "gif", size: 1024 }))
  
    channel.send({ content: `${member}`, embeds: [embed] });
  });