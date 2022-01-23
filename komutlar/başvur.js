const Discord = require("discord.js");
const disbut = require("discord-buttons");
const db = require('quick.db');
const ayar = require('../ayarlar.json')
exports.run = async (client, message, args) => { 
    
	const basvurdata = await db.get(`basvurbilgi`);
	if(basvurdata) return message.reply(`Başvurular geçici olarak durdurulmuştur.`);
	
	const bandata = await db.get(`ban.${message.author.id}`)
	if(bandata) return message.reply("Başvurulardan banlısın");
		
  let category = message.guild.channels.cache.get(ayar.basvurkategori);  message.guild.channels.create(`${message.author.username}-başvurusu`, {
    parent: category,
    permissionOverwrites: [
        {id: ayar.everyoneid, deny: [('VIEW_CHANNEL'), ('SEND_MESSAGES')]},
		{id: ayar.adminrol, allow: [('VIEW_CHANNEL'), ('SEND_MESSAGES')]},
        {id: message.author.id, allow: [('VIEW_CHANNEL'), ('SEND_MESSAGES')]}]
    }).then( async baschannel => {

    
  const sorular = [
    '**İsmini Ve Yaşını Oğrenebilirmiyim?** isim/yaş',
    '**Günde 3 Saatten Fazla Aktif Olabilecek misin ?** Günde .. Saat Aktifim',
    '**Günde Ne Kadar İnvite Kasabilirsin ??** .... Tane Kasabilirim',
    '**Discord Profilini Çevrimiçini Açabilir Misin?** evet/hayır',
    '**Her Kullanıcıdan Sesli Teyit Alabilecek misin??** Hepsinden Alırım/ Vaktim Oldukça Alırım',
    '**Bionuza .gg/vestia Yazabilir Misin??** Evet Yazarım / Hayır Yazamam',
    '**Neden Vestia?** <uzunca Açıkla>'
  ]
  let sayac = 0
  
  const filter = m => m.author.id === message.author.id
  const collector = new Discord.MessageCollector(baschannel, filter, {
    max: sorular.length,
    time: 2000 * 60
  })
  baschannel.send(`Merhaba ${message.author}, demek sunucumuzda yetkili olmak istiyorsun ama önce bazı soruları cevaplaman gerek başarılar\n:hourglass: Unutma!!! Tüm soruları cevaplaman için tam 2 Dakikan var hızlı ol :)`);
  baschannel.send(sorular[sayac++])
  collector.on('collect', m => {
    if(sayac < sorular.length){
      m.channel.send(sorular[sayac++])
    }
  })

  collector.on('end', collected => {
    if(!collected.size) return baschannel.send('**Süre Bitti!**\nBu kanal 5 saniye sonra silinecektir').then(
      setTimeout(function() {
        baschannel.delete();
         }, 5000));
    baschannel.send('**Başvurunuz Başarıyla iletilmiştir!**\nBu kanal 5 saniye sonra silinecektir').then(
      setTimeout(function() {
        baschannel.delete();
         }, 5000));
    let sayac = 0
    
    const onybuton = new disbut.MessageButton()
    .setLabel('Onayla')
    .setStyle('green')
    .setID('onay');
    const redbuton = new disbut.MessageButton()
    .setLabel('Reddet')
    .setStyle('red')
    .setID('red');
    let row = new disbut.MessageActionRow()
    .addComponents(onybuton, redbuton);

    const log = new Discord.MessageEmbed()
    .setAuthor(message.author.username + ` (${message.author.id})`, message.author.avatarURL({dynamic: true}))
	.setTitle('Yeni Başvuru Geldi!')
	.setDescription('Aşağıdaki butonlardan onay/red işlemlerini gercekleştirebilirsiniz')
    .setColor('BLUE')
    .addField('Başvuran Hakkında',[
      `**İsim ve Yaş: **\t\t${collected.map(m => m.content).slice(0,1)}`,
      `**Günde 3 Saatten Fazla Aktif Olabilecek mi ?: **\t\t${collected.map(m => m.content).slice(1,2)}`,
      `**Günde Ne Kadar İnvite Kasabilirsin?: **\t\t${collected.map(m => m.content).slice(2,3)}`,
      `**Discord Profilini Çevrimiçi Bırakabilir mi?: **\t\t${collected.map(m => m.content).slice(3,4)}`,
	  `**Her Kullanıcıdan Sesli Teyit Alabilecek misin?: **\t\t${collected.map(m => m.content).slice(4,5)}`,
          `**Bionuza .gg/vestia Yazabilir Misin ??: **\t\t${collected.map(m => m.content).slice(5,6)}`,
      `**Neden Biz ?: **\t\t${collected.map(m => m.content).slice(6,7)}`
    ])
    .setTimestamp()
    .setFooter('Vestia Yetkili Başvuru Sistemi', message.guild.iconURL());
    client.channels.cache.get(ayar.yetkililog).send({
		buttons: [onybuton, redbuton],
	    embed: log}).then(async m => {
      db.set(`basvur.${m.id}`, message.author.id);
    })

  })
  
})
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['başvuru']
}
exports.help = {
  name: 'başvur'
}