const Discord = require('discord.js');

const extractID = (id) => {
    return id.split('').filter(char => !isNaN(char)).join("");
}

const capitalizeFirstLetter = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

const gearEmbed = ({ name, gear: { ap, aap, dp, score, gearURL}, timestamp }) => (
    new Discord.RichEmbed()
        .setColor('DARK_RED')
        .setAuthor(`${name}'s Gear`, 'https://res.cloudinary.com/teepublic/image/private/s--hzenCVH3--/t_Preview/b_rgb:191919,c_limit,f_jpg,h_630,q_90,w_630/v1467371704/production/designs/567364_1.jpg')
        .setThumbnail('https://res.cloudinary.com/teepublic/image/private/s--hzenCVH3--/t_Preview/b_rgb:191919,c_limit,f_jpg,h_630,q_90,w_630/v1467371704/production/designs/567364_1.jpg')
        .addField('**AP**', ap, true)
        .addField('**Awakening AP**', aap, true)
        .addField('**DP**', dp, true)
        .addField('Renown Score', score, true)
        .setImage(gearURL)
        .setFooter(`Last update ${new Date(timestamp).toUTCString()}`, '')
);


module.exports = {
    extractID,
    capitalizeFirstLetter,
    gearEmbed,
}