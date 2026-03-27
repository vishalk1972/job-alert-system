async function fetchPaypalJobs(url) {
    const allJobs = [];

    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        if (!data?.data || !Array.isArray(data.data.positions)) {
            throw new Error("Invalid API response structure (PayPal)");
        }

        const jobs = data.data.positions;

        for (const job of jobs) {
            allJobs.push({
                id: job.id,
                title: job.name || "N/A",
                location: job.locations?.[0] || "",
                postedAt: job.postedTs
                    ? new Date(job.postedTs * 1000)
                    : null,
                url: job.id
                    ? `https://paypal.eightfold.ai/careers/job/${job.id}?domain=paypal.com&hl=en`
                    : null
            });
        }

        allJobs.sort((a, b) => {
            if (!a.postedAt) return 1;
            if (!b.postedAt) return -1;
            return b.postedAt - a.postedAt;
        });
        
        return allJobs;

    } catch (err) {
        console.error("PayPal Fetch Error:", err.message);
        throw err;
    }
}

module.exports = { fetchPaypalJobs };