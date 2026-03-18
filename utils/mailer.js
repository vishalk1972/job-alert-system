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



const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

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
                <p style="margin: 5px 0;">
                    <strong>📍 Location:</strong> ${job.location || "N/A"}
                </p>
                <p style="margin: 5px 0;">
                    <strong>🕒 Posted:</strong> ${job.postedAt || "N/A"}
                </p>
                <p style="margin: 5px 0;">
                    <a href="${job.url}" target="_blank" 
                       style="color: #1d4ed8; text-decoration: none;">
                       🔗 View Job
                    </a>
                </p>
                <hr/>
            </div>
        `).join("")}

        <p style="color: #7f8c8d; font-size: 12px;">
            This is an automated alert from your Job Alert System.
        </p>
    </div>
    `;
}

// Send email
async function sendEmail(company, jobs) {
    if (!jobs.length) return;

    try {
        await resend.emails.send({
            from: "onboarding@resend.dev", // can change later
            to: process.env.EMAIL,
            bcc:[
                process.env.EMAIL1,
                process.env.EMAIL2
            ],
            subject: `${jobs.length} New Jobs - ${company}`,
            html: formatJobsHTML(company, jobs)
        });

        console.log("Email sent successfully (Resend)");

    } catch (err) {
        console.error("Email failed:", err.message);
    }
}

module.exports = { sendEmail };