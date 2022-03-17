module.exports = (ctx)=>{
    ctx.telegram.sendMessage(ctx.chat.id , `Welcome to participate in our airdrop! \n\n✅ Please perform the required tasks to earn 50,000 Deem tokens. \n\n📓 About Deem (DM) Deem is a first-ever Triple Project with the combination of; \n▪️ Metaverse \n▪️ NFT Store \n▪️ NFT Marketplace. \n\n❇️ Airdrop will end after presale and 7500 random lucky participant will be rewarded. \n\n❇️ In addition, the top 50 referrers will get the following rewards 👇 \n\n🎁 Referal Reward \n▪️ Top 1 = $1000 Deem \n▪️ Top 2-5 = $100 Deem \n▪️ Top 6-10 = $50 Deem \n▪️ Top 11-50 = $25 Deem \n\nIf you have any questions, please ask at our Telegram Group. \n\nClick " ✅ Join Airdrop" button to proceed...`, {
        reply_markup: {
            inline_keyboard: [
                [{text: "✅ Join Airdrop" , callback_data: "join"}]
            ]
        }
    }).catch((e)=>console.log(e))
}