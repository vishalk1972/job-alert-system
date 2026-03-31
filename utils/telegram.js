const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function formatJobsMessage(company, jobs) {
    let message = `🚀🚀🚀 *${company.toUpperCase()}*\n`;
    message += `━━━━━━━━━━━━━━━━━━\n`;
    message += `🔥 ${jobs.length} New Jobs\n\n`;

    jobs.forEach((job, i) => {
        message += `${i + 1}. ${job.title}\n`;
        message += `📍 ${job.location || "N/A"}\n`;
        message += `🕒 ${job.postedAt || "N/A"}\n`;
        message += `🔗 ${job.url}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━`;

    return message;
}

// 📤 Send message
async function sendTelegram(company, jobs) {
    if (!jobs || jobs.length === 0) return;

    try {
        const message = formatJobsMessage(company, jobs);

        const res = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    disable_web_page_preview: true
                })
            }
        );

        const data = await res.json();

        if (!data.ok) {
            throw new Error(JSON.stringify(data));
        }

        console.log(`✅ Telegram sent: ${company} (${jobs.length} jobs)`);
    } catch (err) {
        console.error("❌ Telegram failed:", err.message);
    }
}

module.exports = { sendTelegram };