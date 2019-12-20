const sgmail=require('@sendgrid/mail')
const sendgridApiKey='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'

sgmail.setApiKey(sendgridApiKey)

const sendWelcomeEmail = (email,name) => {
    console.log(email,name)
    sgmail.send({
        to:email,
        from:'sakethreddy2341@gmail.com',
        subject:'Thanks for joining in!',
        text:`welcome to the app, ${name}.let me know you get along with app`
    })
}

 const sendCancelationEmail = (email,name) => {
     sgmail.send({
        to:email,
        from:'sakethreddy2341@gmail.com',
        subject:'I Hope u enjoyed ur app services',
        text:`I hope u can tell us why u cancelled the app or reoved account`
     })
 }   

//  sendWelcomeEmail('sakethreddy2341@gmail.com','saketh')
    module.exports = {
        sendWelcomeEmail,
        sendCancelationEmail
    }
