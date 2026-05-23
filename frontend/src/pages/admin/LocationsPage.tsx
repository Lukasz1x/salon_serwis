import { useState } from 'react';
import { useLocations, useDeleteLocation, useAddLocation } from '@/hooks/useLocations';
import { Location, LocationRequest } from '@/types/location.types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });
import { MapModal } from '@/components/map/MapModal';
import { AddLocationModal } from '@/components/map/AddLocationModal';


const TYPE_LABELS: Record<string, string> = {
    SALON: 'Salon',
    SERVICE: 'Serwis',
    HYBRID: 'Salon+Serwis',
};

const TYPE_COLORS: Record<string, string> = {
    SALON: '#1a6bff',
    SERVICE: '#ff5c1a',
    HYBRID: '#7c3aed',
};


export default function LocationsPage() {
    const { data: locations, isLoading, isError } = useLocations();
    const deleteLocation = useDeleteLocation();
    const addLocation = useAddLocation();

    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const [mapLocation, setMapLocation] = useState<Location | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const handleDelete = (locationId: number) => {
        deleteLocation.mutate(locationId);
        setConfirmDelete(null);
    };


    const handleAddSave = (data: LocationRequest) => {
        addLocation.mutate(data, { onSuccess: () => setShowAddModal(false) });
    };

    if (isLoading) return <div style={styles.state}>Ładowanie lokalizacji…</div>;
    if (isError) return <div style={{ ...styles.state, color: '#dc2626' }}>Błąd ładowania danych.</div>;

    const sortedLocations = [...(locations ?? [])].sort((a, b) => {
        if (a.active === b.active) return a.id - b.id;
        return a.active ? -1 : 1;
    });

    return (
        <div style={styles.page}>

            {mapLocation && <MapModal location={mapLocation} onClose={() => setMapLocation(null)} />}
            {showAddModal && <AddLocationModal onClose={() => setShowAddModal(false)} onSave={handleAddSave} />}

            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Lokalizacje</h1>
                    <p style={styles.subtitle}>{locations?.length ?? 0} rekordów w systemie</p>
                </div>
            </div>

            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                    <tr>
                        {['ID', 'Nazwa', 'Telefon', 'Adres', 'Miasto', 'Kod pocztowy', 'Typ', 'Status', 'Akcje'].map(h => (
                            <th key={h} style={styles.th}>{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {sortedLocations.map((location: Location) => (
                        <tr key={location.id} style={styles.tr}>

                            <td style={styles.td}>
                                <span style={styles.idBadge}>#{location.id}</span>
                            </td>

                            <td style={styles.td}>
                                <span style={styles.name}>{location.name}</span>
                            </td>

                            <td style={styles.td}>
                                <span style={styles.phone}>{location.phone}</span>
                            </td>

                            <td style={styles.td}>{location.street}</td>

                            <td style={styles.td}>{location.city}</td>

                            <td style={styles.td}>
                                <span style={styles.zipCode}>{location.zipCode}</span>
                            </td>


                            <td style={styles.td}>
                                <span
                                    style={{
                                        ...styles.typeBadge,
                                        background: TYPE_COLORS[location.locationType] + '18',
                                        color: TYPE_COLORS[location.locationType],
                                        borderColor: TYPE_COLORS[location.locationType] + '40',
                                    }}
                                >
                                    {TYPE_LABELS[location.locationType] ?? location.locationType}
                                </span>
                            </td>


                            <td style={styles.td}>
                                <span style={location.active ? styles.active : styles.inactive}>
                                    {location.active ? 'Aktywna' : 'Nieaktywna'}
                                </span>
                            </td>

                            <td style={styles.td}>
                                <div style={styles.inlineEdit}>
                                    <button
                                        onClick={() => setMapLocation(location)}
                                        style={styles.btnMap}
                                        title="Pokaż na mapie"
                                    >
                                        Mapa
                                    </button>
                                    {confirmDelete === location.id ? (
                                        <div style={styles.inlineEdit}>
                                            <span style={styles.confirmText}>Na pewno?</span>
                                            <button onClick={() => handleDelete(location.id)} style={styles.btnDanger}>Tak</button>
                                            <button onClick={() => setConfirmDelete(null)} style={styles.btnCancel}>Nie</button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setConfirmDelete(location.id)}
                                            style={{
                                                ...styles.btnDelete,
                                                ...(location.active ? {} : {
                                                    opacity: 0.35,
                                                    cursor: 'not-allowed',
                                                    borderColor: '#ccc',
                                                    color: '#ccc',
                                                }),
                                            }}
                                            disabled={!location.active}
                                            title={location.active ? 'Dezaktywuj lokalizację' : 'Już nieaktywna'}
                                        >
                                            Usuń
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div style={styles.tableActions}>
                <button onClick={() => setShowAddModal(true)} style={styles.btnAdd}>
                    + Dodaj lokalizację
                </button>
            </div>

            <div style={styles.legend}>
                <span style={styles.legendText}>
                    💡 Kliknij na typ, aby edytować. Usunięcie dezaktywuje lokalizację (soft delete).&nbsp;&nbsp;
                    <span style={{ color: TYPE_COLORS.SALON, fontWeight: 600 }}>■ Salon</span>&nbsp;&nbsp;
                    <span style={{ color: TYPE_COLORS.SERVICE, fontWeight: 600 }}>■ Serwis</span>&nbsp;&nbsp;
                    <span style={{ color: TYPE_COLORS.HYBRID, fontWeight: 600 }}>■ Salon+Serwis</span>
                </span>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: { padding: '32px 40px', fontFamily: "'Arial', sans-serif", minHeight: '100vh', background: '#f4f5f7' },
    state: { padding: 40, textAlign: 'center', fontSize: 15, color: '#666', fontFamily: "'Arial', sans-serif" },
    header: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 },
    title: { fontSize: 26, fontWeight: 700, color: '#1a1a2e', margin: '0 0 4px', fontFamily: "'Georgia', serif" },
    subtitle: { fontSize: 13, color: '#888', margin: 0 },
    tableWrapper: { background: '#fff', borderRadius: 4, boxShadow: '0 1px 8px rgba(0,0,0,0.07)', overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
    th: { padding: '12px 16px', background: '#1a1a2e', color: '#fff', fontWeight: 600, textAlign: 'left', fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' },
    tr: { borderBottom: '1px solid #f0f0f0' },
    td: { padding: '12px 16px', color: '#333', verticalAlign: 'middle' },
    idBadge: { fontFamily: 'monospace', fontSize: 13, color: '#888' },
    name: { fontWeight: 600, color: '#1a1a2e' },
    phone: { color: '#555', fontSize: 13 },
    zipCode: { fontFamily: 'monospace', fontSize: 13, color: '#888' },
    typeBadge: { display: 'inline-block', padding: '3px 10px', borderRadius: 3, fontSize: 12, fontWeight: 600, border: '1px solid', cursor: 'pointer', background: 'transparent' },
    active: { display: 'inline-block', padding: '2px 8px', background: '#f0fdf4', color: '#16a34a', borderRadius: 3, fontSize: 12, fontWeight: 600 },
    inactive: { display: 'inline-block', padding: '2px 8px', background: '#fef2f2', color: '#dc2626', borderRadius: 3, fontSize: 12, fontWeight: 600 },
    inlineEdit: { display: 'flex', alignItems: 'center', gap: 4 },
    select: { fontSize: 12, padding: '3px 6px', border: '1px solid #ccc', borderRadius: 3 },
    btnCancel: { padding: '3px 8px', background: '#e5e7eb', color: '#333', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 13 },
    btnDelete: { padding: '4px 12px', background: '#fff', color: '#dc2626', border: '1px solid #dc2626', borderRadius: 3, cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'opacity 0.2s' },
    btnDanger: { padding: '3px 10px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 12, fontWeight: 600 },
    confirmText: { fontSize: 12, color: '#dc2626', fontWeight: 600 },
    btnMap: { padding: '4px 10px', background: '#fff', color: '#1a1a2e', border: '1px solid #1a1a2e', borderRadius: 3, cursor: 'pointer', fontSize: 12, fontWeight: 600 },
    tableActions: { margin: '12px 0 0', display: 'flex', justifyContent: 'flex-start' },
    btnAdd: { padding: '8px 18px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 600, letterSpacing: '0.03em' },
    legend: { marginTop: 12, padding: '10px 16px', background: '#fff', borderRadius: 4, border: '1px solid #e8e8e8' },
    legendText: { fontSize: 12, color: '#888' },
};

