// utils/filter.js
function isEntryLevel(job) {
    const title = (job.title || "").toLowerCase();

    const blacklist = [
        "senior",
        "lead",
        "principal",
        "staff",
        "architect",
        "director",
        "manager",
        "associate",
        "sr",
        "president",
        "test",
        "qa",
        "quality",
        "3",
        "4",
        "5",
        "6",
        "iii",
        "iv",
        "v",
    ];

    return !blacklist.some(word => title.includes(word));
}

module.exports = { isEntryLevel };