const nodemailer = require("nodemailer");

//Create transporter (Gmail for now)
const transporter = nodemailer.createTransport({
    // service: "gmail"
    host: "smtp.gmail.com", // added for render can be removed later
    port: 465, // added for render can be removed later
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    },
    family: 4, // added for render can be removed later
});

//Format jobs nicely
function formatJobs(jobs) {
    return jobs.map((job, i) => `
${i + 1}. ${job.title}
Location : ${job.location}
Posted   : ${job.postedAt}
Link     : ${job.url}
`).join("\n----------------------\n");
}

//Send email
async function sendEmail(company, jobs) {
    if (!jobs.length) return;

    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: ` ALERT ${jobs.length} New Jobs - ${company}`,
        text: formatJobs(jobs)
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (err) {
        console.error("Email failed:", err.message);
    }
}

module.exports = { sendEmail };