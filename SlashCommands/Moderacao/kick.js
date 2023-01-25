const Discord = require('discord.js');

module.exports = {
    name: "kick",
    description: "[🔒 Moderação] Kicke um usuario do seu servdor.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'user',
            description: 'Selecione um usuario',
            type: Discord.ApplicationCommandOptionType.User,
            require: true,
        },
        {
            name: 'motivo',
            description: 'Defina um motivo para kickar o usuario',
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
        },
    ],

    run: async (client, interaction) => {


        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {
            interaction.reply({ content: `Ola ${interaction.user}, Você não tem permissão para utilizar esse comando`, ephemeral: true })
        } else {
            let user = interaction.options.getUser("user")
            let user2 = interaction.guild.members.cache.get(user.id)
            let motivo = interaction.options.getString("motivo")
            if (!motivo) motivo = "Não definido"
            if (!user) return interaction.reply({ content: 'Insira um id ou usuário válido', ephemeral: true })


            let kickado = new Discord.EmbedBuilder()
                .setColor("Green")
                .setTitle("**\:hammer: | NOVO KICK EFETUADO**")
                .setDescription(`**\:white_small_square: Usuário kickado**: ${user} (\`${interaction.user.id}\`)\n**\:white_small_square: Motivo**: \`${motivo}\`\n\n**\:white_small_square: Autor do kick:** ${interaction.user}`)
                .setFooter({ text: `Comando requisitado por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ format: "png" }) });

            user2.kick({ reason: [motivo] }).then(() => {

                interaction.reply({ embeds: [kickado] })
            })


        }
    }
}


