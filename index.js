require("dotenv").config();
const config = require("./config/source.json");
const cron = require("node-cron");
const express = require("express");
const app = express();

// fetchers
const { fetchJPMCJobs } = require("./fetchers/jpmc");
const { fetchMorganStanleyJobs } = require("./fetchers/morganstanley");
const { fetchCiscoJobs } = require("./fetchers/cisco");
const { fetchGoldmanJobs } = require("./fetchers/goldmansachs");
const { fetchAdobeJobs } = require("./fetchers/adobe");
const { fetchGreenhouseJobs } = require("./fetchers/greenhouse");

const { loadState, saveState, updateSeenIds } = require("./engine/state");
const { sendEmail } = require("./utils/mailer");

let isRunning = false;

// Map
const fetcherMap = {
    jpmc: fetchJPMCJobs,
    morganstanley: fetchMorganStanleyJobs,
    cisco: fetchCiscoJobs,
    goldmansachs: fetchGoldmanJobs,
    adobe: fetchAdobeJobs
};

console.log("---------------------- START -------------------------");
console.log("RUN:", new Date().toISOString());

function formatDate(date) {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
}

// 🔥 COMMON HANDLER (REUSED)
async function handleJobs(name, jobs) {
    console.log(`Fetched ${jobs.length} jobs`);

    let state = await loadState(name);
    const seenSet = new Set(state.seen_ids);

    const newJobs = [];

    for (let job of jobs) {
        if (!seenSet.has(job.id)) {
            newJobs.push(job);
        }
    }

    if (newJobs.length > 0) {
        console.log(`\nNew Jobs (${newJobs.length}) for ${name}:\n`);

        newJobs.forEach((job, index) => {
            console.log(`Job ${index + 1}:`);
            console.log(`ID        : ${job.id}`);
            console.log(`Title     : ${job.title}`);
            console.log(`Location  : ${job.location}`);
            console.log(`Posted At : ${formatDate(job.postedAt)}`);
            console.log(`URL       : ${job.url}`);
            console.log("--------------------------------------------------");
        });

        // await sendEmail(name, newJobs);
    } else {
        console.log(`No new jobs for ${name}`);
    }

    const newIds = jobs.map(j => j.id);
    state.seen_ids = updateSeenIds(state.seen_ids, newIds);

    await saveState(name, state);
}

// 🔥 GREENHOUSE PER COMPANY PROCESSING
async function processGreenhouseCompany(company) {
    const name = `greenhouse_${company}`;

    console.log(`\nProcessing: ${name}`);

    try {
        const jobs = await fetchGreenhouseJobs([company]);
        await handleJobs(name, jobs);
    } catch (err) {
        console.error(`Error processing ${name}:`, err.message);
    }
}

// 🔥 MAIN PROCESSOR
async function processCompany(org) {
    const { name, url } = org;

    try {
        console.log(`\nProcessing: ${name}`);

        // 🔥 PLATFORM HANDLING
        if (org.type === "platform" && name === "greenhouse") {
            for (const company of org.companies) {
                await processGreenhouseCompany(company);
            }
            return;
        }

        // NORMAL FLOW
        const fetcher = fetcherMap[name];

        if (!fetcher) {
            console.log(`No fetcher found for ${name}`);
            return;
        }

        const jobs = await fetcher(url);
        await handleJobs(name, jobs);

    } catch (err) {
        console.error(`Error processing ${name}:`, err.message);
    }
}

// MAIN
async function main() {
    const organisations = config.organisations;

    for (let org of organisations) {
        await processCompany(org);
    }

    console.log("---------------------- END -------------------------\n");
}

// EXPRESS (for Render)
app.get("/", (req, res) => {
    res.send("Running");
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

// CRON
// cron.schedule("*/3 * * * *", async () => {
//     if (isRunning) {
//         console.log("Skipping run, previous still executing");
//         return;
//     }

//     isRunning = true;
//     console.log("Starting job at:", new Date().toISOString());

//     try {
//         await main();
//     } catch (err) {
//         console.error("Main job failed:", err.message);
//     } finally {
//         isRunning = false;
//     }
// });

main()