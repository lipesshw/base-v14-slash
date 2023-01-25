const { EmbedBuilder } = require('discord.js');
const { WarningsSchema } = require('../../Models/warnSchema');

module.exports = {
    name: 'warns',
    description: '[📄 Utilidade] Verifique seus avisos.',
    type: 1,
    options: [],
    role_perms: null,
    developers_only: false,
    run: async (client, interaction) => {

        WarningsSchema.findOne(
            {
                user: interaction.user.id,
                guild: interaction.guild.id
            }, async (err, data) => {
                if (err) throw err;

                if (data && data.warnings?.length > 0) {
                    const list = data.warnings.map((w, i) => {
                        return {
                            name: `\`#${i + 1}\` | Você tem pendências ativas :(`,
                            value: `> **UUID:** ${w.warnId || "00000000-0000-0000-0000-000000000000"}\n> **Autor do warn:** ${interaction.guild.members.cache.get(w.moderator)?.user || '[Usuário inválido]'}\n> **Desde:** <t:${(new Date(w.since).getTime() / 1000).toString().split('.')[0]}> (<t:${(new Date(w.since).getTime() / 1000).toString().split('.')[0]}:R>)\n> **Motivo**: ${w.reason}\n\n`
                        }
                    });

                    return interaction.reply(
                        {
                            embeds: [
                                new EmbedBuilder()
                                    .setAuthor(
                                        {
                                            name: `${interaction.user.tag} (${interaction.user.id})`,
                                            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                        }
                                    )
                                    .addFields(
                                        list
                                    )
                            ],
                            ephemeral: true
                        }
                    )
                } else {
                    interaction.reply({
                        content: `\`✅\` Você não tem nenhuma pendência, continue assim!`,
                        ephemeral: true
                    });
                };
            }
        );

    },
};