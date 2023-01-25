const ms = require("ms")
const Discord = require("discord.js")

module.exports = {
    name: 'timeout',
    description: '[🔒 Moderação] Coloque um membro de castigo.',
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'usuário',
            type: Discord.ApplicationCommandOptionType.User,
            description: 'Selecione um membro',
            required: true,
        },
        {
            name: 'tempo',
            type: Discord.ApplicationCommandOptionType.String,
            description: 'Selecione um tempo, Se prefere um tempo.',
            required: true,
            choices: [
                {
                    name: '30 Segundos',
                    value: '30s',
                },
                {
                    name: '1 Minuto',
                    value: '1m',
                },
                {
                    name: '5 Minutos',
                    value: '5m',
                },
                {
                    name: '10 Minutos',
                    value: '10m',
                },
                {
                    name: '15 Minutos',
                    value: '15m',
                },
                {
                    name: '30 Minutos',
                    value: '30m',
                },
                {
                    name: '45 Minutos',
                    value: '45m',
                },
                {
                    name: '1 Hora',
                    value: '1h',
                },
                {
                    name: '2 Horas',
                    value: '1h',
                },
                {
                    name: '5 Horas',
                    value: '1h',
                },
                {
                    name: '12 Horas',
                    value: '12h',
                },
                {
                    name: '24 Horas',
                    value: '24h',
                },
                {
                    name: '1 Dia',
                    value: '24h',
                },
                {
                    name: '3 dias',
                    value: '72h',
                },
                {
                    name: '1 Semana',
                    value: '168h',
                },
            ]
        },
        {
            name: 'motivo',
            type: Discord.ApplicationCommandOptionType.String,
            description: 'Digite o motivo.',
            required: false,
        },
    ],

    run: async (client, interaction, args) => {

        if(!interaction.member.permissions.has(Discord.PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({
                content: `** ${interaction.user}, Você precisa da permissão \`MODERATE_MEMBERS\` para usar este comando!**`,
                ephemeral: true,
            })
        } else {

            let usuario = interaction.options.getUser("usuário")
            let tempo = interaction.options.getString("tempo")
            let motivo = interaction.options.getString("motivo") || `Não fornecido.`

            let membro = interaction.guild.members.cache.get(usuario.id);
            let servericon = interaction.guild.iconURL({ dynamic: true })

            let duracao = ms(tempo);
            membro.timeout(duracao, motivo).then(() => {
                interaction.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle("**\:hammer: | NOVO TIMEOUT EFETUADO**")
                            .setDescription(`**\:white_small_square: Usuário punido**: ${membro.user}\n**\:white_small_square: Motivo**: \`${motivo}\`\n\:white_small_square: **Duração**: ${tempo}\n\n**\:white_small_square: Autor do kick:** ${interaction.user}`)
                            .setColor("Green")
                            .setTimestamp()
                    ],
                })
            })
            membro.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setThumbnail(servericon)
                        .setTitle(`<:icons_timeout:1004909276420120636> | Você recebou um timeout de ${interaction.user.tag}`)
                        .setColor('Random')
                        .setTimestamp()
                        .setFooter({ text: `Horario do timeout` })
                        .setDescription(`**${membro.user.username}, Um membro da staff do servidor \`${interaction.guild.name}\` colocou você de castigo por \`${tempo}\`**`)
                ],
            })
        }
    }
}