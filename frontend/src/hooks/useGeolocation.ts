import { useState, useEffect } from "react";

interface LocationI {
    speed: number | null;
    accuracy: number | string | undefined;
    lat: number | string | undefined;
    lng: number | string | undefined;
}

const useGeoLocation = () => {
    const [location, setLocation] = useState<LocationI>({
        speed: 0,
        accuracy: 0,
        lat: "",
        lng: "",
    });

    useEffect(() => {
        if (!("geolocation" in navigator)) return;

        setInterval(() => {
            navigator.geolocation.watchPosition((position) => {
                const { latitude, longitude, accuracy, speed } =
                    position.coords;
                setLocation({
                    lat: latitude,
                    lng: longitude,
                    accuracy: accuracy,
                    speed: speed,
                });
            });
        }, 3000);
    });

    return location;
};

export default useGeoLocation;