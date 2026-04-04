async function fetchNvidiaJobs(url) {
    try {
        const allJobs = [];

        for (let i = 0; i < 5; i++) {
            const start = i * 10;

            const pageUrl = `${url}&start=${start}`;

            const res = await fetch(pageUrl);

            if (!res.ok) {
                throw new Error(`HTTP error: ${res.status}`);
            }

            const data = await res.json();

            // Validate structure
            if (
                !data?.data ||
                !Array.isArray(data.data.positions)
            ) {
                throw new Error("Invalid API response structure (NVIDIA)");
            }

            const jobs = data.data.positions;

            // Normalize (same as your pattern)
            const parsed = jobs.map(job => ({
                id: job.id,
                title: job.name || "N/A",
                location: job.locations?.join(", ") || "",
                postedAt: job.postedTs ? new Date(job.postedTs * 1000) : null,
                url: `https://jobs.nvidia.com${job.positionUrl}`
            }));

            allJobs.push(...parsed);
        }

        return allJobs;

    } catch (err) {
        console.error("NVIDIA Fetch Error:", err.message);
        throw err;
    }
}

module.exports = { fetchNvidiaJobs };