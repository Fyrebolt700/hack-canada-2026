export const generateTasks = (userData) => {
    if (!userData) return [];
    const tasks = [];

    // Always included
    tasks.push(
        { id: "sin", category: "Legal & ID", title: "Apply for SIN Number", description: "Visit a Service Canada office with your work/study permit.", done: false },
        { id: "bank", category: "Financial", title: "Open a Bank Account", description: "Bring your passport and proof of address.", done: false },
    );

    if (userData.needs?.includes("doctor")) {
        tasks.push(
            { id: "health_card", category: "Healthcare", title: "Apply for Provincial Health Card", description: `Apply for OHIP or equivalent in ${userData.province}.`, done: false },
            { id: "family_doctor", category: "Healthcare", title: "Register with a Family Doctor", description: "Use Health811 or your province's doctor finder.", done: false },
        );
    }

    if (userData.needs?.includes("housing")) {
        tasks.push(
            { id: "housing", category: "Housing", title: "Find Permanent Housing", description: "Contact local settlement agencies for housing support.", done: false }
        );
    }

    if (userData.purpose === "study") {
        tasks.push(
            { id: "uni_reg", category: "Education", title: "Register with Your Institution", description: "Complete enrollment and get your student ID.", done: false },
            { id: "student_health", category: "Healthcare", title: "Apply for Student Health Insurance", description: "Check if your school provides coverage.", done: false },
        );
    }

    if (userData.children?.length > 0) {
        tasks.push(
            { id: "school", category: "Education", title: "Enroll Children in School", description: "Contact your local school board for enrollment.", done: false }
        );
    }

    if (userData.needsDaycare) {
        tasks.push(
            { id: "daycare", category: "Education", title: "Find Daycare Centers", description: "Search Canada.ca or local agencies for subsidized daycare.", done: false }
        );
    }

    return tasks;
};