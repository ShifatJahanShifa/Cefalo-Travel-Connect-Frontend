import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet-control-geocoder";


// // export default function MapSelectorPage() {
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null);

// //   const handleSelect = () => {
// //     if (selected) {
// //       const { returnTo, section, index } = location.state || {};
// //       navigate(returnTo || "/", {
// //         state: {
// //           lat: selected.lat,
// //           lng: selected.lng,
// //           section,
// //           index,
// //         },
// //       });
// //     }
// //   };

// //   function ClickHandler() {
// //     useMapEvents({
// //       click(e: any) {
// //         setSelected(e.latlng);
// //       },
// //     });
// //     return null;
// //   }

// //   return (
// //     <div className="h-screen w-full relative">
// //       <MapContainer center={[23.8103, 90.4125]} zoom={6} style={{ height: "100%", width: "100%" }}>

    

// //         <TileLayer
// //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //           attribution="&copy; OpenStreetMap contributors"
// //         />
// //         <ClickHandler />
// //         {selected && <Marker position={selected} />}
// //       </MapContainer>
// //       {selected && (
// //         <div className="absolute bottom-4 left-4 bg-white p-4 rounded shadow">
// //           <p>Lat: {selected.lat.toFixed(4)}, Lng: {selected.lng.toFixed(4)}</p>
// //           <button
// //             className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
// //             onClick={handleSelect}
// //           >
// //             Confirm Location
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }



// export default function MapSelectorPage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null);

//   const handleSelect = () => {
//     if (selected) {
//       const { returnTo, section, index } = location.state || {};
//       navigate(returnTo || "/", {
//         state: {
//           lat: selected.lat,
//           lng: selected.lng,
//           section,
//           index,
//         },
//       });
//     }
//   };

//   function ClickHandler() {
//     useMapEvents({
//       click(e) {
//         setSelected(e.latlng);
//       },
//     });
//     return null;
//   }

//   function GeocoderControl() {
//     const map = useMap();

//     useEffect(() => {
//       const geocoder = (L.Control as any).geocoder({
//         defaultMarkGeocode: true,
//       });

//       geocoder
//         .on("markgeocode", function (e: any) {
//           const center = e.geocode.center;
//           setSelected(center);
//           map.setView(center, 13);
//         })
//         .addTo(map);

//       return () => {
//         map.removeControl(geocoder);
//       };
//     }, [map]);

//     return null;
//   }

//   return (
//     <div className="h-screen w-full pt-6 relative">
//       <MapContainer
//         center={[23.8103, 90.4125]} // Dhaka default
//         zoom={6}
//         style={{ height: "100%", width: "100%" }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution="&copy; OpenStreetMap contributors"
//         />
//         <GeocoderControl />
//         <ClickHandler />
//         {selected && <Marker position={selected} />}
//       </MapContainer>

//       {selected && (
//         <div className="absolute bottom-4 left-4 bg-white p-4 rounded shadow">
//           <p>Lat: {selected.lat.toFixed(4)}, Lng: {selected.lng.toFixed(4)}</p>
//           <button
//             className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
//             onClick={handleSelect}
//           >
//             Confirm Location
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }



export default function MapSelectorPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [selected, setSelected] = useState<{
    lat: number;
    lng: number;
    name?: string;
  } | null>(null);

  const handleSelect = () => {
    if (selected) {
      const { returnTo, section, index } = location.state || {};
      navigate(returnTo || "/", {
        state: {
          lat: selected.lat,
          lng: selected.lng,
          place_name: selected.name || "",
          section,
          index,
        },
      });
    }
  };

  function ClickHandler() {
    useMapEvents({
      click(e) {
        setSelected({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  }

  function GeocoderControl() {
    const map = useMap();

    useEffect(() => {
      const geocoder = (L.Control as any).geocoder({
        defaultMarkGeocode: true,
      });

      geocoder
        .on("markgeocode", function (e: any) {
          const center = e.geocode.center;
          const name = e.geocode.name;
          setSelected({ lat: center.lat, lng: center.lng, name });
          map.setView(center, 13);
        })
        .addTo(map);

      return () => {
        map.removeControl(geocoder);
      };
    }, [map]);

    return null;
  }

  return (
    <div className="h-screen w-full pt-6 relative">
      <MapContainer
        center={[23.8103, 90.4125]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <GeocoderControl />
        <ClickHandler />
        {selected && <Marker position={[selected.lat, selected.lng]} />}
      </MapContainer>

      {selected && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded shadow">
          <p>
            Lat: {selected.lat.toFixed(4)}, Lng: {selected.lng.toFixed(4)}
          </p>
          {selected.name && <p className="text-sm text-gray-600">{selected.name}</p>}
          <button
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
            onClick={handleSelect}
          >
            Confirm Location
          </button>
        </div>
      )}
    </div>
  );
}
