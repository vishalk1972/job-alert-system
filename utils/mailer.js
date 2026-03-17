const nodemailer = require("nodemailer");

//Create transporter (Gmail for now)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "vishalkuwar000@gmail.com",
        pass: "ssvd mriz nzdu uhgd"
    }
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
        from: "vishalkuwar000@gmail.com",
        to: "vishalkuwar000@gmail.com",
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