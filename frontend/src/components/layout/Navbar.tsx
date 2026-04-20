import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ROLE_LABELS: Record<string, string> = {
    ADMIN: 'Administrator',
    SALES_REP: 'Sprzedawca',
    MECHANIC: 'Mechanik',
    CLIENT: 'Klient',
};

export default function Navbar() {
    const { email, role, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) return null;

    return (
        <nav style={styles.nav}>
            <button onClick={() => navigate('/home')} style={styles.brand}>
                Salon &amp; Serwis
            </button>

            <div style={styles.right}>
                <span style={styles.userInfo}>
                    <span style={styles.roleTag}>
                        {role ? (ROLE_LABELS[role] ?? role) : ''}
                    </span>
                    <span style={styles.email}>{email}</span>
                </span>
                <button onClick={logout} style={styles.logoutBtn}>
                    Wyloguj
                </button>
            </div>
        </nav>
    );
}

const styles: Record<string, React.CSSProperties> = {
    nav: {
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        height: 56,
        background: '#1a1a2e',
        boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
    },
    brand: {
        background: 'none',
        border: 'none',
        color: '#fff',
        fontSize: 17,
        fontWeight: 700,
        fontFamily: "'Georgia', serif",
        cursor: 'pointer',
        letterSpacing: '0.04em',
        padding: 0,
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        gap: 20,
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
    },
    roleTag: {
        padding: '2px 10px',
        background: 'rgba(255,255,255,0.12)',
        borderRadius: 3,
        color: '#e2c97e',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        fontFamily: "'Arial', sans-serif",
    },
    email: {
        color: 'rgba(255,255,255,0.65)',
        fontSize: 13,
        fontFamily: "'Arial', sans-serif",
    },
    logoutBtn: {
        padding: '6px 18px',
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: 3,
        color: '#fff',
        fontSize: 13,
        cursor: 'pointer',
        fontFamily: "'Arial', sans-serif",
        transition: 'background 0.15s',
    },
};
