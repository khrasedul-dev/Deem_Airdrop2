const {Telegraf , Composer, session , Stage , WizardScene} = require('micro-bot')
const fs = require('fs')
const svg2img = require('svg2img')
const svgCaptcha = require('svg-captcha')
const mongoose = require('mongoose')

const checkGroup = require('./model/checkGroup')
const userModel = require('./model/userModel')
const signup = require('./modules/signup')
const join = require('./modules/join')


// const bot = new Telegraf('5117445796:AAEfW0KfF3x1UsI1jNl0O7n3WDhszKuAlZs')
const bot = new Composer()

mongoose.connect('mongodb+srv://rasedul20:rasedul20@telegramproject.iznkc.mongodb.net/Deem_Airdrop',{useNewUrlParser:true,useUnifiedTopology:true}).catch((e)=>{
        console.log(e)
}).then((d)=>console.log('Database connected')).catch((e)=>console.log(e))


const joinbonus = 50000
const ref_bonus = 25000

bot.use(session())


const userStep = new WizardScene('userStep',

    ctx=>{

        ctx.telegram.sendMessage(ctx.chat.id , `Hello ${ctx.from.first_name} ! To participate in our Airdrop, first please 👇 \n\n▪️Join our Telegram Group.\nhttps://t.me/deemtoken \n▪️Join our Telegram Channel.\nhttps://t.me/deemnews \n\nClick the '✅ Check' button if done..`,{
            reply_markup: {
                inline_keyboard: [
                    [{text: "✅ Check" , callback_data: "checkGroup"}]
                ]
            }
        }).catch((e)=>console.log(e))

        return ctx.wizard.next()
    },
    ctx=>{

        checkGroup.find({userId: ctx.from.id}).then((users)=>{

            if (users.length > 0) {

                ctx.telegram.sendMessage(ctx.chat.id , `✅ Follow us on Twitter\nhttps://twitter.com/deemtoken?t=3w6q51G4d41RlbLijbdglw&s=09 \n▪️Retweet the pinned post \n▪️Tag 3 friends. \n\nThen submit your Twitter profile link: \n(Example: https://twitter.com/username)`,{
                    reply_markup: {
                        remove_keyboard: true
                    }
                }).catch((e)=>console.log(e))

                return ctx.wizard.next()

            } else {
                
                ctx.telegram.sendMessage(ctx.chat.id , `❌ You have not joined. \n\n▪️Join our Telegram Group. \n▪️Join our Telegram Channel. \n\nClick the '✅ Check' button if done..`,{
                    reply_markup: {
                        inline_keyboard: [
                            [{text: "✅ Check" , callback_data: "checkGroup"}]
                        ]
                    }
                }).catch((e)=>console.log(e))

            }
        })

    },
    ctx=>{
        ctx.session.tw = ctx.update.message.text

        ctx.telegram.sendMessage(ctx.chat.id , `▪️ Follow us on Instagram.\nhttps://instagram.com/deemtoken \n\nThen click "✅ Done" button.`,{
            reply_markup: {
                inline_keyboard: [
                    [{text: "✅ Done",callback_data: 'in'}]
                ]
            }
        })

        return ctx.wizard.next()
    },
    ctx=>{
        ctx.telegram.sendMessage(ctx.chat.id , `▪️ Submit your BSC BEP20 wallet address: \n\nDon't have a wallet? \nCreate one with <b>Trust Wallet</b> or <b>MetaMask</b>. \nDon't use <b>Binance</b> or other Exchanges.`,{
            reply_markup: {
                remove_keyboard: true
            },
            parse_mode: 'HTML'
        })

        return ctx.wizard.next()
    },
    ctx=>{
        ctx.session.wallet = ctx.update.message.text

        const cap = svgCaptcha.create()
        
        const svg = cap.data
        const text = cap.text

        svg2img(svg,(e,b)=>{
            fs.writeFileSync(ctx.chat.id+".png",b)
            ctx.session.captcha = text
            ctx.replyWithPhoto({source: fs.readFileSync(ctx.chat.id+'.png') })
        })

        return ctx.wizard.next()
    },
    ctx=>{
        const input = ctx.update.message.text
        const genCap = ctx.session.captcha

        if (input === genCap) {










            
            const ref_id = ctx.session.ref_id
            if (ref_id > 2) {

                userModel.find({userId: ref_id}).then((refer)=>{

                    if(refer.length > 0){

                        const ref_name = refer[0].name
                        const ref_count = refer[0].ref_count
                        const balance = refer[0].balance

                        const data = new userModel({
                            userId: ctx.from.id,
                            name: ctx.from.first_name,
                            username: ctx.from.username,
                            ref_id: ref_id,
                            ref_name: ref_name,
                            ref_count: 0,
                            balance: joinbonus,
                            wallet: ctx.session.wallet,
                            twitter: ctx.session.tw
                        })
                        data.save().then(()=>{

                            const update_data = {
                                ref_count: ref_count+1,
                                balance: balance+ref_bonus
                            }

                            userModel.updateOne({userId: ref_id},update_data).then(()=>{
                                signup(ctx)
                            }).catch((e)=>console.log(e))

                        }).catch((e)=>console.log(e))
        

                    }else{
                        ctx.reply('Your referral is wrong!')
                    }
                }).catch((e)=>console.log(e))


            } else {
                
                const data = new userModel({
                    userId: ctx.from.id,
                    name: ctx.from.first_name,
                    username: ctx.from.username,
                    ref_count: 0,
                    balance: joinbonus,
                    wallet: ctx.session.wallet,
                    twitter: ctx.session.tw
                })
                data.save().then(()=>{
                    signup(ctx)
                }).catch((e)=>console.log(e))

            }
















        }else{

            const cap = svgCaptcha.create()
            
            const svg = cap.data
            const text = cap.text
        
            svg2img(svg,(e,b)=>{
                fs.writeFileSync(ctx.chat.id+".png",b)
                ctx.session.captcha = text
                ctx.replyWithPhoto({source: fs.readFileSync(ctx.chat.id+'.png') })
            })

        }
    }


)

const stage = new Stage([userStep])

bot.use(stage.middleware())


bot.start(ctx=>{
    
    ctx.session = {}
    ctx.session.ref_id = ctx.startPayload


    userModel.find({userId: ctx.from.id}).then((user)=>{
        
        if (user.length> 0) {
            signup(ctx)
        } else {
            join(ctx)
        }

    }).catch((e)=>console.log(e))
    


})

bot.action('join', Stage.enter('userStep'))


bot.action('home',ctx=>{
    signup(ctx)
})

bot.hears('Back',ctx=>{
    signup(ctx)
})




bot.on('new_chat_members',ctx=>{
    const userId = ctx.from.id

    checkGroup.find({userId: ctx.from.id}).then((data)=>{
        if (data.length > 0 ) {
           
            console.log("User exist")
            
        } else {
            const data = new checkGroup({
                userId: ctx.from.id
            })

            data.save().catch((e)=>console.log(e))
        }

    }).catch((e)=>console.log(e))

})


bot.hears('🌍 Official Website',ctx=>{

    ctx.reply('https://www.deemtoken.com/')

})


bot.hears('👤 Account',ctx=>{

    userModel.find({userId: ctx.from.id}).then((user)=>{
        ctx.telegram.sendMessage(ctx.chat.id , `<b>👤 Name:</b> ${user[0].name} \n<b>💴 Balance:</b> ${user[0].balance} \n<b>👥 Total Referrals:</b> ${user[0].ref_count} \n\n<b>🎞 Your Referral link:</b> \nhttps://t.me/${ctx.botInfo.username}?start=${ctx.from.id}`,{
            reply_markup: {
                keyboard: [
                    [{text: "Back"}]
                ],
            },
            parse_mode: "HTML"
        })
    })

})


bot.hears('📑 Information',ctx=>{

    userModel.find({userId: ctx.from.id}).then((user)=>{
        ctx.telegram.sendMessage(ctx.chat.id , `<b>Your Saved Details: </b> \n<b>Wallet:</b> ${user[0].wallet} \n<b>Twitter:</b> ${user[0].twitter} `,{
            reply_markup: {
                keyboard: [
                    [{text: "Back"}]
                ]
            },
            parse_mode: "HTML"
        })
    })

})


bot.hears('✅ Rules',ctx=>{

    ctx.reply(`
    Airdrop Rules:\n▪️ KYC is not required in order to receive the reward tokens.\n▪️ The people you refer to should participate in all the airdrop tasks to be counted as a valid referral.\n▪️ The referral program does not have a limit.\n▪️ Multiple or fake accounts are not allowed and they will be eliminated.\n▪️ Spamming in the Telegram group is not allowed and will not be tolerated.\n▪️ If your submitted data wrong then you can resubmit the data again before airdrop ends.\n▪️ You should continue to follow the tasks you have participated in until the airdrop distribution is completed.\n\nReward rule for top 50 referrers:\n▪️ Top 1 = $1000 Deem\n▪️ Top 2-5 = $100 Deem\n▪️ Top 6-10 = $50 Deem\n▪️ Top 11-50 = $25 Deem
`)

})


bot.hears('🔰 About',ctx=>{

    ctx.reply(`Deem is our foundational currency that allows investors to hold millions or billions \n\nBy using Deem, you can participate in NFT Marketplace, Metaverse World and NFT Merchandise store that runs on the Binance Smart Chain.\n\nEmail: Support@deemtoken.com`)

})




module.exports = bot

// bot.launch().then(()=>console.log('bot started')).catch((e)=>console.log(e))