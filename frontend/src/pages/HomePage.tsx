import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth.types';

interface NavCard {
    label: string;
    description: string;
    path: string;
    icon: string;
}

const ROLE_CARDS: Record<UserRole, NavCard[]> = {
    ADMIN: [
        {
            label: 'Zarządzaj użytkownikami',
            description: 'Przeglądaj, edytuj role i lokalizacje kont',
            path: '/admin/users',
            icon: '👥',
        },
        {
            label: 'Zarządzaj lokalizacjami',
            description: 'Dodawaj i przeglądaj salony oraz serwisy',
            path: '/admin/locations',
            icon: '📍',
        },
        {
            label: 'Wygeneruj raporty',
            description: 'Wygeneruj raporty o działalności salonu oraz serwisu',
            path: '/admin/reports',
            icon: '📊',
        },
    ],
    SALES_REP: [
        {
            label: 'Zarządzaj samochodami',
            description: 'Przeglądaj stan magazynu i edytuj ofertę',
            path: '/sales/vehicles',
            icon: '🚗',
        },
        {
            label: 'Zarządzaj spotkaniami w salonie',
            description: 'Harmonogram wizyt i statusy spotkań',
            path: '/sales/appointments',
            icon: '📅',
        },
        {
            label: 'Zarządzaj zamówieniami salonu',
            description: 'Historia transakcji i generowanie faktur',
            path: '/sales/orders',
            icon: '🧾',
        },
    ],
    MECHANIC: [
        {
            label: 'Zarządzaj naprawami',
            description: 'Zlecenia serwisowe i historia napraw',
            path: '/service/appointments',
            icon: '🔧',
        },
    ],
    CLIENT: [
        {
            label: 'Umów się do salonu',
            description: 'Zarezerwuj wizytę u doradcy handlowego',
            path: '/client/salon',
            icon: '🤝',
        },
        {
            label: 'Umów się do serwisu',
            description: 'Zaplanuj przegląd lub naprawę pojazdu',
            path: '/client/service',
            icon: '🛠️',
        },
        {
            label: 'Sprawdź ofertę salonu',
            description: 'Przeglądaj dostępne modele i cenniki',
            path: '/client/offer',
            icon: '🚘',
        },
        {
            label: 'Znajdź salon lub serwis',
            description: 'Lokalizacje i godziny otwarcia placówek',
            path: '/client/locations',
            icon: '🗺️',
        },
    ],
};

export default function HomePage() {
    const { role } = useAuth();
    const navigate = useNavigate();

    const cards = role ? (ROLE_CARDS[role] ?? []) : [];

    return (
        <div style={styles.page}>
            <div style={styles.hero}>
                <h1 style={styles.heading}>
                    Witaj w salonie i serwisie
                </h1>
            </div>

            {cards.length > 0 && (
                <div style={styles.grid}>
                    {cards.map((card) => (
                        <button
                            key={card.path}
                            onClick={() => navigate(card.path)}
                            style={styles.card}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)';
                                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                                (e.currentTarget as HTMLButtonElement).style.borderColor = '#1a1a2e';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                                (e.currentTarget as HTMLButtonElement).style.borderColor = '#e8e8e8';
                            }}
                        >
                            <span style={styles.cardIcon}>{card.icon}</span>
                            <span style={styles.cardLabel}>{card.label}</span>
                            <span style={styles.cardDesc}>{card.description}</span>
                            <span style={styles.cardArrow}>→</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: 'calc(100vh - 56px)',
        background: '#f4f5f7',
        padding: '48px 40px 64px',
        fontFamily: "'Arial', sans-serif",
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
    },
    hero: {
        marginBottom: 40,
        textAlign: 'center' as const,
    },
    roleLabel: {
        display: 'inline-block',
        padding: '3px 12px',
        background: '#1a1a2e',
        color: '#e2c97e',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        borderRadius: 2,
        marginBottom: 20,
    },
    heading: {
        fontSize: 40,
        fontWeight: 700,
        color: '#1a1a2e',
        lineHeight: 1.2,
        margin: '0 0 12px',
        fontFamily: "'Georgia', serif",
    },
    emailLine: {
        fontSize: 15,
        color: '#888',
        margin: 0,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 20,
        maxWidth: 900,
        width: '100%',
        margin: '0 auto',
    },
    card: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'flex-start',
        textAlign: 'left' as const,
        padding: '28px 28px 24px',
        background: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: 4,
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
        position: 'relative' as const,
    },
    cardIcon: {
        fontSize: 28,
        marginBottom: 16,
        lineHeight: 1,
    },
    cardLabel: {
        fontSize: 16,
        fontWeight: 700,
        color: '#1a1a2e',
        marginBottom: 8,
        lineHeight: 1.3,
        fontFamily: "'Georgia', serif",
    },
    cardDesc: {
        fontSize: 13,
        color: '#888',
        lineHeight: 1.55,
        flex: 1,
    },
    cardArrow: {
        marginTop: 20,
        fontSize: 18,
        color: '#1a1a2e',
        fontWeight: 700,
    },
};