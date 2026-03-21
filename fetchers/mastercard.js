async function fetchMastercardJobs(url) {
    const allJobs = [];

    try {
        // base payload (your given)
        const basePayload = {
            lang: "en_us",
            deviceType: "desktop",
            country: "us",
            pageName: "search-results",
            ddoKey: "eagerLoadRefineSearch",
            sortBy: "Most recent",
            subsearch: "",
            jobs: true,
            counts: true,
            all_fields: [
                "category",
                "country",
                "state",
                "city",
                "postalCode",
                "jobType",
                "phLocSlider"
            ],
            size: 10,
            clearAll: false,
            jdsource: "facets",
            isSliderEnable: true,
            pageId: "page11",
            siteType: "external",
            keywords: "",
            global: true,
            selected_fields: {
                country: ["India"],
                category: ["Software Engineering", "IT", "AI & Data"]
            },
            sort: {
                order: "desc",
                field: "postedDate"
            },
            locationData: {
                sliderRadius: 302,
                aboveMaxRadius: true,
                LocationUnit: "kilometers"
            },
            s: "1"
        };

        // pagination
        for (let page = 0; page < 5; page++) {
            const payload = {
                ...basePayload,
                from: page * 10
            };

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "user-agent": "Mozilla/5.0",
                    "origin": "https://careers.mastercard.com",
                    "referer": "https://careers.mastercard.com/"
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();

            const jobs =
                data?.eagerLoadRefineSearch?.data?.jobs || [];

            if (!jobs.length) break;

            const mapped = jobs.map(job => ({
                id: job.jobId || job.reqId,
                title: job.title || "N/A",
                location: job.location || `${job.city}, ${job.country}`,
                postedAt: job.postedDate
                    ? new Date(job.postedDate)
                    : null,
                url: job.applyUrl || "N/A"
            }));

            allJobs.push(...mapped);

            // stop if last page
            if (jobs.length < 10) break;
        }

        allJobs.sort((a, b) => {
            if (!a.postedAt) return 1;
            if (!b.postedAt) return -1;
            return b.postedAt - a.postedAt;
        });

        return allJobs;

    } catch (err) {
        console.error("Mastercard Fetch Error:", err.message);
        return [];
    }
}

module.exports = { fetchMastercardJobs };