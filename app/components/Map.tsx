"use client";

import { GoogleMapsEmbed } from '@next/third-parties/google'

const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

export default function Map()
{
    return (
        <GoogleMapsEmbed
            apiKey={mapsKey}
            height={400}
            width="100%"
            mode="place"
            q="Merkatå Bruktbutikk Oslo, Schweigaards gate 92"
        />
    );
}