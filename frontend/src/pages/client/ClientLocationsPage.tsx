import { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Location, LocationType } from '@/types/location.types';
import {useLocations} from "@/hooks/useLocations.ts";
import "leaflet/dist/leaflet.css"


const createIcon = (type: LocationType) => {
    const isSalon = type === 'SALON';
    const color = isSalon ? "#1a6bff" : "#ff5c1a";
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48">
      <defs>
        <filter id="shadow" x="-30%" y="-10%" width="160%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 30 18 30S36 31.5 36 18C36 8.06 27.94 0 18 0z"
            fill="${color}" filter="url(#shadow)"/>
      <circle cx="18" cy="18" r="9" fill="white" opacity="0.95"/>
      <text x="18" y="22" font-size="11" font-family="sans-serif" font-weight="700"
            fill="${color}" text-anchor="middle">${isSalon ? "S" : "R"}</text>
    </svg>`;

    return L.divIcon({
        html: svg,
        className: "",
        iconSize: [36, 48],
        iconAnchor: [18, 48],
        popupAnchor: [0, -48],
    });
};

const SALON_ICON = createIcon('SALON');
const SERWIS_ICON = createIcon('SERVICE');

function FitBounds({ locations }: { locations: Location[] }) {
    const map = useMap();
    useEffect(() => {
        if (locations.length === 0) return;
        const bounds = L.latLngBounds(locations.map((l) => [l.latitude, l.longitude]));
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }, [locations, map]);
    return null;
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --salon: #1a6bff;
    --salon-light: #e8f0ff;
    --salon-mid: #5592ff;
    --serwis: #ff5c1a;
    --serwis-light: #fff0ea;
    --serwis-mid: #ff8a5c;
    --bg: #f5f5f3;
    --surface: #ffffff;
    --border: #e2e2de;
    --text: #1a1a18;
    --muted: #6b6b66;
    --radius: 14px;
    --shadow-sm: 0 2px 8px rgba(0,0,0,.07);
    --shadow-md: 0 4px 24px rgba(0,0,0,.10);
    --transition: .18s cubic-bezier(.4,0,.2,1);
  }

  html, body, #root { height: 100%; font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); }

  .map-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }

  .map-header {
    flex-shrink: 0;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 14px 20px 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: var(--shadow-sm);
    z-index: 999;
  }

  .map-header__top {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .search-wrap {
    position: relative;
    flex: 1;
  }

  .search-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    pointer-events: none;
    display: flex;
  }

  .search-input {
    width: 100%;
    padding: 10px 14px 10px 40px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    background: var(--bg);
    color: var(--text);
    transition: border-color var(--transition), box-shadow var(--transition);
    outline: none;
  }

  .search-input::placeholder { color: var(--muted); }

  .search-input:focus {
    border-color: var(--salon);
    box-shadow: 0 0 0 3px rgba(26,107,255,.12);
    background: var(--surface);
  }

  .search-clear {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: var(--border);
    border: none;
    border-radius: 50%;
    width: 20px; height: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted);
    font-size: 12px;
    transition: background var(--transition), color var(--transition);
  }
  .search-clear:hover { background: var(--muted); color: white; }

  .filter-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .filter-label {
    font-size: 0.78rem;
    color: var(--muted);
    font-weight: 500;
    margin-right: 2px;
    flex-shrink: 0;
  }

  .filter-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: 9px;
    border: 1.5px solid var(--border);
    background: var(--surface);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition);
    color: var(--muted);
    user-select: none;
  }

  .filter-btn__dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    transition: transform var(--transition);
  }

  .filter-btn:hover { border-color: var(--muted); color: var(--text); }
  .filter-btn:hover .filter-btn__dot { transform: scale(1.3); }

  .filter-btn--salon.active {
    background: var(--salon-light);
    border-color: var(--salon);
    color: var(--salon);
  }

  .filter-btn--serwis.active {
    background: var(--serwis-light);
    border-color: var(--serwis);
    color: var(--serwis);
  }

  .filter-count {
    background: currentColor;
    color: white;
    border-radius: 20px;
    padding: 1px 6px;
    font-size: 0.72rem;
    font-weight: 600;
    opacity: 0.85;
    min-width: 20px;
    text-align: center;
  }
  .filter-btn--salon.active .filter-count { color: var(--salon-light); }
  .filter-btn--serwis.active .filter-count { color: var(--serwis-light); }

  .filter-btn--all {
    margin-left: auto;
    font-size: 0.78rem;
    padding: 6px 10px;
    color: var(--muted);
  }
  .filter-btn--all:hover { color: var(--text); }

  .map-body {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  .map-container {
    flex: 1;
    height: 100%;
  }

  .leaflet-container { height: 100%; width: 100%; }

  .results-panel {
    width: 320px;
    flex-shrink: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .results-header {
    padding: 14px 16px 10px;
    border-bottom: 1px solid var(--border);
    font-family: 'Syne', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .result-card {
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background var(--transition);
    position: relative;
  }

  .result-card:hover { background: var(--bg); }
  .result-card.active { background: var(--salon-light); }
  .result-card.active.serwis { background: var(--serwis-light); }

  .result-card__type {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 3px;
  }

  .result-card__type--salon { color: var(--salon); }
  .result-card__type--serwis { color: var(--serwis); }

  .result-card__name {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.92rem;
    margin-bottom: 4px;
    line-height: 1.3;
  }

  .result-card__addr {
    font-size: 0.8rem;
    color: var(--muted);
    line-height: 1.4;
  }

  .result-card__phone {
    margin-top: 6px;
    font-size: 0.8rem;
    color: var(--salon);
    font-weight: 500;
  }

  .result-card.serwis .result-card__phone { color: var(--serwis); }

  .result-card__stripe {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    border-radius: 0 2px 2px 0;
  }

  .result-card__stripe--salon { background: var(--salon); }
  .result-card__stripe--serwis { background: var(--serwis); }

  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--muted);
    font-size: 0.88rem;
    padding: 32px 16px;
    text-align: center;
  }

  .empty-state svg { opacity: .35; }

  .leaflet-popup-content-wrapper {
    border-radius: var(--radius) !important;
    box-shadow: var(--shadow-md) !important;
    border: 1px solid var(--border);
    padding: 0 !important;
    overflow: hidden;
  }
  
  .popup-coords {
    margin-top: 6px;
    font-size: 0.75rem;
    color: var(--muted);
    font-family: monospace;
    letter-spacing: 0.02em;
}

  .leaflet-popup-content { margin: 0 !important; width: auto !important; }
  .leaflet-popup-tip-container { display: none; }

  .popup-inner {
    padding: 14px 16px;
    min-width: 200px;
  }

  .popup-type {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .popup-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    margin-bottom: 6px;
  }

  .popup-addr { font-size: 0.82rem; color: var(--muted); line-height: 1.5; }
  .popup-phone { margin-top: 8px; font-size: 0.82rem; font-weight: 500; }

  .map-status {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(245,245,243,.85);
    z-index: 1200;
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    color: var(--muted);
    gap: 10px;
  }

  .spinner {
    width: 22px; height: 22px;
    border: 2.5px solid var(--border);
    border-top-color: var(--salon);
    border-radius: 50%;
    animation: spin .7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 640px) {
    .results-panel { display: none; }
  }
`;

export default function ClientLocationsPage() {
    const { data, isLoading, isError } = useLocations();
    const allLocations: Location[] = data?.filter((l: Location) => l.active) ?? [];
    const [query, setQuery] = useState("");
    const [showSalon, setShowSalon] = useState(true);
    const [showSerwis, setShowSerwis] = useState(true);
    const [activeId, setActiveId] = useState<number | null>(null);
    const markerRefs = useRef<Record<number, L.Marker>>({});
    const stylesInjected = useRef(false);

    useEffect(() => {
        if (stylesInjected.current) return;
        stylesInjected.current = true;
        const el = document.createElement("style");
        el.textContent = STYLES;
        document.head.appendChild(el);
    }, []);

    const filtered = allLocations.filter((loc) => {
        if (!showSalon && loc.locationType === 'SALON') return false;
        if (!showSerwis && loc.locationType === 'SERVICE') return false;
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
            loc.name.toLowerCase().includes(q) ||
            loc.city.toLowerCase().includes(q) ||
            loc.street.toLowerCase().includes(q) ||
            loc.zipCode.includes(q)
        );
    });

    const salonCount = filtered.filter((l) => l.locationType === 'SALON').length;
    const serwisCount = filtered.filter((l) => l.locationType === 'SERVICE').length;

    const handleCardClick = useCallback((loc: Location) => {
        setActiveId(loc.id);
        const marker = markerRefs.current[loc.id];
        if (marker) marker.openPopup();
    }, []);

    return (
        <div className="map-page">
            <header className="map-header">
                <div className="map-header__top">

                    <div className="search-wrap">
            <span className="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
            </span>
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Szukaj po nazwie, mieście, adresie…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {query && (
                            <button className="search-clear" onClick={() => setQuery("")} aria-label="Wyczyść">
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                <div className="filter-row">
                    <span className="filter-label">Pokaż:</span>

                    <button
                        className={`filter-btn filter-btn--salon ${showSalon ? "active" : ""}`}
                        onClick={() => setShowSalon((v) => !v)}
                    >
                        <span className="filter-btn__dot" style={{ background: "#1a6bff" }} />
                        Salon
                        <span className="filter-count">{salonCount}</span>
                    </button>

                    <button
                        className={`filter-btn filter-btn--serwis ${showSerwis ? "active" : ""}`}
                        onClick={() => setShowSerwis((v) => !v)}
                    >
                        <span className="filter-btn__dot" style={{ background: "#ff5c1a" }} />
                        Serwis
                        <span className="filter-count">{serwisCount}</span>
                    </button>

                    {(!showSalon || !showSerwis || query) && (
                        <button
                            className="filter-btn filter-btn--all"
                            onClick={() => { setShowSalon(true); setShowSerwis(true); setQuery(""); }}
                        >
                            Wyczyść filtry
                        </button>
                    )}
                </div>
            </header>

            <div className="map-body" style={{ position: "relative" }}>
                <aside className="results-panel">
                    <div className="results-header">
                        {filtered.length} {filtered.length === 1 ? "wynik" : "wyniki / wyników"}
                    </div>

                    {filtered.length === 0 ? (
                        <div className="empty-state">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                            </svg>
                            <strong>Brak wyników</strong>
                            <span>Zmień frazy lub odznacz filtry</span>
                        </div>
                    ) : (
                        filtered.map((loc) => {
                            const isSalon = loc.locationType === 'SALON';
                            return (
                                <div
                                    key={loc.id}
                                    className={`result-card ${activeId === loc.id ? "active" : ""} ${isSalon ? "" : "serwis"}`}
                                    onClick={() => handleCardClick(loc)}
                                >
                                    <div className={`result-card__stripe result-card__stripe--${isSalon ? "salon" : "serwis"}`} />
                                    <div className={`result-card__type result-card__type--${isSalon ? "salon" : "serwis"}`}>
                                        {isSalon ? "Salon" : "Serwis"}
                                    </div>
                                    <div className="result-card__name">{loc.name}</div>
                                    <div className="result-card__addr">
                                        {loc.street}<br />{loc.zipCode} {loc.city}
                                    </div>
                                    <div className="result-card__phone">{loc.phone}</div>
                                </div>
                            );
                        })
                    )}
                </aside>

                <div className="map-container">
                    {isLoading && (
                        <div className="map-status">
                            <div className="spinner" />
                            Ładowanie lokalizacji…
                        </div>
                    )}
                    {isError && (
                        <div className="map-status" style={{ color: "#c0392b" }}>{isError}</div>
                    )}

                    {!isLoading && !isError && (
                        <MapContainer
                            center={[52.0, 19.5]}
                            zoom={4}
                            style={{ height: "100%", width: "100%" }}
                            zoomControl={true}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <FitBounds locations={filtered} />

                            {filtered.map((loc) => (
                                <Marker
                                    key={loc.id}
                                    position={[loc.latitude, loc.longitude]}
                                    icon={loc.locationType === 'SALON' ? SALON_ICON : SERWIS_ICON}
                                    ref={(ref) => {
                                        if (ref) markerRefs.current[loc.id] = ref;
                                    }}
                                    eventHandlers={{
                                        click: () => setActiveId(loc.id),
                                    }}
                                >
                                    <Popup>
                                        <div className="popup-inner">
                                            <div
                                                className="popup-type"
                                                style={{
                                                    color: loc.locationType === 'SALON'
                                                        ? "var(--salon)"
                                                        : "var(--serwis)",
                                                }}
                                            >
                                                {loc.locationType === 'SALON' ? "Salon" : "Serwis"}
                                            </div>
                                            <div className="popup-name">{loc.name}</div>
                                            <div className="popup-addr">
                                                {loc.street}<br />{loc.zipCode} {loc.city}
                                            </div>
                                            <div className="popup-coords">
                                                {loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}
                                            </div>
                                            <div
                                                className="popup-phone"
                                                style={{
                                                    color: loc.locationType === 'SALON'
                                                        ? "var(--salon)"
                                                        : "var(--serwis)",
                                                }}
                                            >
                                                {loc.phone}
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    )}
                </div>
            </div>
        </div>
    );
}