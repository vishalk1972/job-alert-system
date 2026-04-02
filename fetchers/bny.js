async function fetchBNYMellonJobs(url) {
    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`HTTP error: ${res.status}`);
        }

        const data = await res.json();

        // Validate structure
        if (
            !data?.items ||
            !Array.isArray(data.items) ||
            !data.items[0]?.requisitionList
        ) {
            throw new Error("Invalid API response structure (BNY)");
        }

        const jobs = data.items[0].requisitionList;

        // Normalize
        return jobs.map(job => ({
            id: job.Id,
            title: job.Title || "N/A",
            location: job.PrimaryLocation || "",
            postedAt: job.PostedDate ? new Date(job.PostedDate) : null,
            url : `https://eofe.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/BNY-Careers/job/${job.Id}`
        }));

    } catch (err) {
        console.error("BNY Fetch Error:", err.message);
        throw err;
    }
}

module.exports = { fetchBNYMellonJobs };