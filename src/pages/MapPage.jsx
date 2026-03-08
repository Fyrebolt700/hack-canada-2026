import CommunityMap from "../components/CommunityMap";

export default function MapPage() {
  // Temporary test userData until onboarding quiz is integrated
  const userData = {
    name: "Test User",
    nationality: "India",
    province: "Ontario",
    purpose: "study",
    status: "temp_resident",
    language: "en",
    religion: "hinduism",
    children: true,
    childrenDetails: [
      { level: "elementary" },
      { level: "middle" },
    ],
    housing: true,
    personal: {
      daycare: true,
      nursing_homes: false,
      settlement: true,
      legal: true,
    },
  };

  return <CommunityMap userData={userData} />;
}