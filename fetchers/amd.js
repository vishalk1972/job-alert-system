async function fetchAMDJobs(url) {
    try {
        const allJobs = [];

        // AMD uses page-based pagination
        for (let page = 1; page <= 5; page++) {
            const pageUrl = `${url}&page=${page}`;

            const res = await fetch(pageUrl);

            if (!res.ok) {
                throw new Error(`HTTP error: ${res.status}`);
            }

            const data = await res.json();

            // Validate structure
            if (
                !data?.jobs ||
                !Array.isArray(data.jobs)
            ) {
                throw new Error("Invalid API response structure (AMD)");
            }

            const jobs = data.jobs;

            const parsed = jobs.map(job => {
                const j = job.data;

                return {
                    id: j.req_id,
                    title: j.title || "N/A",
                    location: j.full_location || "",
                    postedAt: j.posted_date ? new Date(j.posted_date) : null,
                    url: j.meta_data?.canonical_url
                };
            });

            allJobs.push(...parsed);
        }

        return allJobs;

    } catch (err) {
        console.error("AMD Fetch Error:", err.message);
        throw err;
    }
}

module.exports = { fetchAMDJobs };