import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";
import { generateMapQueries } from "../utils/generateMapQueries";
import MapFilters from "./MapFilters";

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "16px",
};

const libraries = ["places"];

function getCategoryFromQuery(query) {
  const q = query.toLowerCase();

  if (
    q.includes("school") ||
    q.includes("college") ||
    q.includes("university") ||
    q.includes("student")
  ) {
    return "School";
  }

  if (
    q.includes("clinic") ||
    q.includes("hospital") ||
    q.includes("doctor") ||
    q.includes("walk-in")
  ) {
    return "Healthcare";
  }

  if (q.includes("housing")) {
    return "Housing";
  }

  if (
    q.includes("mosque") ||
    q.includes("temple") ||
    q.includes("church") ||
    q.includes("gurdwara") ||
    q.includes("synagogue")
  ) {
    return "Worship";
  }

  if (q.includes("grocery") || q.includes("food")) {
    return "Food";
  }

  if (
    q.includes("library") ||
    q.includes("community centre") ||
    q.includes("daycare") ||
    q.includes("childcare") ||
    q.includes("settlement") ||
    q.includes("newcomer") ||
    q.includes("legal") ||
    q.includes("immigration")
  ) {
    return "Personal Needs";
  }

  return "Other";
}

function getMarkerColor(categories) {
  if (categories.includes("School")) return "blue";
  if (categories.includes("Healthcare")) return "red";
  if (categories.includes("Housing")) return "green";
  if (categories.includes("Worship")) return "purple";
  if (categories.includes("Food")) return "orange";
  if (categories.includes("Personal Needs")) return "gray";
  return "gray";
}

function getMarkerIcon(color) {
  if (!window.google) return undefined;

  return {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: "white",
    strokeWeight: 2,
    scale: 8,
  };
}

function getProfileChips(userData) {
  const chips = [];

  if (userData.nationality) chips.push(`From ${userData.nationality}`);
  if (userData.religion) chips.push(userData.religion);
  if (userData.purpose) chips.push(`Purpose: ${userData.purpose}`);
  if (userData.personal?.daycare) chips.push("Needs daycare");
  if (userData.children) chips.push("Has children");

  return chips.slice(0, 4);
}

function getRecommendedText(userData) {
  const items = [];

  if (userData.nationality) items.push(`${userData.nationality} groceries`);
  if (userData.religion) items.push("places of worship");

  if (userData.children) items.push("schools");
  if (userData.personal?.daycare) items.push("daycare");
  if (userData.housing) items.push("housing support");
  if (userData.personal?.settlement) items.push("settlement services");
  if (userData.personal?.legal) items.push("legal support");

  if (userData.purpose?.toLowerCase() === "study") {
    items.push("student services");
  }

  return [...new Set(items)];
}

export default function CommunityMap({ userData }) {
  const [userLocation, setUserLocation] = useState(null);
  const [placesResults, setPlacesResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [error, setError] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [showAllPlaces, setShowAllPlaces] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const queries = useMemo(() => generateMapQueries(userData), [userData]);
  const profileChips = useMemo(() => getProfileChips(userData), [userData]);
  const recommendedText = useMemo(() => getRecommendedText(userData), [userData]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setError("Location access denied or unavailable.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    if (!isLoaded || !window.google || !userLocation || queries.length === 0) return;

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    const placeMap = new Map();
    let completed = 0;

    queries.forEach((query) => {
      const category = getCategoryFromQuery(query);

      service.nearbySearch(
        {
          location: userLocation,
          radius: 6000,
          keyword: query,
        },
        (results, status) => {
          completed += 1;

          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            results
          ) {
            results.forEach((place) => {
              if (!place.place_id) return;
              if (category === "Other") return;

              if (!placeMap.has(place.place_id)) {
                placeMap.set(place.place_id, {
                  ...place,
                  matchedCategories: [category],
                });
              } else {
                const existing = placeMap.get(place.place_id);
                existing.matchedCategories = [
                  ...new Set([...existing.matchedCategories, category]),
                ];
                placeMap.set(place.place_id, existing);
              }
            });
          }

          if (completed === queries.length) {
            setPlacesResults(Array.from(placeMap.values()));
          }
        }
      );
    });
  }, [isLoaded, userLocation, queries]);

  const filterOptions = [
    "Food",
    "Healthcare",
    "School",
    "Worship",
    "Housing",
    "Personal Needs",
  ];

  const filteredPlaces = useMemo(() => {
    if (activeFilters.length === 0) return placesResults;

    return placesResults.filter((place) =>
      activeFilters.some((filter) =>
        place.matchedCategories?.includes(filter)
      )
    );
  }, [placesResults, activeFilters]);

  const categoryCounts = useMemo(() => {
    const counts = {};

    placesResults.forEach((place) => {
      place.matchedCategories?.forEach((category) => {
        if (category !== "Other") {
          counts[category] = (counts[category] || 0) + 1;
        }
      });
    });

    return counts;
  }, [placesResults]);
  
  const displayedPlaces = showAllPlaces
  ? filteredPlaces
  : filteredPlaces.slice(0, 5);  
  
  if (!isLoaded) return <div>Loading Google Maps...</div>;
  if (error) return <div>{error}</div>;
  if (!userLocation) return <div>Getting your location...</div>;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
        color: "#111827",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "32px", fontWeight: "700" }}>
          Your Settlement Map
        </h1>

        <p style={{ margin: 0, color: "#4b5563", fontSize: "16px" }}>
          Personalized using your onboarding answers and current location.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "16px",
        }}
      >
        {profileChips.map((chip) => (
          <span
            key={chip}
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "999px",
              padding: "8px 14px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#111827",
            }}
          >
            {chip}
          </span>
        ))}
      </div>

      <div
        style={{
          marginBottom: "16px",
          color: "#374151",
          fontSize: "15px",
        }}
      >
        <strong>Recommended for you:</strong>{" "}
        {recommendedText.length > 0
          ? recommendedText.join(", ")
          : "general nearby support resources"}
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "16px",
          fontSize: "14px",
          color: "#374151",
        }}
      >
        <span>🟠 Food</span>
        <span>🔴 Healthcare</span>
        <span>🔵 School</span>
        <span>🟣 Worship</span>
        <span>🟢 Housing</span>
        <span>⚪ Personal Needs</span>
        <span>📍 You</span>
      </div>

      <MapFilters
        filters={filterOptions}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        counts={categoryCounts}
      />

      {activeFilters.length > 0 && (
        <button
          onClick={() => setActiveFilters([])}
          style={{
            marginBottom: "16px",
            padding: "8px 14px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            background: "#ffffff",
            color: "#111827",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Clear Filters
        </button>
      )}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation}
        zoom={12}
      >
        <Marker
          position={userLocation}
          title="You are here"
          icon={{
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                  <text x="24" y="30" text-anchor="middle" font-size="28">📍</text>
                </svg>
              `),
            scaledSize: new window.google.maps.Size(40, 40),
          }}
        />

        {filteredPlaces.map((place) => {
          const lat = place.geometry?.location?.lat();
          const lng = place.geometry?.location?.lng();

          if (typeof lat !== "number" || typeof lng !== "number") return null;

          return (
            <Marker
              key={place.place_id}
              position={{ lat, lng }}
              title={place.name}
              icon={getMarkerIcon(getMarkerColor(place.matchedCategories || []))}
              onClick={() => setSelectedPlace(place)}
            />
          );
        })}

        {selectedPlace && (
          <InfoWindow
            position={{
              lat: selectedPlace.geometry.location.lat(),
              lng: selectedPlace.geometry.location.lng(),
            }}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div>
              <h3 style={{ margin: "0 0 8px 0" }}>{selectedPlace.name}</h3>
              <p style={{ margin: 0 }}>{selectedPlace.vicinity}</p>

              {selectedPlace.rating && (
                <p style={{ margin: "8px 0 0 0" }}>⭐ {selectedPlace.rating}</p>
              )}

              {selectedPlace.matchedCategories && (
                <p style={{ margin: "8px 0 0 0" }}>
                  {selectedPlace.matchedCategories.join(", ")}
                </p>
              )}

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  selectedPlace.name
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "10px",
                  padding: "6px 10px",
                  background: "#111827",
                  color: "white",
                  borderRadius: "6px",
                  fontSize: "13px",
                  textDecoration: "none",
                }}
              >
                Open in Google Maps
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <div style={{ marginTop: "24px" }}>
        <h2>Top places for you</h2>

        {displayedPlaces.length === 0 ? (
          <p>No matching places found.</p>
        ) : (
          <ul style={{ paddingLeft: 0 }}>
            {displayedPlaces.map((place) => (
              <li
                key={place.place_id}
                style={{
                  marginBottom: "12px",
                  padding: "12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  background: "#fff",
                  listStyle: "none",
                }}
              >
                <strong>{place.name}</strong>

                {place.vicinity ? (
                  <div style={{ color: "#6b7280", marginTop: "4px" }}>
                    {place.vicinity}
                  </div>
                ) : null}

                {place.rating ? (
                  <div style={{ marginTop: "4px" }}>⭐ {place.rating}</div>
                ) : null}

                {place.matchedCategories && (
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      flexWrap: "wrap",
                      marginTop: "8px",
                    }}
                  >
                    {place.matchedCategories.map((category) => (
                      <span
                        key={category}
                        style={{
                          background: "#f3f4f6",
                          borderRadius: "999px",
                          padding: "4px 10px",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        {filteredPlaces.length > 5 && (
          <button
            onClick={() => setShowAllPlaces(!showAllPlaces)}
            style={{
              marginTop: "12px",
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#111827",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {showAllPlaces ? "Show Top 5" : "Show All"}
          </button>
        )}
      </div>
    </div>
  );
}