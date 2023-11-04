import TopBar from '@/components/TopBar';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import Geohash from 'latlon-geohash';

import getDispatcher from "waku-dispatcher"
import { DispatchMetadata, Dispatcher, Signer } from 'waku-dispatcher';

const trackOptions = {
    enableHighAccuracy: true,
    maximumAge: 6000,
    timeout: 5000,
};

export default function Dashboard() {
    const router = useRouter();
    const { address, isConnecting, isDisconnected } = useAccount();
    const [location, setLocation] = useState(null);

    // const send = async () => {
    //     dispatcher.emit("hello")
    // }

    useEffect(() => {
        if (typeof window !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (loc) => {
                    console.log(loc);
                    setLocation({
                        heading: loc.coords.heading,
                        lat: loc.coords.latitude,
                        lon: loc.coords.longitude,
                        speed: loc.coords.speed,
                        geoHash: Geohash.encode(loc.coords.latitude, loc.coords.longitude),
                        timestamp: loc.timestamp,
                    });
                },
                () => { },
                trackOptions
            );
        }
    }, []);

    useEffect(() => {
        if (!address) {
            router.push('/');
        }
    }, [address]);

    // useEffect(() => {
    //     if (dispatcher) return;

    //     (async () => {
    //         const d = await getDispatcher(undefined, "/ethlisbon/"+{}, "temperature", false)
    //         if (d === null) return
    //         setDispatcher(d)
    //     })()
    // }, [])

    return (
        <>
            <header>
                <TopBar />
            </header>
            <main className="p-5">
                <h1 className="underline">TODOs</h1>
                <br />
                GEOHASH: {location && location.geoHash}
                <br />
                Peers connected : X
                <br />
                Peers :
                <li>
                    Peer #
                </li>

                <br />
                <div id='chat' className='border p-10'>

                    <div id='messages'>
                        You : hi
                    </div>
                    <div className='flex space-x-3 mt-5'>
                        <input className=' border px-2 ' placeholder='Enter your message' />
                        <button className='p-1 bg-black text-white'>Send</button>
                    </div>
                </div>
            </main>
        </>
    );
}
