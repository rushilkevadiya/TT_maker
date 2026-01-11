// This data is parsed from your Java cs.addSession() calls
const rawData = [
    { class: "IT-2A", subject: "COA", type: "Lecture", faculty: ["ARK"] },
    { class: "IT-2A", subject: "DS", type: "Lecture", faculty: ["DS"] },
    { class: "IT-2A", subject: "MI", type: "Lecture", faculty: ["HV"] },
    { class: "IT-2A", subject: "PEM", type: "Lecture", faculty: ["MT"] },
    { class: "IT-2A", subject: "OOP", type: "Lecture", faculty: ["BP"] },
    { class: "IT-2A", subject: "MI", type: "Lecture", faculty: ["HV"] },
    { class: "IT-2A", subject: "DM", type: "Lecture", faculty: ["NK"] },
    { class: "IT-2A", subject: "DM", type: "Lecture", faculty: ["NK"] },
    { class: "IT-2A", subject: "COA", type: "Lecture", faculty: ["ARK"] },
    { class: "IT-2A", subject: "EITK", type: "Lecture", faculty: ["KP"] },
    { class: "IT-2A", subject: "MI", type: "Lecture", faculty: ["HV"] },
    { class: "IT-2A", subject: "COA", type: "Lecture", faculty: ["ARK"] },
    { class: "IT-2A", subject: "OOP", type: "Lecture", faculty: ["BP"] },
    { class: "IT-2A", subject: "DS", type: "Lecture", faculty: ["DS"] },
    { class: "IT-2A", subject: "DM", type: "Tutorial", faculty: ["DJ", "VJ", "HV", "AK"] },
    { class: "IT-2A", subject: "EITK", type: "Lecture", faculty: ["KP"] },
    { class: "IT-2A", subject: "DS", type: "Lecture", faculty: ["VJ"] },
    { class: "IT-2A", subject: "OOP", type: "Lecture", faculty: ["BP"] },
    { class: "IT-2A", subject: "PEM", type: "Lecture", faculty: ["MT"] },
    { class: "IT-2A", subject: "DM", type: "Lecture", faculty: ["NK"] },
    { class: "IT-2A", subject: "COA", type: "Lab", batch: "A", faculty: ["ARK", "AK"] },
    { class: "IT-2A", subject: "COA", type: "Lab", batch: "B", faculty: ["ARK", "HV"] },
    { class: "IT-2A", subject: "OOP", type: "Lab", batch: "A", faculty: ["BP", "SK"] },
    { class: "IT-2A", subject: "OOP", type: "Lab", batch: "B", faculty: ["BP", "MHP"] },
    { class: "IT-2A", subject: "MI", type: "Lab", batch: "A", faculty: ["HV", "TG"] },
    { class: "IT-2A", subject: "MI", type: "Lab", batch: "B", faculty: ["HV", "TG"] },
    { class: "IT-2A", subject: "DS", type: "Lab", batch: "A", faculty: ["AC", "PD"] },
    { class: "IT-2A", subject: "DS", type: "Lab", batch: "B", faculty: ["AC", "MMP"] },
    { class: "IT-2B", subject: "COA", type: "Lecture", faculty: ["AC"] },
    { class: "IT-2B", subject: "DS", type: "Lecture", faculty: ["DS"] },
    { class: "IT-2B", subject: "DM", type: "Lecture", faculty: ["SK"] },
    { class: "IT-2B", subject: "MI", type: "Lecture", faculty: ["MHP"] },
    { class: "IT-2B", subject: "OOP", type: "Lecture", faculty: ["PD"] },
    { class: "IT-2B", subject: "MI", type: "Lecture", faculty: ["MHP"] },
    { class: "IT-2B", subject: "COA", type: "Lecture", faculty: ["AC"] },
    { class: "IT-2B", subject: "DM", type: "Lecture", faculty: ["DR"] },
    { class: "IT-2B", subject: "MI", type: "Lecture", faculty: ["MHP"] },
    { class: "IT-2B", subject: "DS", type: "Lecture", faculty: ["DS"] },
    { class: "IT-2B", subject: "DM", type: "Lecture", faculty: ["SK"] },
    { class: "IT-2B", subject: "EITK", type: "Lecture", faculty: ["KP"] },
    { class: "IT-2B", subject: "PEM", type: "Lecture", faculty: ["MT"] },
    { class: "IT-2B", subject: "EITK", type: "Lecture", faculty: ["KP"] },
    { class: "IT-2B", subject: "DS", type: "Lecture", faculty: ["VJ"] },
    { class: "IT-2B", subject: "COA", type: "Lecture", faculty: ["AC"] },
    { class: "IT-2B", subject: "OOP", type: "Lecture", faculty: ["PD"] },
    { class: "IT-2B", subject: "OOP", type: "Lecture", faculty: ["PD"] },
    { class: "IT-2B", subject: "DM", type: "Tutorial", faculty: ["SK", "DS", "TG", "AM"] },
    { class: "IT-2B", subject: "PEM", type: "Lecture", faculty: ["MT"] },
    { class: "IT-2B", subject: "OOP", type: "Lab", batch: "A", faculty: ["PD", "ARK"] },
    { class: "IT-2B", subject: "OOP", type: "Lab", batch: "B", faculty: ["PD", "ARK"] },
    { class: "IT-2B", subject: "DS", type: "Lab", batch: "A", faculty: ["DS", "VP"] },
    { class: "IT-2B", subject: "DS", type: "Lab", batch: "B", faculty: ["DS", "NK"] },
    { class: "IT-2B", subject: "COA", type: "Lab", batch: "A", faculty: ["AC", "SK"] },
    { class: "IT-2B", subject: "COA", type: "Lab", batch: "B", faculty: ["AC", "TG"] },
    { class: "IT-2B", subject: "MI", type: "Lab", batch: "A", faculty: ["MHP", "VC"] },
    { class: "IT-2B", subject: "MI", type: "Lab", batch: "B", faculty: ["MHP", "HV"] },
    { class: "IT-3A", subject: "WT", type: "Lecture", faculty: ["TG"] },
    { class: "IT-3A", subject: "EO", type: "Lecture", faculty: ["MA"] },
    { class: "IT-3A", subject: "EO", type: "Lecture", faculty: ["MA"] },
    { class: "IT-3A", subject: "DMBI", type: "Lecture", faculty: ["VP"] },
    { class: "IT-3A", subject: "WT", type: "Lecture", faculty: ["TG"] },
    { class: "IT-3A", subject: "SE/CC", type: "Lecture", faculty: ["AK", "TG"] },
    { class: "IT-3A", subject: "SE/CC", type: "Lecture", faculty: ["AK", "SP"] },
    { class: "IT-3A", subject: "DMBI", type: "Lecture", faculty: ["VP"] },
    { class: "IT-3A", subject: "IOE-1", type: "Lecture", faculty: [] },
    { class: "IT-3A", subject: "IOE-1", type: "Lecture", faculty: [] },
    { class: "IT-3A", subject: "IOE-1", type: "Lecture", faculty: [] },
    { class: "IT-3A", subject: "EO", type: "Tutorial", faculty: ["MA", "RA"] },
    { class: "IT-3A", subject: "CNS", type: "Lecture", faculty: ["VJ"] },
    { class: "IT-3A", subject: "CNS", type: "Lecture", faculty: ["VJ"] },
    { class: "IT-3A", subject: "CNS", type: "Lecture", faculty: ["DS"] },
    { class: "IT-3A", subject: "SE/CC", type: "Lecture", faculty: ["AK", "SP"] },
    { class: "IT-3A", subject: "DMBI", type: "Lecture", faculty: ["MP"] },
    { class: "IT-3A", subject: "CNS", type: "Lecture", faculty: ["DS"] },
    { class: "IT-3A", subject: "CNS", type: "Lab", batch: "A", faculty: ["VJ", "MMP"] },
    { class: "IT-3A", subject: "CNS", type: "Lab", batch: "B", faculty: ["VJ", "NK"] },
    { class: "IT-3A", subject: "WT", type: "Lab", batch: "A", faculty: ["TG", "DR"] },
    { class: "IT-3A", subject: "WT", type: "Lab", batch: "B", faculty: ["TG", "HV"] },
    { class: "IT-3A", subject: "DMBI", type: "Lab", batch: "A", faculty: ["VP", "PD"] },
    { class: "IT-3A", subject: "DMBI", type: "Lab", batch: "B", faculty: ["VP", "MP"] },
    { class: "IT-3A", subject: "IOE", type: "Lab", batch: "AB", faculty: [] },
    { class: "IT-3A", subject: "IOE", type: "Lab", batch: "AB", faculty: [] },
    { class: "IT-3B", subject: "EO", type: "Lecture", faculty: ["RA"] },
    { class: "IT-3B", subject: "EO", type: "Lecture", faculty: ["RA"] },
    { class: "IT-3B", subject: "DMBI", type: "Lecture", faculty: ["MP"] },
    { class: "IT-3B", subject: "WT", type: "Lecture", faculty: ["DR"] },
    { class: "IT-3B", subject: "CNS", type: "Lecture", faculty: ["VJ"] },
    { class: "IT-3B", subject: "EO", type: "Tutorial", faculty: ["MA", "RA"] },
    { class: "IT-3B", subject: "CNS", type: "Lecture", faculty: ["DS"] },
    { class: "IT-3B", subject: "CNS", type: "Lecture", faculty: ["VJ"] },
    { class: "IT-3B", subject: "SE/CC", type: "Lecture", faculty: ["AM", "TG"] },
    { class: "IT-3B", subject: "SE/CC", type: "Lecture", faculty: ["AM", "TG"] },
    { class: "IT-3B", subject: "WT", type: "Lecture", faculty: ["BP"] },
    { class: "IT-3B", subject: "IOE-1", type: "Lecture", faculty: [] },
    { class: "IT-3B", subject: "IOE-1", type: "Lecture", faculty: [] },
    { class: "IT-3B", subject: "IOE-1", type: "Lecture", faculty: [] },
    { class: "IT-3B", subject: "DMBI", type: "Lecture", faculty: ["VP"] },
    { class: "IT-3B", subject: "DMBI", type: "Lecture", faculty: ["VP"] },
    { class: "IT-3B", subject: "SE/CC", type: "Lecture", faculty: ["AM", "SP"] },
    { class: "IT-3B", subject: "CNS", type: "Lab", batch: "A", faculty: ["VJ", "SP"] },
    { class: "IT-3B", subject: "CNS", type: "Lab", batch: "B", faculty: ["DS", "NK"] },
    { class: "IT-3B", subject: "DMBI", type: "Lab", batch: "A", faculty: ["VP", "NK"] },
    { class: "IT-3B", subject: "DMBI", type: "Lab", batch: "B", faculty: ["VP", "NK"] },
    { class: "IT-3B", subject: "WT", type: "Lab", batch: "A", faculty: ["DR", "DJ"] },
    { class: "IT-3B", subject: "WT", type: "Lab", batch: "B", faculty: ["DR", "DJ"] },
    { class: "IT-3B", subject: "IOE-1 LAB", type: "Lab", batch: "AB", faculty: [] },
    { class: "IT-3B", subject: "IOE-1 LAB", type: "Lab", batch: "AB", faculty: [] },
];

// Helper sets to find unique values
const classes = new Set();
const subjects = new Set();
const faculty = new Set();

rawData.forEach(item => {
    classes.add(item.class);
    subjects.add(item.subject);
    item.faculty.forEach(f => faculty.add(f));
});

// Create the department state object
export const initialDepartment = {
    classes: [...classes],
    labs: ["IT-1", "IT-2", "IT-3", "IT-4", "IT-5"],
    rooms: ["K-203", "K-202", "K-201", "J-201"],
    subjects: [...subjects],
    faculty: [...faculty]
};

// Create the sessions state object
export const initialSessions = rawData.reduce((acc, session, index) => {
    const { class: className, ...rest } = session;
    if (!acc[className]) {
        acc[className] = [];
    }
    acc[className].push({
        id: Date.now() + index, // unique ID for React keys and drag-drop
        ...rest,
        // Default batch to 'AB' for lectures/tutorials if not specified
        batch: session.batch || (session.type === 'Lab' ? '' : 'AB')
    });
    return acc;
}, {});