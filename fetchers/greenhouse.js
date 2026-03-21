async function fetchGreenhouseJobs(companies) {
    const allJobs = [];

    for (const company of companies) {
        const url = `https://boards-api.greenhouse.io/v1/boards/${company}/jobs`;

        try {
            console.log(`Fetching Greenhouse: ${company}`);

            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();

            if (!data?.jobs || !Array.isArray(data.jobs)) {
                console.log(`Invalid response for ${company}`);
                continue;
            }

            const jobs = data.jobs
                .map(job => {
                    const postedAt = job.updated_at
                        ? new Date(job.updated_at)
                        : job.created_at
                        ? new Date(job.created_at)
                        : null;

                    return {
                        id: `${company}_${job.id}`,
                        title: job.title || "N/A",
                        location: job.location?.name || "N/A",
                        postedAt,
                        url: job.absolute_url || "N/A"
                    };
                })
                // Filter India only (optional but recommended)
                .filter(job =>
                    job.location.toLowerCase().includes("india")
                );

            allJobs.push(...jobs);

        } catch (err) {
            console.error(`Greenhouse error (${company}):`, err.message);
        }
    }

    // 🔥 GLOBAL SORT (VERY IMPORTANT)
    allJobs.sort((a, b) => {
        if (!a.postedAt) return 1;
        if (!b.postedAt) return -1;
        return b.postedAt - a.postedAt;
    });

    return allJobs;
}

module.exports = { fetchGreenhouseJobs };