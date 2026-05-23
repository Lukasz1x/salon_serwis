import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Location } from '@/types/location.types';
import { styles } from './mapStyles';

interface Props {
    location: Location;
    onClose: () => void;
}

export function MapModal({ location, onClose }: Props) {
    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <div>
                        <span style={styles.modalTitle}>{location.name}</span>
                        <span style={styles.modalAddress}>
                            {location.street}, {location.zipCode} {location.city}
                        </span>
                    </div>
                    <button onClick={onClose} style={styles.modalClose}>✕</button>
                </div>
                <MapContainer
                    center={[location.latitude, location.longitude]}
                    zoom={15}
                    style={{ height: 380, width: '100%' }}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[location.latitude, location.longitude]}>
                        <Popup>
                            <strong>{location.name}</strong><br />
                            {location.street}<br />
                            {location.zipCode} {location.city}
                        </Popup>
                    </Marker>
                </MapContainer>
                <div style={styles.modalFooter}>
                    <a
                        href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=16/${location.latitude}/${location.longitude}`}
                        target="_blank" rel="noreferrer" style={styles.modalLink}
                    >
                        Otwórz w OpenStreetMap ↗
                    </a>
                </div>
            </div>
        </div>
);
}