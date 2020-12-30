const fs = require('fs')
const { Command } = require('discord.js-commando');

module.exports = class Info extends Command {
	constructor(client) {
		super(client, {
			name: 'info',
			aliases: [],
			group: 'competitions',
			memberName: 'info',
            description: 'Sends info for competition',
            args: [
                {
                    key: 'competitionNames',
                    prompt: 'For what competitons would you like info?',
                    type: 'string',
                    parse: arg => arg.split(" ")
                }
            ],
            userPermissions: [
                'SEND_MESSAGES'
            ],
		});
    }

    run (message, {competitionNames}) {
        const competitions = JSON.parse(fs.readFileSync(`./data/${message.guild.id}/competitions/competitions_data.json`, 'utf-8'));
        let messageText = `<@${message.author.id}> `;
        let register;
        if (competitionNames.length === 1 && (competitionNames[0].toLowerCase() === "--all" || competitionNames[0].toLowerCase() === "-a")) {
            // all competitions required
            register = competitions;
        } else if (competitionNames.length === 1 && (competitionNames[0].toLowerCase() === "--mine" || competitionNames[0].toLowerCase() === "-m")) {
            // user's competions required
            register = competitions.filter(comp => message.member._roles.includes(comp.role))
        } else {
            // submited competitions required
            register = competitionNames.map(finding => competitions.find(comp => comp.name.toLowerCase() === finding.toLowerCase()));
        }
        
        // checks if unkonown competitions were submited
        if (register.includes(undefined)) {
            messageText += "Unknown competitions:"
            for (var i=0; i<competitionNames.length; i++) {
                if (register[i] === undefined) {
                    messageText += ` ${competitionNames[i]}` + (i===competitionNames.length-1 ? '':',')
                    return message.say(messageText);
                }
            }
        }

        // sorts competitions by deadline
        register.sort((comp1, comp2) => {
            let [d1, d2] = [Infinity, Infinity];
            if (comp1.deadline != undefined) {
                let deadline = comp1.deadline.match(/\d+/g).map(x => parseInt(x));
                d1 = new Date(deadline[2], deadline[1]-1, deadline[0]).getTime();
            }
            if (comp2.deadline != undefined) {
                let deadline = comp2.deadline.match(/\d+/g).map(x => parseInt(x));
                d2 = new Date(deadline[2], deadline[1]-1, deadline[0]).getTime();
            }
            if (d1 === d2) {
                return 0;
            }
            return d1 - d2;
        })

        // creates the message
        messageText += register.length === 1 ? ' ' : '\n';
        register.forEach(comp => {
            messageText += `Here's web for ${comp.category.toLowerCase()} competiton ${comp.name} ${comp.web}. ${comp.deadline != undefined ? ` Next deadline is ${comp.deadline}`: ''}\n`;
        });
        return message.say(messageText);
        
    }
};