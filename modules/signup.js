module.exports = (ctx)=>{
    ctx.telegram.sendMessage(ctx.chat.id , `Thank you for participating in our airdrop. Please do not leave any of our social media platforms. \n\nAirdrop will end after presale and 7500 random lucky participant will each be rewarded with 50,000 Deem tokens. \n\nReward rule for top 50 referrers: \n▪️ Top 1 = $1000 Deem \n▪️ Top 2-5 = $100 Deem \n▪️ Top 6-10 = $50 Deem \n▪️ Top 11-50 = $25 Deem \n\nShare your referral link and increase your chances to be the one \n\n🔗 Your Referral link: \nhttps://t.me/${ctx.botInfo.username}?start=${ctx.chat.id}`,{
        reply_markup:{
            keyboard: [
                [{text: "🌍 Official Website"}],
                [{text: "👤 Account"},{text: "📑 Information"}],
                [{text: "✅ Rules"},{text: "🔰 About"}]
            ],
            resize_keyboard: true
        }
    }).catch((e)=>console.log(e))
}