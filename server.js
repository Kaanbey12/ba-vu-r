const Discord = require("discord.js");
const client = new Discord.Client();
const db = require("quick.db")
const ayarlar = require("./ayarlar.json");
const { Client, Util } = require("discord.js");
const fs = require("fs");//ewing35
require("./util/eventLoader")(client);//ewing35
require('discord-buttons')(client);

//ewing35
const log = message => {
  console.log(`${message}`);
};

//ewing35

//ewing35
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});
//ewing35

client.on('ready', async () => {
client.user.setStatus('online');
console.log(`${client.user.username} ismiyle bağlandım.`);
})




const disbut = require('discord-buttons');
client.on('clickButton', async (button) => {

  const onybuton = new disbut.MessageButton()
    .setLabel('Onaylandı')
    .setStyle('green')
    .setID('ony')
    .setDisabled();

    const onaymsj = new Discord.MessageEmbed()
    .setAuthor('Vestia Yetkili Başvuru Botu', button.message.guild.iconURL({dynamic: true, type: 'gif', size: 1024}))
    .setDescription(`Başvurunuz Onaylandı ve Yetkili Rolleriniz verildi, Tebrikler :)`)
    .setColor('GREEN');



    const data = await db.get(`basvur.${button.message.id}`)
    if(!data) return;
  const basvuruGonderenID = data;

  if(button.id === 'onay'){
    button.reply.defer()
	const isimdes = client.users.cache.get(basvuruGonderenID);
    await button.message.edit(`<@${basvuruGonderenID}> adlı kişinin, Başvurusu \`${button.clicker.user.tag}\` isimli yetkili tarafından Kabul edildi`, onybuton)
    await client.channels.cache.get(ayarlar.onayred).send(`<@${basvuruGonderenID}>,`, onaymsj)
    await client.guilds.cache.get(ayarlar.sunucuid).members.cache.get(basvuruGonderenID).roles.add(ayarlar.yetkilirolid)
client.guilds.cache.get(ayarlar.sunucuid).members.cache.get(basvuruGonderenID).roles.add(ayarlar.yetkilirolid2)
	isimdes.send('Hey Selam! Ben Vestia Yetkili Başvuru Botuyum :wave: \nYaptığın yetkili başvurusu onaylandı öncelikle tebrik ederim artık yetkili ekibimizdensin. :partying_face: \nAncak bazı görevlerin olucak alta bunları anlatıcam iyi dinle :slight_smile: \n\n\n **1 -** <#914040175234011156> Kanalında Aktif Bir Şekilde Çalışmak <#914040159736037416> Bir Kez Okumanı Tavsiye Ederim.\n\n**2 -** <#914040152102416394> Katagorisinde Aktif Kalarak Kullanıcıların Bildirimlerini Dikkate Alman lazım\n\n**3 **- Mesajlar Sürekli Kontrol Edilir Bi Kanalda Bir Mesaj Silmen Kesinlikle Yasaktır Yaptığın Her Hareket İzlenicektir\n\n\n **Evet ama hep böyle sıkı yönetim mi var hep çalışmak mı var?**\nTabikide hayır. Arasıra yetkili ekibimiz arasında oynadığımız eğlenceli vakitlerde oluyor, birlikte oyunlar oynar şakalaşırız.\n\n **Gelelim Ektiğimizi Biçmeye**\nAktif ve Düzenli Çalışmanın ardından tabikide ödüller var eğer kendini gösterirsen sırasıyla yetkin yükselicek ve daha üst konumlarda görev alıcaksın \n O zaman Şimdiden bol şans Vestia Yetkili Ekibine Hoş Geldin :heart:')
  }
  if(button.id === 'red'){
    button.reply.defer()


    const sorular = [
      '**Reddedilme Sebebi?** <cevap vermek için 3 dakikan var>'
    ]
    let sayac = 0
    
    const filter = m => m.author.id === button.clicker.user.id
    const collector = new Discord.MessageCollector(button.channel, filter, {
      max: sorular.length,
      time: 3000 * 60
    })

    button.channel.send(sorular[sayac++])
    collector.on('collect', m => {
      if(sayac < sorular.length){
        m.channel.send(sorular[sayac++])
      }
    })


    collector.on('end', collected => {
      if(!collected.size) return button.channel.send('**Süre Bitti!**');
      button.channel.send('**Başvurunuz Başarıyla Reddedildi.**');

           
    const redbuton = new disbut.MessageButton()
    .setLabel('Reddedildi')
    .setStyle('red')
    .setID('red')
    .setDisabled();

    const redmsg = new Discord.MessageEmbed()
    .setAuthor('Vestia', button.message.guild.iconURL({dynamic: true, type: 'gif', size: 1024}))
    .setDescription(`<@${basvuruGonderenID}> Başvurunuz, \`${collected.map(m => m.content).slice(0,1)}\` nedeniyle ${button.clicker.user} tarafından Reddedildi`)
    .setColor('RED');

     button.message.edit(`<@${basvuruGonderenID}> adlı kişinin, Başvurusu, \`${collected.map(m => m.content).slice(0,1)}\` Sebebiyle, \`${button.clicker.user.tag}\` isimli yetkili tarafından Başarıyla Reddedildi`, redbuton)
     client.channels.cache.get(ayarlar.onayred).send(`<@${basvuruGonderenID}>,`, redmsg)
          })

    
  }
  db.delete(`basvuru.${button.message.id}`)



});

client.login(process.env.token);



//-------------------BOTU SESTE TUTMA
client.on("ready", () => {
  client.channels.cache.get(process.env.ses).join();
});


