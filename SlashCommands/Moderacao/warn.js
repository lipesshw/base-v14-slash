const { EmbedBuilder } = require('discord.js');
const ms = require("ms")
const Discord = require("discord.js")
const { uuid } = require('uuidv4');
const { WarningsSchema } = require('../../Models/warnSchema');

module.exports = {
    name: 'warn',
    description: '[🔒 Moderação] Adicione ou remova um aviso.',
    type: 1,
    options: [
        {
            name: 'adicionar',
            description: '[🔒 Moderação] Adicionar um aviso.',
            type: 1,
            options: [
                {
                    name: 'usuario',
                    description: '[🔒 Moderação] Usuário que via receber o aviso.',
                    type: 6,
                    required: true
                },
                {
                    name: 'motivo',
                    description: '[🔒 Moderação] O motivo do aviso.',
                    type: 3,
                    required: false
                }
            ]
        },
        {
            name: 'deletar',
            description: '[🔒 Moderação] Delete um aviso do usuário.',
            type: 1,
            options: [
                {
                    name: 'usuario',
                    description: '[🔒 Moderação] Usuário que vai ser removido o aviso',
                    type: 6,
                    required: true
                },
                {
                    name: 'id',
                    description: '[🔒 Moderação] (peça o usuário que ele pegue o uuid pelo comando /warns)',
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: 'clear',
            description: '[🔒 Moderação] Limpe todas as warns de um usuário.',
            type: 1,
            options: [
                {
                    name: 'usuario',
                    description: '[🔒 Moderação] Usuário que vai ter a ficha limpa.',
                    type: 6,
                    required: true
                }
            ]
        }
    ],
    developers_only: false,
    run: async (client, interaction) => {

        if(!interaction.member.permissions.has(Discord.PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({
                content: `**<:erro:1000923122008084543> | ${interaction.user}, Você precisa da permissão \`MODERATE_MEMBERS\` para usar este comando!**`,
                ephemeral: true,
            })
        } else {

        const subCommandInput = interaction.options._subcommand;

        if (subCommandInput === 'adicionar') {
            const userInput = interaction.options.get('usuario').value;
            const reasonInput = interaction.options.get('motivo')?.value || "Não fornecido.";

            const user = interaction.guild.members.cache.get(userInput);

            if (!user) return interaction.reply({
                content: `\`❌\` Usuário inválido.`,
                ephemeral: true
            });

            WarningsSchema.findOne(
                {
                    user: userInput,
                    guild: interaction.guild.id
                }, async (err, data) => {
                    if (err) throw err;

                    const uuidGenerated = uuid();

                    if (!data) {
                        data = new WarningsSchema(
                            {
                                user: userInput,
                                guild: interaction.guild.id,
                                warnings: [
                                    {
                                        moderator: interaction.user.id,
                                        since: new Date(),
                                        warnId: uuidGenerated,
                                        reason: reasonInput
                                    }
                                ]
                            }
                        );

                        interaction.reply({
                            content: `\`✅\` ${user} foi avisado com sucesso. (Total de avisos: \`1\`)`,
                            ephemeral: true
                        });
                    } else {
                        data.warnings.push(
                            {
                                moderator: interaction.user.id,
                                since: new Date(),
                                warnId: uuidGenerated,
                                reason: reasonInput
                            }
                        );

                        interaction.reply({
                            content: `\`✅\` ${user} foi avisado com sucesso. (Total de avisos: \`${data.warnings.length}\`)`,
                            ephemeral: true
                        });
                    };

                    data.save();

                    user.send({
                        content: `Você recebeu uma warn do servidor **${interaction.guild.name}**. **Motivo**: ${reasonInput}`
                    }).catch(() => { });

                    interaction.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(`${user} foi avisado com sucesso. \n${reasonInput === 'Não fornecido.' ? '.' : `**Motivo**: ${reasonInput}`}`)
                                .setFooter({
                                    text: `UUID: ${uuidGenerated}`
                                })
                                .setColor('Yellow')
                        ]
                    });
                }
            );
        };

        if (subCommandInput === 'deletar') {
            const userInput = interaction.options.get('usuario').value;
            const idInput = interaction.options.get('id').value;

            const user = interaction.guild.members.cache.get(userInput);
            if (!user) return interaction.reply({
                content: '\`❌\` Usuário inválido.',
                ephemeral: true
            });

            WarningsSchema.findOne(
                {
                    user: userInput,
                    guild: interaction.guild.id
                }, async (err, data) => {
                    if (err) throw err;

                    if (data && data.warnings?.length > 0) {
                        let boolean = false;

                        for (let warns of data.warnings) {
                            if (warns.warnId === idInput) boolean = true;
                        };

                        if (boolean === false) return interaction.reply({
                            content: `\`❌\` Formato ou UUID inválido.`,
                            ephemeral: true
                        });

                        const arr = data.warnings.filter(object => {
                            return object.warnId !== idInput
                        });

                        data.warnings = arr;

                        data.save();

                        return interaction.reply({
                            content: `\`✅\` O ID de aviso \`${idInput}\` foi deletado de ${user}.`,
                            ephemeral: true
                        });
                    } else {
                        return interaction.reply({
                            content: `\`❌\` ${user} está sem avisos.`,
                            ephemeral: true
                        });
                    };
                }
            );
        };

        if (subCommandInput === 'clear') {
            const userInput = interaction.options.get('usuario').value;

            const user = interaction.guild.members.cache.get(userInput);
            if (!user) return interaction.reply({
                content: '\`❌\` Usuário inválido.',
                ephemeral: true
            });

            WarningsSchema.findOne(
                {
                    user: userInput,
                    guild: interaction.guild.id
                }, async (err, data) => {
                    if (err) throw err;

                    if (data && data.warnings?.length > 0) {
                        await WarningsSchema.deleteOne({
                            user: userInput,
                            guild: interaction.guild.id
                        });

                        return interaction.reply({
                            content: `\`✅\` Acabei de limpar a ficha do usuário: ${user}!`,
                            ephemeral: true
                        });
                    } else {
                        return interaction.reply({
                            content: `\`❌\` ${user} está sem avisos..`,
                            ephemeral: true
                        });
                    };
                }
            );
        };

    }
    },
};