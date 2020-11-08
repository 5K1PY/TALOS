module.exports = {
    checkCompetitions: checkCompetitions
}


const fs = require('fs');

function checkCompetitions({client}) {
    for (let [id, guild] of client.guilds.cache.entries()) {
        let channel = guild.channels.cache.get(JSON.parse(fs.readFileSync(`./data/${guild.id}/announcments_channel.json`, 'utf-8')).id);
        let competitions = JSON.parse(fs.readFileSync(`./data/${guild.id}/competitions/competitions_data.json`, 'utf-8'));
        for (let i=0; i < competitions.length; i++) {
            let comp = competitions[i]
            if (comp.deadline != undefined) {
                let deadline = comp.deadline.match(/\d+/g).map(x => parseInt(x));
                let deadline_sunday = new Date(deadline[2], deadline[1]-1, deadline[0]);
                deadline_sunday.setDate(deadline_sunday.getDate() - deadline_sunday.getDay());
                
                let deadline_monday = new Date(deadline_sunday);
                deadline_monday.setDate(deadline_monday.getDate() - 6);
                let deadline_saturday = new Date(deadline_sunday);
                deadline_saturday.setDate(deadline_saturday.getDate() - 1);
                
                let today = new Date();
                today.setHours(0,0,0,0);

                if (today.getTime() === deadline_monday.getTime()) {
                    channel.send(`Last week to solve <@&${comp.role}>`);
                } else if (today.getTime() === deadline_saturday.getTime()) {
                    channel.send(`Last weekend to solve <@&${comp.role}>`);
                } else if (today.getTime() > new Date(deadline[2], deadline[1]-1, deadline[0]).getTime()) {
                    comp.deadline = undefined;
                }
            }
        }
        let jsonData = JSON.stringify(competitions);
        fs.writeFileSync(`./data/${guild.id}/competitions/competitions_data.json`, jsonData, 'utf-8');
    }
}