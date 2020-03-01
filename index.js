const Discord = require('discord.js');
const client = new Discord.Client();

const schedule = require('node-schedule');

const fetch = require('node-fetch');

const TARGET_GUILD = "652148034448261150";
const TARGET_CHANNEL = "683539143808122940";

client.on('ready', () => {
    console.log('Bot is ready.');
});

const getMagmaSpawn = async () => {
    const response = await fetch('https://hypixel-api.inventivetalent.org/api/skyblock/bosstimer/magma/estimatedSpawn');
    const data = await response.json();

    return { estimate: data.estimate, name: "Magma Boss" };
}

const getDarkAuction = async () => {
    const response = await fetch('https://hypixel-api.inventivetalent.org/api/skyblock/darkauction/estimate');
    const data = await response.json();

    return { estimate: data.estimate, name: "Dark Auction" };
}

const getBankInterest = async () => {
    const response = await fetch('https://hypixel-api.inventivetalent.org/api/skyblock/bank/interest/estimate');
    const data = await response.json();

    return { estimate: data.estimate, name: "Bank Interest" };
}

const getNewYear = async () => {
    const response = await fetch('https://hypixel-api.inventivetalent.org/api/skyblock/newyear/estimate');
    const data = await response.json();

    return { estimate: data.estimate, name: "New Year" };
}

const getZoo = async () => {
    const response = await fetch('https://hypixel-api.inventivetalent.org/api/skyblock/zoo/estimate');
    const data = await response.json();

    return { estimate: data.estimate, name: "Zoo" };
}

const getSpookyFestival = async () => {
    const response = await fetch('https://hypixel-api.inventivetalent.org/api/skyblock/spookyFestival/estimate');
    const data = await response.json();

    return { estimate: data.estimate, name: "Spooky Festival" };
}

const getWinterEvent = async () => {
    const response = await fetch('https://hypixel-api.inventivetalent.org/api/skyblock/winter/estimate');
    const data = await response.json();

    return { estimate: data.estimate, name: "Winter Event" };
}

const getJerryEvent = async () => {
    const response = await fetch('https://hypixel-api.inventivetalent.org/api/skyblock/jerryWorkshop/estimate');
    const data = await response.json();

    return { estimate: data.estimate, name: "Jerry Event" };
}

const times = new Map();
let timers = [];

const darkAuction = "671896345619202109";
const bankInterest = "671922128785899520";
const spookyFestival = "683552509289431061";
const jerryWorkshopEvent = "674060173723041842";
const zoo = "683535544596037639";
const newYear = "683535553840283648";
const winterEvent = "683545303798120589";
const magmaBoss = "683545449780609044";

const setupTimer = (name, key, timestamp) => {
    if (timers.includes(key)) return;
    timers.push(key);

    const date = new Date(timestamp - 300000);

    if (timestamp - 300000 < Date.now()) return;

    schedule.scheduleJob(date, () => {
        timers = timers.filter(t => t !== key);

        const embed = new Discord.RichEmbed()
        embed.setTitle(`${name} is starting in 5 minutes.`)
        embed.setFooter('Powered by https://hypixel.inventivetalent.org/')

        let role = "";

        switch (key) {
            case "magmaBoss":
                role = magmaBoss;
                break;
            case "darkAuction":
                role = darkAuction;
                break;
            case "bankInterest":
                role = bankInterest;
                break;
            case "newYear":
                role = newYear;
                break;
            case "zoo":
                role = zoo;
                break;
            case "spookyFestival":
                role = spookyFestival;
                break;
            case "winterEvent":
                role = winterEvent;
                break;
            case "jerryWorkshopEvent":
                role = jerryWorkshopEvent;
                break;
        }

        client.guilds.get(TARGET_GUILD).channels.get(TARGET_CHANNEL).send(`<@&${role}>`);
        client.guilds.get(TARGET_GUILD).channels.get(TARGET_CHANNEL).send(embed);
    });
}

const getAllTimers = async () => {
    times.set("magmaBoss", await getMagmaSpawn());
    times.set("darkAuction", await getDarkAuction());
    times.set("bankInterest", await getBankInterest());
    times.set("newYear", await getNewYear());
    times.set("zoo", await getZoo());
    times.set("spookyFestival", await getSpookyFestival());
    times.set("winterEvent", await getWinterEvent());
    times.set("jerryWorkshopEvent", await getJerryEvent());

    const allTimes = Array.from(times).map(t => ({ key: t[0], ...t[1] }));
    allTimes.map(t => setupTimer(t.name, t.key, t.estimate));
}

getAllTimers();
setInterval(() => getAllTimers(), 600000);

client.login('token');