import TopBar from '@/components/TopBar'
import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

//Misc
import { useAccount } from 'wagmi'

//Temp
import Geohash from "latlon-geohash"

const trackOptions = {
    enableHighAccuracy: true,
    maximumAge: 6000,
    timeout: 5000,
  };

export default function dashboard() {
    const router = useRouter()
	const { address, isConnecting, isDisconnected } = useAccount()

    //Location
    const [location, setLocation ] = useState(null);

    const update = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((loc) => {
                console.log(loc)

                setLocation({
                    heading: loc.coords.heading,
                    lat: loc.coords.latitude,
                    lon: loc.coords.longitude,
                    speed: loc.coords.speed,
                    geoHash: Geohash.encode(loc.coords.latitude, loc.coords.longitude),
                    timestamp: loc.timestamp
                })
            }, () => {}, trackOptions)
        }
    }


	
	useEffect(() => {
		if (!address) {
		  router.push('/')
		}
	  }, [address])

      useEffect(() => {
        const interval = setInterval(() => update(), 5000)
        return () => {
            clearInterval(interval)
        }
    }, [])


  return (
    <>
    <header>
        <TopBar />
    </header>
        <main className='p-5 '>
            <h1 className='underline'>TODOs</h1>
            <br />
            GEOHASH : {
            location&&
            location.geoHash}
        </main>
    </>
  )
}
