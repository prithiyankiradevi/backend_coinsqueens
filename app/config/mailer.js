const nodemailer = require('nodemailer');
const {google} = require('googleapis');

const HELLO_CLIENT_ID = "1858770263-k0ujej7pf03giqpi72tvqrk048ehahucvf1.apps.googleusercontent.com";
const HELLO_CLIENT_SECRET = "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";
const HELLO_REDIRECT_URI = "https://developers.google.com/oauthplayground";
const HELLO_REFRESH_TOKEN = "1//04_NvyF-BSexxCgYIfARAAGAQSgNwF-L9Ir2M7Er2NQCofIWMexhrRUDbhrT6nz7hAbkG3K5FwHseRNEIC5AShsB4EbSHRZCCtu5d4so";


const oAuth2ClientsHello = new google.auth.OAuth2(
    HELLO_CLIENT_ID,
    HELLO_CLIENT_SECRET,
    HELLO_REDIRECT_URI
);

oAuth2ClientsHello.setCredentials({ refresh_token: HELLO_REFRESH_TOKEN });

const SALES_CLIENT_ID = "653870519151-l2o43ttgkdiglng22aqgcaoe2bgh6uim6s4l.apps.googleusercontent.com";
const SALES_CLIENT_SECRET = "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Y";
const SALES_REDIRECT_URI = "https://developers.google.com/oauthplayground";
const SALES_REFRESH_TOKEN = "1//0404mCvZz1gvnfCgYIARAAGAQSNwF-L9IrMHvXhvd7kmoogU6_CKscFYhgL8josvu4pOHbvkbmN-oU5WUPqVhtlGrorj20Z4pKjLPdN8";


const oAuth2ClientSSales = new google.auth.OAuth2(
    SALES_CLIENT_ID,
    SALES_CLIENT_SECRET,
    SALES_REDIRECT_URI
);

oAuth2ClientSSales.setCredentials({ refresh_token: SALES_REFRESH_TOKEN });


exports.sendMailToClient = async(request,result)=>{
  
    try {

      const req = request
      
        const accessTokenSales = await oAuth2ClientSSales.getAccessToken();
    
        const transportSales = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: 'sales@coinsqueens.com',
            clientId: SALES_CLIENT_ID,
            clientSecret: SALES_CLIENT_SECRET,
            refreshToken: SALES_REFRESH_TOKEN,
            accessToken: accessTokenSales,
          },
        });

        const mailOptionsSales = {
            from: 'sales@coinsqueens.com',
            to: req.emailid,
            subject: 'Thankyou For your Interest : '+req.enquirer,
            html: 'Hi '+req.enquirer+', <br> Thankyou for expressing your interest on CoinsQueens.<br>Our respective sales person will reach you soon.<br>Thanks and regards.,<br>CoinsQueens Team.'
        };
      
        const res = await transportSales.sendMail(mailOptionsSales);
        if(res){
            const accessTokenHello = await oAuth2ClientsHello.getAccessToken();
    
            const transportHello = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'hello@coinsqueens.com',
                clientId: HELLO_CLIENT_ID,
                clientSecret: HELLO_CLIENT_SECRET,
                refreshToken: HELLO_REFRESH_TOKEN,
                accessToken: accessTokenHello,
            },
            });

            const mailOptionsHello = {
                from: 'hello@coinsqueens.com',
                to: 'sales@coinsqueens.com',
                subject: 'New Lead From '+req.enquirer+', [ '+req.emailid+', '+req.mobile+' ]',
                html: '<table>'+
                '<tr><th>Enquirer Name</th><td>'+req.enquirer+'</td></tr>'+
                '<tr><th>Enquirer E-Mail</th><td>'+req.emailid+'</td></tr>'+
                '<tr><th>Enquirer Contact</th><td>'+req.mobile+'</td></tr>'+
                '<tr><th>Enquirer Ip addess</th><td>'+req.location+'</td></tr>'+
                '<tr><th>Enquiry</th><td>'+req.message+'</td></tr>'+
                '</table>'
            };
        
            const response = await transportHello.sendMail(mailOptionsHello);
            result(null, response);
        }
        result(null, res);
      } catch (error) {
        result(true, error.message);
      }
};
