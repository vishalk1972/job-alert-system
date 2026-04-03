async function fetchUberJobs(url) {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-csrf-token" : "x"
            },
            body: JSON.stringify({
                limit: 50,
                page: 0,
                params: {
                    department: ["Engineering", "Data Science"],
                    lineOfBusinessName: [],
                    location: [
                        {
                            country: "IND",
                            region: "Karnātaka",
                            city: "Bangalore"
                        },
                        {
                            country: "IND",
                            region: "Telangāna",
                            city: "Hyderabad"
                        },
                        {
                            country: "IND",
                            region: "Haryāna",
                            city: "Gurgaon"
                        }
                    ],
                    programAndPlatform: [],
                    team: []
                }
            })
        });

        if (!res.ok) {
            throw new Error(`HTTP error: ${res.status}`);
        }

        const data = await res.json();

        if (!data?.data?.results || !Array.isArray(data.data.results)) {
            throw new Error("Invalid Uber API response");
        }

        const jobs = data.data.results.map(job => {
            const location = job.location
                ? `${job.location.city}, ${job.location.region}, ${job.location.countryName}`
                : "N/A";

            return {
                id: String(job.id),
                title: job.title,
                location,
                postedAt: job.updatedDate,
                url: `https://www.uber.com/global/en/careers/list/${job.id}/`
            };
        });

        console.log(jobs,"ganddduuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu")

        return jobs;

    } catch (err) {
        console.error("Uber fetch error:", err.message);
        return [];
    }
}

module.exports = { fetchUberJobs };