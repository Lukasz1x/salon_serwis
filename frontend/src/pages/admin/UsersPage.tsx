import { useState } from 'react';
import { useUsers, useChangeRole, useDeleteUser, useChangeLocation } from '@/hooks/useUsers';
import { useLocations } from '@/hooks/useLocations';
import { User } from '@/types/user.types';
import { Location } from '@/types/location.types';

const ROLES = ['CLIENT', 'ADMIN', 'SALES_REP', 'MECHANIC'] as const;
const ROLE_LABELS: Record<string, string> = {
    CLIENT: 'Klient',
    ADMIN: 'Administrator',
    SALES_REP: 'Sprzedawca',
    MECHANIC: 'Mechanik',
};
const ROLE_COLORS: Record<string, string> = {
    CLIENT: '#2563eb',
    ADMIN: '#dc2626',
    SALES_REP: '#16a34a',
    MECHANIC: '#d97706',
};

const TYPE_LABELS: Record<string, string> = {
    SALON: 'Salon',
    SERVICE: 'Serwis',
    HYBRID: 'Salon+Serwis',
};

export default function UsersPage() {
    const { data: users, isLoading, isError } = useUsers();
    const { data: locations } = useLocations();
    const changeRole = useChangeRole();
    const deleteUser = useDeleteUser();
    const changeLocation = useChangeLocation();

    const [editingRole, setEditingRole] = useState<number | null>(null);
    const [editingLocation, setEditingLocation] = useState<number | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const handleRoleChange = (userId: number, roleName: string) => {
        changeRole.mutate({ userId, roleName });
        setEditingRole(null);
    };

    const handleLocationChange = (userId: number, value: string) => {
        const locationId = value === '' ? undefined : Number(value);
        changeLocation.mutate({ userId, locationId });
        setEditingLocation(null);
    };

    const handleDelete = (userId: number) => {
        deleteUser.mutate(userId);
        setConfirmDelete(null);
    };

    const getLocationName = (user: User): string => {
        if (!user.location) return '— brak —';
        const loc = user.location as unknown as Location;
        return loc.name ? `${loc.name} (${TYPE_LABELS[loc.locationType] ?? loc.locationType})` : `Lok. #${loc.id}`;
    };

    if (isLoading) return <div style={styles.state}>Ładowanie użytkowników…</div>;
    if (isError) return <div style={{ ...styles.state, color: '#dc2626' }}>Błąd ładowania danych.</div>;

    const sortedUsers = [...(users ?? [])].sort((a, b) => {
        if (a.active === b.active) return a.id - b.id;
        return a.active ? -1 : 1;
    });

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Użytkownicy</h1>
                    <p style={styles.subtitle}>{users?.length ?? 0} rekordów w systemie</p>
                </div>
            </div>

            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                    <tr>
                        {['ID', 'Imię i nazwisko', 'Email', 'Telefon', 'Rola', 'Lokalizacja', 'Status', 'Akcje'].map(h => (
                            <th key={h} style={styles.th}>{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {sortedUsers?.map((user: User) => (
                        <tr key={user.id} style={styles.tr}>

                            {/* ID */}
                            <td style={styles.td}>
                                <span style={styles.idBadge}>#{user.id}</span>
                            </td>

                            {/* Imie i nazwisko */}
                            <td style={styles.td}>
                                <span style={styles.name}>{user.firstName} {user.lastName}</span>
                            </td>

                            {/* Email */}
                            <td style={styles.td}>
                                <span style={styles.email}>{user.email}</span>
                            </td>

                            {/* Telefon */}
                            <td style={styles.td}>{user.phone}</td>

                            {/* Rola */}
                            <td style={styles.td}>
                                {editingRole === user.id ? (
                                    <div style={styles.inlineEdit}>
                                        <select
                                            defaultValue={user.role}
                                            onChange={e => handleRoleChange(user.id, e.target.value)}
                                            style={styles.select}
                                            autoFocus
                                        >
                                            {ROLES.map(r => (
                                                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                                            ))}
                                        </select>
                                        <button onClick={() => setEditingRole(null)} style={styles.btnCancel}>✕</button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setEditingRole(user.id)}
                                        style={{
                                            ...styles.roleBadge,
                                            background: ROLE_COLORS[user.role] + '18',
                                            color: ROLE_COLORS[user.role],
                                            borderColor: ROLE_COLORS[user.role] + '40',
                                        }}
                                        title="Kliknij, aby zmienić rolę"
                                    >
                                        {ROLE_LABELS[user.role] ?? user.role}
                                    </button>
                                )}
                            </td>

                            {/* Lokalizacja — dropdown z listą lokalizacji z backendu */}
                            <td style={styles.td}>
                                {editingLocation === user.id ? (
                                    <div style={styles.inlineEdit}>
                                        <select
                                            defaultValue={(user.location as unknown as Location | undefined)?.id?.toString() ?? ''}
                                            onChange={e => handleLocationChange(user.id, e.target.value)}
                                            style={{ ...styles.select, minWidth: 200 }}
                                            autoFocus
                                        >
                                            <option value="">— brak lokalizacji —</option>
                                            {locations?.map((loc: Location) => (
                                                <option key={loc.id} value={loc.id}>
                                                    {loc.name} — {loc.city} ({TYPE_LABELS[loc.locationType] ?? loc.locationType})
                                                </option>
                                            ))}
                                        </select>
                                        <button onClick={() => setEditingLocation(null)} style={styles.btnCancel}>✕</button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setEditingLocation(user.id)}
                                        style={styles.locationBtn}
                                        title="Kliknij, aby zmienić lokalizację"
                                    >
                                        {getLocationName(user)}
                                    </button>
                                )}
                            </td>

                            {/* Status */}
                            <td style={styles.td}>
                                    <span style={user.active ? styles.active : styles.inactive}>
                                        {user.active ? 'Aktywny' : 'Nieaktywny'}
                                    </span>
                            </td>

                            {/* Akcje */}
                            <td style={styles.td}>
                                {confirmDelete === user.id ? (
                                    <div style={styles.inlineEdit}>
                                        <span style={styles.confirmText}>Na pewno?</span>
                                        <button onClick={() => handleDelete(user.id)} style={styles.btnDanger}>Tak</button>
                                        <button onClick={() => setConfirmDelete(null)} style={styles.btnCancel}>Nie</button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setConfirmDelete(user.id)}
                                        style={{
                                            ...styles.btnDelete,
                                            ...(user.active ? {} : {
                                                opacity: 0.35,
                                                cursor: 'not-allowed',
                                                borderColor: '#ccc',
                                                color: '#ccc',
                                            }),
                                        }}
                                        disabled={!user.active}
                                        title={user.active ? 'Dezaktywuj użytkownika' : 'Już nieaktywny'}
                                    >
                                        Usuń
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div style={styles.legend}>
                <span style={styles.legendText}>
                    💡 Kliknij na rolę lub lokalizację, aby edytować. Usunięcie dezaktywuje konto (soft delete).
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
    th: {
        padding: '12px 16px', background: '#1a1a2e', color: '#fff', fontWeight: 600,
        textAlign: 'left', fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap',
    },
    tr: { borderBottom: '1px solid #f0f0f0' },
    td: { padding: '12px 16px', color: '#333', verticalAlign: 'middle' },
    idBadge: { fontFamily: 'monospace', fontSize: 13, color: '#888' },
    name: { fontWeight: 600, color: '#1a1a2e' },
    email: { color: '#555', fontSize: 13 },
    roleBadge: {
        display: 'inline-block', padding: '3px 10px', borderRadius: 3, fontSize: 12,
        fontWeight: 600, border: '1px solid', cursor: 'pointer', background: 'transparent',
    },
    locationBtn: {
        background: 'none', border: '1px dashed #ccc', borderRadius: 3,
        padding: '3px 8px', fontSize: 12, color: '#666', cursor: 'pointer', whiteSpace: 'nowrap',
    },
    active: { display: 'inline-block', padding: '2px 8px', background: '#f0fdf4', color: '#16a34a', borderRadius: 3, fontSize: 12, fontWeight: 600 },
    inactive: { display: 'inline-block', padding: '2px 8px', background: '#fef2f2', color: '#dc2626', borderRadius: 3, fontSize: 12, fontWeight: 600 },
    inlineEdit: { display: 'flex', alignItems: 'center', gap: 4 },
    select: { fontSize: 12, padding: '3px 6px', border: '1px solid #ccc', borderRadius: 3 },
    btnCancel: { padding: '3px 8px', background: '#e5e7eb', color: '#333', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 13 },
    btnDelete: { padding: '4px 12px', background: '#fff', color: '#dc2626', border: '1px solid #dc2626', borderRadius: 3, cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'opacity 0.2s' },
    btnDanger: { padding: '3px 10px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 12, fontWeight: 600 },
    confirmText: { fontSize: 12, color: '#dc2626', fontWeight: 600 },
    legend: { marginTop: 16, padding: '10px 16px', background: '#fff', borderRadius: 4, border: '1px solid #e8e8e8' },
    legendText: { fontSize: 12, color: '#888' },
};
