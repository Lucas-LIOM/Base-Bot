// Módulos e constantes essenciais
// [!] Não remova!
const {
	MessageOptions,
	WAFlag,
	WANode,
	WAMetric,
	ChatModification,
	DisconectReason,
	MessageTypeProto,
    WAConnection,
	WALocationMessage,
	ReconnectMode,
	WAContextInfo,
	proto,
	ProxyAgent,
	waChatKey,
	MimetypeMap,
	MediaPathMap,
	WAContactMessage,
	WAContactsArrayMessage,
	WAGroupInviteMessage,
	WATextMessage,
	WAMessageContent, 
	WAMessage, 
	BaileysError, 
	WA_MESSAGE_STATUS_TYPE, 
	MediaConnInfo, 
	URL_REGEX, 
	WAUrlInfo, 
	WA_DEFAULT_EPHEMERAL, 
	WAMediaUpload,
	mentionedJid,
	processTime,
	Browser,
	MessageType,
	Presence,
	WA_MESSAGE_STUB_TYPES,
	Mimetype,
	relayWAMessage,
    GroupSettingChange
} = require('@adiwajshing/baileys')

const { color, bgcolor } = require('./lib/color')
const { menu } = require('./src/menus/menu')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const { fetchJson, fetchText } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const fs = require('fs')
const moment = require('moment-timezone')
const { exec } = require('child_process')
const ffmpeg = require('fluent-ffmpeg')
const { removeBackgroundFromImageFile } = require('remove.bg')
const setting = JSON.parse(fs.readFileSync('./src/jsons/settings.json'))

prefix = setting.prefix
verification = setting.verification
blocked = []

	// Caso queira mudar o Banner (logo que aparece Base Bot Whatsapp quando você inicia no terminal) 
	// basta encontrar o arquivo functions.js e descer até o final procurando ('BASE|BOT|WHATSAPP') 
	// entre os parametros, então você muda ali, o | serve para dar o espaço entre as linhas

	
function kyun(seconds){
	function pad(s){
	  return (s < 10 ? '0' : '') + s;
	}
	var hours = Math.floor(seconds / (60*60));
	var minutes = Math.floor(seconds % (60*60) / 60);
	var seconds = Math.floor(seconds % 60);
	return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
  }
  
  async function starts() {
	  const bot = new WAConnection()
	  
	  bot.logger.level = 'warn'
	  console.log(banner.string)
	  bot.on('qr', () => {
		  console.log(color('[','white'), color('!','red'), color(']','white'), color('escaneie o código qr'))
	  })
  
	  fs.existsSync('./BaseBot.json') && bot.loadAuthInfo('./BaseBot.json') // Verifica que já tem um número conectado
	  bot.on('connecting', () => {
		  start('2', 'Conectando com o Bot-Base...') // Aguardando para conectar com o numero
	  })
	  bot.on('open', () => {
		  success('2', 'Bot-Base conectada') // Número/Bot conectado e funcionando
	  })
	
	await bot.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./BaseBot.json', JSON.stringify(bot.base64EncodedAuthInfo(), null, '\t'))

	bot.on('CB:Blocklist', json => {
            if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

	bot.on('chat-update', async (mek) => {
		try {
            if (!mek.hasNewMessage) return
            mek = mek.messages.all()[0]
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (mek.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const time = moment.tz('America/Sao_Paulo').format('HH:mm:ss')
            body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)

			// O Mess são aquelas mensagens que mostra quando dá algum erro ou foi bem sucedido o comando.
			// Modifique-o da forma que quiser, lembre-se que se for trocar os nomes dos códigos, terá que
			// Trocar em todos os códigos que houver tal comando

			mess = { 
				wait: '⌛ Aguarde',
				succefull: '✔️ Pronto',
				erro: {
					figu: '❌ Ocorreu um erro ao criar a figurinha',
				},
				only: {
					group: '❌ Este comando só pode ser usado em grupos! ❌',
					ownerGroup: '❌ Este comando só pode ser usado pelo proprietário do grupo! ❌',
					ownerBot: '❌ Este comando só pode ser usado pelo dono do bot! ❌',
					adm: '❌ Este comando só pode ser usado por administradores de grupo! ❌',
					botAdm: '❌ Este comando só pode ser usado quando o bot é um administrador!❌ '
				}
			}

			const botNumber = bot.user.jid
			const ownerNumber = [`${setting.ownerNumber}@s.whatsapp.net`]
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await bot.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
            pushname = bot.contacts[sender] != undefined ? bot.contacts[sender].vname || bot.contacts[sender].notify : undefined
			const isOwner = ownerNumber.includes(sender)
			const freply = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": verification, "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync(`assets/botlogo.webp`)} } }
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				bot.sendMessage(from, teks, text, {quoted:mek})
			}
			const sendMess = (hehe, teks) => {
				bot.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? bot.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : bot.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
			}
						

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			
			// Comandos que aparecem no terminal
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mCOMANDO\x1b[1;37m]', time, color(command), 'de', color(pushname), color(sender.split('@')[0]),'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mCOMANDO\x1b[1;37m]', time, color(command), 'de', color(pushname), color(sender.split('@')[0]), 'grupo', color(groupName), 'args :', color(args.length))

			// Mensagens que aparecem no terminal
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mMENSAGEM\x1b[1;37m]', time, color('Mensagem'), 'de', color(pushname), color(sender.split('@')[0]), 'args :', color(args.length))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mMENSAGEM\x1b[1;37m]', time, color('Mensagem'), 'de', color(pushname), color(sender.split('@')[0]), 'grupo', color(groupName), 'args :', color(args.length))
			
            let authorname = bot.contacts[from] != undefined ? bot.contacts[from].vname || bot.contacts[from].notify : undefined	
			if (authorname != undefined) { } else { authorname = groupName }	
			
			function addMetadata(packname, author) {	

				if (!packname) packname = 'Lukas'; // Altere aqui o nome que vai aparecer em baixo de sua sticker
				if (!author) author = 'Bot';	


				author = author.replace(/[^a-zA-Z0-9]/g, '');	
				let name = `${author}_${packname}`
				if (fs.existsSync(`./src/stickers/${name}.exif`)) return `./src/stickers/${name}.exif`
				const json = {	
					"sticker-pack-name": packname,
					"sticker-pack-publisher": author,
				}
				const littleEndian = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00])	
				const bytes = [0x00, 0x00, 0x16, 0x00, 0x00, 0x00]	

				let len = JSON.stringify(json).length	
				let last	

				// [!] NÃO APAGUE ESSA LINHA
				if (len > 256) {len = len - 256,bytes.unshift(0x01)} else {bytes.unshift(0x00)}if (len < 16) {last = len.toString(16),last = "0" + len} else {last = len.toString(16)}	

				const buff1 = Buffer.from(last, "hex")	
				const buff2 = Buffer.from(bytes)	
				const buff3 = Buffer.from(JSON.stringify(json))	
				const buffer = Buffer.concat([littleEndian, buff1, buff2, buff3])	

				fs.writeFile(`./src/stickers/${name}.exif`, buffer, (err) => {	
					return `./src/stickers/${name}.exif`	
				})
			}

			switch(command) {

				// * * * Start menus * * * \\
				// Coloque aqui os comandos de seus menus

				case 'comandos':
				case 'menu':
					bot.sendMessage(from, menu(prefix), text,{quoted: freply})
				break

				// Coloque aqui os comandos de seus menus
				// * * * Fim dos menus * * * \\
				

				// * * * Start commands * * * \\

				// É aqui a onde você vai programar e montar seus próprios comandos <3
				// Deixei o comando de figurinha por ser um dos mais "dificeis" de montar
				// Para usa-lo, utilize marcando uma foto ou video e então, de o comando
				// Lembrando, todos os comandos sempre terá o prefixo que você definiu 
				// No config.json, por padrão ele vem como ".", utilize dessa forma em
				// Todos os comandos:
				//
				// Exemplo: .sticker

				case 'stiker':
				case 'sticker':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						reply(mess.wait)
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await bot.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.erro.figu)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ${addMetadata('Lukas', authorname)} ${ran} -o ${ran}`, async (error) => {
									if (error) return reply(mess.erro.figu)
									bot.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
									fs.unlinkSync(media)	
									fs.unlinkSync(ran)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await bot.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						reply(mess.wait)
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`｢❌｣ Falha ao converter ${type} em sticker`)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ${addMetadata('Lukas', authorname)} ${ran} -o ${ran}`, async (error) => {
									if (error) return reply(mess.erro.figu)
									bot.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
									fs.unlinkSync(media)
									fs.unlinkSync(ran)
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await bot.downloadAndSaveMediaMessage(encmedia)
						ranw = getRandom('.webp')
						ranp = getRandom('.png')
						reply(mess.wait)
						keyrmbg = 'Your-ApiKey'
						await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg, size: 'auto', type: 'auto', ranp}).then(res => {
							fs.unlinkSync(media)
							let buffer = Buffer.from(res.base64img, 'base64')
							fs.writeFileSync(ranp, buffer, (err) => {
								if (err) return reply('Falha, ocorreu um erro, tente novamente mais tarde. ')
							})
							exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
								fs.unlinkSync(ranp)
								if (err) return reply(mess.erro.figu)
								exec(`webpmux -set exif ${addMetadata('BOT', authorname)} ${ranw} -o ${ranw}`, async (error) => {
									if (error) return reply(mess.erro.figu)
									bot.sendMessage(from, fs.readFileSync(ranw), sticker, {quoted: mek})
									fs.unlinkSync(ranw)
								})
							})
						})
					} else {
						reply(mess.stickeronly, `﹝❗﹞Marque uma imagem`)
					}
					break

				case 'toimg':
				case 'img':
					if (!isQuotedSticker) return reply('｢❌｣ Utilize somente com figurinhas')
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await bot.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply(' ｢❌｣ Erro ao converter imagem')
						buffer = fs.readFileSync(ran)
						bot.sendMessage(from, buffer, image, {quoted: mek, caption: '>//<'})
						fs.unlinkSync(ran)
					})
					break
					

				default:											          	
				if (isGroup && !isCmd && budy != undefined) {/* [!] Recomendo não colocar um reply aqui dentro caso não queira erros.*/}
				// Nesse If ele verifica se a mensagem é um comando ou não
				
				else {console.log(color('[ERROR]','red'), 'Comando não registrado de', color(sender.split('@')[0]))}}
				// Se não existir um comando do Switch, ele cai no else já que não tem nenhum comando desse tipo

		} catch (e) { // Se ouver algum tipo de erro/exceção cai no Catch e printa o erro no terminal e mostra ao usuário
			e = String(e) // Passa a exceção para string
			if (e.includes('this.isZero')){return}
			console.log('Error : %s', color(e, 'red')) // Printa no console a mensagem de erro em vermelho [ERROR]
  }
 })
}

starts() // Inicia o seu projeto/bot ----> Não exclua!!