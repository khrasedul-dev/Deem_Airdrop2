bot.command('/captcha',ctx=>{

    ctx.session = {}

    const cap = svgCaptcha.create
        
    const svg = cap.data
    const text = cap.text

    svg2img(svg,(e,b)=>{
        fs.writeFileSync(ctx.chat.id+".png",b)
        ctx.session.captcha = text
        ctx.replyWithPhoto({source: fs.readFileSync(ctx.chat.id+'.png') })
    })


})

bot.on('text',ctx=>{

    const input = ctx.update.message.text
    const genCap = ctx.session.captcha

    if (input === genCap) {

        ctx.reply('success')
        
    }else{

        const cap = svgCaptcha.create
        
        const svg = cap.data
        const text = cap.text
    
        svg2img(svg,(e,b)=>{
            fs.writeFileSync(ctx.chat.id+".png",b)
            ctx.session.captcha = text
            ctx.replyWithPhoto({source: fs.readFileSync(ctx.chat.id+'.png') })
        })

    }
})






👥 💴 🎞 📂