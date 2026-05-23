import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LocationRequest, LocationType } from '@/types/location.types';
import { MapClickHandler } from './MapClickHandler';
import { styles, addStyles } from './mapStyles';

const LOCATION_TYPES: LocationType[] = ['SALON', 'SERVICE', 'HYBRID'];
const TYPE_LABELS: Record<string, string> = {
    SALON: 'Salon', SERVICE: 'Serwis', HYBRID: 'Salon+Serwis',
};
const EMPTY_FORM: LocationRequest = {
    name: '', phone: '', street: '', city: '', zipCode: '',
    latitude: 0, longitude: 0, locationType: 'SALON',
};

interface Props {
    onClose: () => void;
    onSave: (data: LocationRequest) => void;
}

export function AddLocationModal({ onClose, onSave }: Props) {
    const [form, setForm] = useState<LocationRequest>(EMPTY_FORM);
    const [errors, setErrors] = useState<Partial<Record<keyof LocationRequest, string>>>({});
    const hasPin = form.latitude !== 0 || form.longitude !== 0;

    const set = (field: keyof LocationRequest, value: string | number) =>
        setForm(prev => ({ ...prev, [field]: value }));

    const validate = (): boolean => {
        const e: typeof errors = {};
        if (!form.name.trim())    e.name     = 'Pole wymagane';
        if (!form.street.trim())  e.street   = 'Pole wymagane';
        if (!form.city.trim())    e.city     = 'Pole wymagane';
        if (!form.zipCode.trim()) e.zipCode  = 'Pole wymagane';
        if (!hasPin)              e.latitude = 'Kliknij na mapę aby wybrać lokalizację';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleMapClick = (lat: number, lng: number) => {
        setForm(prev => ({ ...prev, latitude: lat, longitude: lng }));
        setErrors(prev => ({ ...prev, latitude: undefined }));
    };

    const mapCenter: [number, number] = hasPin ? [form.latitude, form.longitude] : [52.23, 21.01];

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={{ ...styles.modal, width: 700 }} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <div>
                        <span style={styles.modalTitle}>Nowa lokalizacja</span>
                        <span style={styles.modalAddress}>Wypełnij dane i kliknij na mapie aby wybrać pozycję</span>
                    </div>
                    <button onClick={onClose} style={styles.modalClose}>✕</button>
                </div>

                <div style={addStyles.formGrid}>
                    <div style={addStyles.field}>
                        <label style={addStyles.label}>Nazwa *</label>
                        <input style={addStyles.input} value={form.name}
                               onChange={e => set('name', e.target.value)} placeholder="np. Salon Warszawa Centrum" />
                        {errors.name && <span style={addStyles.error}>{errors.name}</span>}
                    </div>
                    <div style={addStyles.field}>
                        <label style={addStyles.label}>Telefon</label>
                        <input style={addStyles.input} value={form.phone}
                               onChange={e => set('phone', e.target.value)} placeholder="+48 000 000 000" />
                    </div>
                    <div style={{ ...addStyles.field, gridColumn: '1 / -1' }}>
                        <label style={addStyles.label}>Ulica i numer *</label>
                        <input style={addStyles.input} value={form.street}
                               onChange={e => set('street', e.target.value)} placeholder="np. ul. Marszałkowska 1" />
                        {errors.street && <span style={addStyles.error}>{errors.street}</span>}
                    </div>
                    <div style={addStyles.field}>
                        <label style={addStyles.label}>Miasto *</label>
                        <input style={addStyles.input} value={form.city}
                               onChange={e => set('city', e.target.value)} placeholder="np. Warszawa" />
                        {errors.city && <span style={addStyles.error}>{errors.city}</span>}
                    </div>
                    <div style={addStyles.field}>
                        <label style={addStyles.label}>Kod pocztowy *</label>
                        <input style={addStyles.input} value={form.zipCode}
                               onChange={e => set('zipCode', e.target.value)} placeholder="00-000" />
                        {errors.zipCode && <span style={addStyles.error}>{errors.zipCode}</span>}
                    </div>
                    <div style={addStyles.field}>
                        <label style={addStyles.label}>Typ</label>
                        <select style={addStyles.input} value={form.locationType}
                                onChange={e => set('locationType', e.target.value as LocationType)}>
                            {LOCATION_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                        </select>
                    </div>
                    <div style={addStyles.field}>
                        <label style={addStyles.label}>Współrzędne</label>
                        <div style={{ display: 'flex', gap: 6 }}>
                            <input
                                style={{ ...addStyles.input, flex: 1, fontFamily: 'monospace', fontSize: 12 }}
                                value={hasPin ? form.latitude.toFixed(6) : ''}
                                onChange={e => set('latitude', parseFloat(e.target.value) || 0)}
                                placeholder="Szerokość"
                            />
                            <input
                                style={{ ...addStyles.input, flex: 1, fontFamily: 'monospace', fontSize: 12 }}
                                value={hasPin ? form.longitude.toFixed(6) : ''}
                                onChange={e => set('longitude', parseFloat(e.target.value) || 0)}
                                placeholder="Długość"
                            />
                        </div>
                        {errors.latitude && <span style={addStyles.error}>{errors.latitude}</span>}
                    </div>
                </div>

                <div style={addStyles.mapHint}>
                    {hasPin
                        ? `Pinezka ustawiona: ${form.latitude.toFixed(5)}, ${form.longitude.toFixed(5)} — kliknij ponownie aby przesunąć`
                        : 'Kliknij na mapie aby ustawić lokalizację'}
                </div>
                <MapContainer
                    key={String(hasPin)}
                    center={mapCenter}
                    zoom={hasPin ? 15 : 6}
                    style={{ height: 280, width: '100%', cursor: 'crosshair' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapClickHandler onMapClick={handleMapClick} />
                    {hasPin && (
                        <Marker position={[form.latitude, form.longitude]}>
                            <Popup>{form.name || 'Nowa lokalizacja'}</Popup>
                        </Marker>
                    )}
                </MapContainer>

                <div style={{ ...styles.modalFooter, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button onClick={onClose} style={styles.btnCancel}>Anuluj</button>
                    <button onClick={() => { if (validate()) onSave(form); }} style={addStyles.btnSave}>
                        Zapisz lokalizację
                    </button>
                </div>
            </div>
        </div>
    );
}