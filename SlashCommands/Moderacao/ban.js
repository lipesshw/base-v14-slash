const Discord = require('discord.js');

module.exports = {
    name: "ban",
    description: "[🔒 Moderação] Retire um usuario do seu servidor.",
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
            description: 'Defina um motivo para banir o usuario',
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
        },
    ],

    run: async (client, interaction) => {


        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {
            interaction.reply({ content: `❌ | Ola ${interaction.user}, Você não tem permissão para utilizar esse comando`, ephemeral: true })
        } else {
            let user = interaction.options.getUser("user")
            let user2 = interaction.guild.members.cache.get(user.id)
            let motivo = interaction.options.getString("motivo")
            if (!motivo) motivo = "Não definido."
            if (!user) return interaction.reply({ content: 'Insira um id ou usuário válido', ephemeral: true })


            let banido = new Discord.EmbedBuilder()
                .setColor("Green")
                .setTitle("**\:hammer: | NOVO BAN EFETUADO**")
                .setDescription(`**\:white_small_square: Usuário banido**: ${user} (\`${interaction.user.id}\`)\n**\:white_small_square: Motivo**: \`${motivo}\`\n\n**\:white_small_square: Autor da punição:** ${interaction.user}`)
                .setTimestamp();

            user2.ban({ reason: [motivo] }).then(() => {

                interaction.reply({ embeds: [banido] })
            })


        }
    }
}


