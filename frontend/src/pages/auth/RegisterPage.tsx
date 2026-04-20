import { useForm, SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useRegister } from '@/hooks/useAuthMutations';
import { RegisterRequest } from '@/types/auth.types';

type RegisterFormData = RegisterRequest & { confirmPassword: string };

export default function RegisterPage() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>();

    const { mutate: registerUser, isPending, isError } = useRegister();

    const onSubmit: SubmitHandler<RegisterFormData> = ({ confirmPassword: _ignored, ...data }) => {
        registerUser(data);
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

                .auth-input {
                    width: 100%;
                    padding: 13px 16px;
                    font-size: 15px;
                    font-family: 'DM Sans', sans-serif;
                    font-weight: 400;
                    border: 1.5px solid #ddd;
                    border-radius: 6px;
                    background: #fafafa;
                    color: #1a1a2e;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                    box-sizing: border-box;
                }
                .auth-input:focus {
                    border-color: #1a1a2e;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(26,26,46,0.07);
                }
                .auth-input::placeholder { color: #bbb; }
                .auth-input.error { border-color: #e03e3e; background: #fff8f8; }

                .auth-btn {
                    width: 100%;
                    padding: 14px;
                    background: #1a1a2e;
                    color: #fff;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 15px;
                    font-weight: 500;
                    letter-spacing: 0.04em;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background 0.2s, transform 0.1s;
                    margin-top: 8px;
                }
                .auth-btn:hover:not(:disabled) {
                    background: #2d2d4e;
                    transform: translateY(-1px);
                }
                .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                .auth-link {
                    color: #1a1a2e;
                    font-weight: 500;
                    text-decoration: none;
                    border-bottom: 1px solid #1a1a2e;
                    padding-bottom: 1px;
                    transition: opacity 0.15s;
                }
                .auth-link:hover { opacity: 0.6; }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fade-up { animation: fadeUp 0.45s ease both; }
                .fade-up-2 { animation: fadeUp 0.45s ease 0.08s both; }
                .fade-up-3 { animation: fadeUp 0.45s ease 0.16s both; }
            `}</style>

            <div style={s.page}>
                <div style={s.panel}>
                    <div style={s.panelInner}>
                        <div style={s.panelBadge}>System zarządzania</div>
                        <h1 style={s.panelTitle}>
                            Salon<br />i Serwis
                        </h1>
                        <p style={s.panelSub}>
                            Zarejestruj konto i umawiaj<br />wizyty w salonie lub serwisie.
                        </p>
                        <div style={s.steps}>
                            {['Wypełnij formularz', 'Potwierdź dane', 'Zacznij korzystać'].map((step, i) => (
                                <div key={step} style={s.step}>
                                    <span style={s.stepNum}>{i + 1}</span>
                                    <span style={s.stepLabel}>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={s.formCol}>
                    <div style={s.formBox}>

                        <div className="fade-up">
                            <p style={s.systemLabel}>System salonu i serwisu</p>
                            <h2 style={s.formTitle}>Zarejestruj się</h2>
                            <p style={s.formSub}>Utwórz konto, aby umawiać wizyty i śledzić usługi.</p>
                        </div>

                        {isError && (
                            <div style={s.alertError} className="fade-up">
                                Błąd rejestracji. Podany adres email może już być zajęty.
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} noValidate>

                            {/* Imię i nazwisko — dwa pola obok siebie */}
                            <div style={s.row} className="fade-up-2">
                                <div style={s.fieldGroup}>
                                    <label style={s.label} htmlFor="firstName">Imię</label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        placeholder="Jan"
                                        className={`auth-input${errors.firstName ? ' error' : ''}`}
                                        {...register('firstName', { required: 'Imię jest wymagane' })}
                                    />
                                    {errors.firstName && <span style={s.errMsg}>{errors.firstName.message}</span>}
                                </div>

                                <div style={s.fieldGroup}>
                                    <label style={s.label} htmlFor="lastName">Nazwisko</label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        placeholder="Kowalski"
                                        className={`auth-input${errors.lastName ? ' error' : ''}`}
                                        {...register('lastName', { required: 'Nazwisko jest wymagane' })}
                                    />
                                    {errors.lastName && <span style={s.errMsg}>{errors.lastName.message}</span>}
                                </div>
                            </div>

                            <div style={s.fieldGroup} className="fade-up-2">
                                <label style={s.label} htmlFor="phone">Numer telefonu</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    placeholder="+48 500 000 000"
                                    className={`auth-input${errors.phone ? ' error' : ''}`}
                                    {...register('phone', { required: 'Telefon jest wymagany' })}
                                />
                                {errors.phone && <span style={s.errMsg}>{errors.phone.message}</span>}
                            </div>

                            <div style={s.fieldGroup} className="fade-up-2">
                                <label style={s.label} htmlFor="reg-email">Adres email</label>
                                <input
                                    id="reg-email"
                                    type="email"
                                    placeholder="jan@przyklad.pl"
                                    className={`auth-input${errors.email ? ' error' : ''}`}
                                    {...register('email', {
                                        required: 'Email jest wymagany',
                                        pattern: { value: /\S+@\S+\.\S+/, message: 'Nieprawidłowy format email' },
                                    })}
                                />
                                {errors.email && <span style={s.errMsg}>{errors.email.message}</span>}
                            </div>

                            <div style={s.fieldGroup} className="fade-up-2">
                                <label style={s.label} htmlFor="reg-password">Hasło</label>
                                <input
                                    id="reg-password"
                                    type="password"
                                    placeholder="Min. 6 znaków"
                                    className={`auth-input${errors.password ? ' error' : ''}`}
                                    {...register('password', {
                                        required: 'Hasło jest wymagane',
                                        minLength: { value: 6, message: 'Hasło musi mieć minimum 6 znaków' },
                                    })}
                                />
                                {errors.password && <span style={s.errMsg}>{errors.password.message}</span>}
                            </div>

                            <div style={s.fieldGroup} className="fade-up-2">
                                <label style={s.label} htmlFor="confirmPassword">Powtórz hasło</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    className={`auth-input${errors.confirmPassword ? ' error' : ''}`}
                                    {...register('confirmPassword', {
                                        required: 'Potwierdzenie hasła jest wymagane',
                                        validate: (val) =>
                                            val === watch('password') || 'Hasła nie są identyczne',
                                    })}
                                />
                                {errors.confirmPassword && <span style={s.errMsg}>{errors.confirmPassword.message}</span>}
                            </div>

                            <div style={s.divider} className="fade-up-2" />

                            <div className="fade-up-3">
                                <button type="submit" disabled={isPending} className="auth-btn">
                                    {isPending ? 'Rejestrowanie…' : 'Utwórz konto'}
                                </button>
                            </div>
                        </form>

                        <p style={s.switchText} className="fade-up-3">
                            Masz już konto?{' '}
                            <Link to="/login" className="auth-link">Zaloguj się</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

const s: Record<string, React.CSSProperties> = {
    page: {
        display: 'flex',
        minHeight: '100vh',
        fontFamily: "'DM Sans', sans-serif",
    },
    panel: {
        width: '42%',
        background: '#1a1a2e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        alignSelf: 'flex-start',
    },
    panelInner: {
        position: 'relative',
        zIndex: 1,
    },
    panelBadge: {
        display: 'inline-block',
        padding: '4px 14px',
        border: '1px solid rgba(226,201,126,0.4)',
        borderRadius: 2,
        color: '#e2c97e',
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.14em',
        textTransform: 'uppercase' as const,
        marginBottom: 28,
        fontFamily: "'DM Sans', sans-serif",
    },
    panelTitle: {
        fontSize: 64,
        fontWeight: 800,
        color: '#fff',
        lineHeight: 1.05,
        margin: '0 0 24px',
        fontFamily: "'Playfair Display', Georgia, serif",
    },
    panelSub: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 1.7,
        margin: '0 0 40px',
        fontWeight: 300,
    },
    steps: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 14,
    },
    step: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
    },
    stepNum: {
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: 'rgba(226,201,126,0.15)',
        border: '1px solid rgba(226,201,126,0.35)',
        color: '#e2c97e',
        fontSize: 12,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    stepLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: 300,
    },
    formCol: {
        flex: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        background: '#f7f7f5',
        padding: '56px 32px',
        overflowY: 'auto',
    },
    formBox: {
        width: '100%',
        maxWidth: 440,
    },
    systemLabel: {
        fontSize: 12,
        fontWeight: 500,
        color: '#aaa',
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        margin: '0 0 12px',
    },
    formTitle: {
        fontSize: 34,
        fontWeight: 700,
        color: '#1a1a2e',
        margin: '0 0 8px',
        fontFamily: "'Playfair Display', Georgia, serif",
    },
    formSub: {
        fontSize: 14,
        color: '#999',
        margin: '0 0 32px',
        fontWeight: 300,
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
    },
    fieldGroup: {
        marginBottom: 20,
    },
    label: {
        display: 'block',
        fontSize: 13,
        fontWeight: 500,
        color: '#444',
        marginBottom: 7,
        letterSpacing: '0.02em',
    },
    errMsg: {
        display: 'block',
        marginTop: 5,
        fontSize: 12,
        color: '#e03e3e',
    },
    divider: {
        height: 1,
        background: '#e8e8e4',
        margin: '4px 0 20px',
    },
    alertError: {
        marginBottom: 20,
        padding: '12px 16px',
        background: '#fff8f8',
        border: '1px solid #fecaca',
        borderRadius: 6,
        color: '#e03e3e',
        fontSize: 13,
        lineHeight: 1.5,
    },
    switchText: {
        marginTop: 24,
        fontSize: 14,
        color: '#888',
        textAlign: 'center' as const,
    },
};