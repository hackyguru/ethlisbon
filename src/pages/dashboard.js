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
    const [message, setMessage] = useState(null);
    const [trimmedLocation, setTrimmedLocation] = useState(null);
    const [texts, setTexts] = useState([]);


    const [dispatcher, setDispatcher] = useState()

    const send = async () => {
        dispatcher.emit("hello", { sender: address, message: message, timestamp: Date.now() })
    }

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
        if (location !== null) {
            setTrimmedLocation(location.geoHash.substring(0, 6));
            console.log(trimmedLocation)
        }
    }, [location]);



    useEffect(() => {
        if (!address) {
            router.push('/');
        }
    }, [address]);

    useEffect(() => {
        if (dispatcher) return;

        (async () => {
            const d = await getDispatcher(undefined, "/ethlisbon/" + { trimmedLocation }, "hello", false)
            if (d === null) return
            setDispatcher(d)
        })()
    }, [])

    useEffect(() => {
        if (!dispatcher) return

        dispatcher.on("hello", (data) => {
            setTexts((x) => [...x, data])
        })
        dispatcher.dispatchLocalQuery()
    }, [dispatcher])

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
                        {texts.map((r, i) => (
                            <div className='my-1' key={i.toString()}>
                                {r.address} : {r.message} at {r.timestamp}
                            </div>
                        ))}
                    </div>
                    <div className='flex space-x-3 mt-5'>
                        <input type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)} className=' border px-2 ' placeholder='Enter your message' />
                        <button onClick={() => send()} className='p-1 bg-black text-white'>Send</button>
                    </div>
                </div>
            </main>
        </>
    );
}
