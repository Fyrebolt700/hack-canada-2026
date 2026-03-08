export function generateMapQueries(userData) {
  const queries = [];

  queries.push("library");
  queries.push("community centre");

  if (userData.religion) {
    const religion = userData.religion.toLowerCase();

    if (religion.includes("hindu")) queries.push("hindu temple");
    if (religion.includes("islam")) queries.push("mosque");
    if (religion.includes("sikh")) queries.push("gurdwara");
    if (religion.includes("christian")) queries.push("church");
    if (religion.includes("judaism")) queries.push("synagogue");
    if (religion.includes("buddhism")) queries.push("buddhist temple");
  }

  if (userData.nationality) {
    queries.push(`${userData.nationality} grocery store`);
    queries.push(`${userData.nationality} food`);
    queries.push(`${userData.nationality} community`);
  }

  if (userData.children && Array.isArray(userData.childrenDetails)) {
    userData.childrenDetails.forEach((child) => {
      if (child.level === "elementary") queries.push("elementary school");
      if (child.level === "middle") queries.push("middle school");
      if (child.level === "high") queries.push("high school");
    });
  }

  if (userData.personal?.daycare) {
    queries.push("daycare");
    queries.push("childcare centre");
  }

  if (userData.housing) {
    queries.push("housing assistance");
  }

  if (userData.personal?.settlement) {
    queries.push("settlement services");
    queries.push("newcomer centre");
  }

  if (userData.personal?.legal) {
    queries.push("legal aid");
    queries.push("immigration lawyer");
  }

  if (userData.purpose?.toLowerCase() === "study") {
    queries.push("college");
    queries.push("university");
    queries.push("student services");
  }

  if (
    userData.status?.toLowerCase() === "temp_resident" &&
    userData.purpose?.toLowerCase() === "study"
  ) {
    queries.push("international student office");
  }

  return [...new Set(queries)];
}