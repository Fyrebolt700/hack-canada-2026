export const generateTasks = (userData) => {
    if (!userData) return [];
    const tasks = [];

    // Always included
    tasks.push(
        { id: "sin", category: "Urgent", title: "Apply for SIN Number", description: "Visit a Service Canada office with your work/study permit. You need this for almost everything else.", done: false },
        { id: "sim", category: "Urgent", title: "Get a Local SIM Card", description: "Get a Canadian phone number so you can receive verification texts and calls.", done: false },
        { id: "accommodation", category: "Urgent", title: "Confirm Accommodation", description: "Make sure your temporary or permanent housing is confirmed for your first nights.", done: false },
    );

    // URGENT
    tasks.push(
        { id: "health_card", category: "Urgent", title: "Apply for Provincial Health Card", description: `Apply for OHIP or equivalent in ${userData.province}. Note there may be a waiting period.`, done: false },
    );

    // FIRST WEEK
    tasks.push(
        { id: "bank", category: "First Week", title: "Open a Bank Account", description: "Bring your passport and proof of address. Most major banks have newcomer accounts.", done: false },
        { id: "transit", category: "First Week", title: "Get a Transit Card", description: "Get a PRESTO card or local transit pass to get around the city.", done: false },
    );

    if (userData.purpose === "study") {
        tasks.push(
            { id: "uni_reg", category: "First Week", title: "Register with Your Institution", description: "Complete enrollment, get your student ID and set up your student email.", done: false },
            { id: "student_health", category: "First Week", title: "Apply for Student Health Insurance", description: "Check if your school provides extended health coverage.", done: false },
        );
    }

    if (userData.housing) {
        tasks.push(
            { id: "housing", category: "First Week", title: "Find Permanent Housing", description: "Contact local settlement agencies for housing support and listings.", done: false }
        );
    }

    if (userData.children && userData.childrenDetails?.length > 0) {
        tasks.push(
            { id: "school", category: "First Week", title: "Enroll Children in School", description: "Contact your local school board to begin the enrollment process.", done: false }
        );
    }

    // FIRST MONTH
    tasks.push(
        { id: "library", category: "First Month", title: "Get a Library Card", description: "Free access to books, internet, and community programs.", done: false },
        { id: "taxes", category: "First Month", title: "Learn About Canadian Taxes", description: "Understand your tax obligations as a newcomer. Keep all receipts.", done: false },
        { id: "family_doctor", category: "First Month", title: "Register with a Family Doctor", description: "Use Health811 or your province's doctor finder to get a family doctor.", done: false },
    );

    if (userData.personal?.daycare) {
        tasks.push(
            { id: "daycare", category: "First Month", title: "Find Daycare Centers", description: "Search Canada.ca or local agencies for subsidized $10/day daycare in your area.", done: false }
        );
    }

    if (userData.personal?.legal) {
        tasks.push(
            { id: "legal", category: "First Month", title: "Get Legal Aid", description: "Contact a local legal aid clinic or immigration lawyer for guidance on your status.", done: false }
        );
    }

    if (userData.purpose === "work" || userData.purpose === "study") {
        tasks.push(
            { id: "credentials", category: "First Month", title: "Get Foreign Credentials Recognized", description: "Contact the relevant regulatory body in your field to begin credential recognition.", done: false }
        );
    }

    // FIRST 6 MONTHS
    if (userData.personal?.settlement) {
        tasks.push(
            { id: "community", category: "First 6 Months", title: "Connect with a Settlement Agency", description: "Organizations like ACCES Employment or local newcomer centres offer free support.", done: false }
        );
    }

    tasks.push(
        { id: "language", category: "First 6 Months", title: "Register for Language Classes", description: "LINC classes are free for eligible newcomers and help with English or French.", done: false },
        { id: "credit", category: "First 6 Months", title: "Start Building Credit History", description: "Apply for a secured credit card to begin establishing your Canadian credit score.", done: false },
        { id: "drivers", category: "First 6 Months", title: "Transfer or Get a Driver's License", description: "Check if your home country license can be exchanged or if you need to take a test.", done: false },
    );

    if (userData.personal?.nursing_homes) {
        tasks.push(
            { id: "nursing", category: "First 6 Months", title: "Find Nursing Home Support", description: "Contact your local health authority for long-term care options.", done: false }
        );
    }

    if (userData.religion && userData.religion !== "atheist") {
        tasks.push(
            { id: "worship", category: "First 6 Months", title: "Find a Local Place of Worship", description: "Connect with your local religious community for support and belonging.", done: false }
        );
    }

    return tasks;
};