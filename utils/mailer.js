// const nodemailer = require("nodemailer");

// //Create transporter (Gmail for now)
// const transporter = nodemailer.createTransport({
//     // service: "gmail"
//     host: "smtp.gmail.com", // added for render can be removed later
//     port: 465, // added for render can be removed later
//     secure: true,
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASS
//     },
//     family: 4, // added for render can be removed later
// });

// //Format jobs nicely
// function formatJobs(jobs) {
//     return jobs.map((job, i) => `
// ${i + 1}. ${job.title}
// Location : ${job.location}
// Posted   : ${job.postedAt}
// Link     : ${job.url}
// `).join("\n----------------------\n");
// }

// //Send email
// async function sendEmail(company, jobs) {
//     if (!jobs.length) return;

//     const mailOptions = {
//         from: process.env.EMAIL,
//         to: process.env.EMAIL,
//         subject: ` ALERT ${jobs.length} New Jobs - ${company}`,
//         text: formatJobs(jobs)
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         console.log("Email sent successfully");
//     } catch (err) {
//         console.error("Email failed:", err.message);
//     }
// }

// module.exports = { sendEmail };



// const { Resend } = require("resend");

// const resend = new Resend(process.env.RESEND_API_KEY);

// // Format HTML email
// function formatJobsHTML(company, jobs) {
//     return `
//     <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//         <h2 style="color: #2c3e50;">🚀 ${jobs.length} New Jobs - ${company}</h2>
//         <hr/>

//         ${jobs.map((job, i) => `
//             <div style="margin-bottom: 20px;">
//                 <h3 style="margin: 0; color: #34495e;">
//                     ${i + 1}. ${job.title}
//                 </h3>
//                 <p style="margin: 5px 0;">
//                     <strong>📍 Location:</strong> ${job.location || "N/A"}
//                 </p>
//                 <p style="margin: 5px 0;">
//                     <strong>🕒 Posted:</strong> ${job.postedAt || "N/A"}
//                 </p>
//                 <p style="margin: 5px 0;">
//                     <a href="${job.url}" target="_blank" 
//                        style="color: #1d4ed8; text-decoration: none;">
//                        🔗 View Job
//                     </a>
//                 </p>
//                 <hr/>
//             </div>
//         `).join("")}

//         <p style="color: #7f8c8d; font-size: 12px;">
//             This is an automated alert from your Job Alert System.
//         </p>
//     </div>
//     `;
// }

// // Send email
// async function sendEmail(company, jobs) {
//     if (!jobs.length) return;

//     try {
//         await resend.emails.send({
//             from: "onboarding@resend.dev", // can change later
//             to: [process.env.EMAIL,process.env.EMAIL2],
//             subject: `${jobs.length} New Jobs - ${company}`,
//             html: formatJobsHTML(company, jobs)
//         });

//         console.log("Email sent successfully (Resend)");

//     } catch (err) {
//         console.error("Email failed:", err.message);
//     }
// }

// module.exports = { sendEmail };


const SibApiV3Sdk = require("sib-api-v3-sdk");

// Configure API key
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Format HTML email
function formatJobsHTML(company, jobs) {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #2c3e50;">🚀 ${jobs.length} New Jobs - ${company}</h2>
        <hr/>

        ${jobs.map((job, i) => `
            <div style="margin-bottom: 20px;">
                <h3 style="margin: 0; color: #34495e;">
                    ${i + 1}. ${job.title}
                </h3>
                <p><strong>📍 Location:</strong> ${job.location || "N/A"}</p>
                <p><strong>🕒 Posted:</strong> ${job.postedAt || "N/A"}</p>
                <p>
                    <a href="${job.url}" target="_blank" 
                       style="color: #1d4ed8;">
                       🔗 View Job
                    </a>
                </p>
                <hr/>
            </div>
        `).join("")}

        <p style="color: #888; font-size: 12px;">
            Automated job alerts system
        </p>
    </div>
    `;
}

// Send email
async function sendEmail(company, jobs) {
    if (!jobs.length) return;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = `🚀 ${jobs.length} New Jobs - ${company}`;

    sendSmtpEmail.htmlContent = formatJobsHTML(company, jobs);

    sendSmtpEmail.sender = {
        name: "Job Alerts",
        email: process.env.EMAIL // must be verified
    };

    // Multiple recipients supported
    sendSmtpEmail.to = [
        { email: process.env.EMAIL }, // you
        { email: process.env.EMAIL1 },
        { email: process.env.EMAIL2 }
    ];

    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("Email sent successfully:", response.messageId);
    } catch (err) {
        console.error("Email failed:", err.response?.body || err.message);
    }
}

module.exports = { sendEmail };