// Optional GPS check. It only reports location updates; indoor accuracy is not guaranteed.
function startCampusGpsCheck(onUpdate, onError) {
  if (!('geolocation' in navigator)) { if(onError) onError('Geolocation is not supported by this browser.'); return null; }
  return navigator.geolocation.watchPosition(
    pos => { if(onUpdate) onUpdate({latitude:pos.coords.latitude, longitude:pos.coords.longitude, accuracy:pos.coords.accuracy}); },
    err => { if(onError) onError(err.message || 'Location permission unavailable.'); },
    { enableHighAccuracy:true, maximumAge:3000, timeout:10000 }
  );
}
