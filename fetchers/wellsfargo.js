async function fetchWellsFargoJobs(url) {
    const allJobs = [];

    try {
        let offset = 0;
        const limit = 20;

        while (offset < 60) { 

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    appliedFacets: {
                        locationCountry: ["c4f78be1a8f14da0ab49ce1162348a5e"],
                        jobFamilyGroup: [
                            "b5c3287c76c20100b318a19542940001",
                            "b5c3287c76c20100b3189b6fdb430000"
                        ]
                    },
                    limit,
                    offset,
                    searchText: ""
                })
            });

            if (!res.ok) {
                throw new Error(`HTTP error: ${res.status}`);
            }

            const data = await res.json();

            if (!data?.jobPostings) {
                throw new Error("Invalid Wells Fargo response");
            }

            total = data.total || 0;

            const jobs = data.jobPostings.map(job => {
                const id = job.bulletFields?.[0] || job.externalPath;

                return {
                    id,
                    title: job.title,
                    location: job.locationsText,
                    postedAt: job.postedOn, // raw string (fine)
                    url: `https://wd1.myworkdaysite.com/en-US/recruiting/wf/WellsFargoJobs${job.externalPath}`
                };
            });

            allJobs.push(...jobs);

            offset += limit;
        }

        return allJobs;

    } catch (err) {
        console.error("Wells Fargo fetch error:", err.message);
        return [];
    }
}

module.exports = { fetchWellsFargoJobs };