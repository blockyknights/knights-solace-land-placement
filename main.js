let shieldsData = null;
let gauntletsData = null;

function findItem(data, x, y, sector) {
  if (!data || !Array.isArray(data)) return null;
  const tolerance = 10;
  return data.find(item => 
    item.sector === sector && 
    x >= (item.x || 0) - tolerance && 
    x <= (item.x || 0) + (item.width || 0) + tolerance && 
    y >= (item.y || 0) - tolerance && 
    y <= (item.y || 0) + (item.height || 0) + tolerance
  );
}

function handleShieldClick(e) {
  e.stopPropagation();
  const img = e.currentTarget;
  const rect = img.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const sector = document.querySelector('input[name="sector"]:checked').value;
  const item = findItem(shieldsData, x, y, sector);
  const details = document.getElementById("landDetails");
  if (item) {
    details.innerHTML = `<h3>${item.name || 'Shield'}</h3><p>${item.description || item.info || 'No description available.'}</p>`;
  } else {
    details.innerHTML = '<p>No shield info for this area.</p>';
  }
}

function handleGauntletClick(e) {
  e.stopPropagation();
  const img = e.currentTarget;
  const rect = img.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const sector = document.querySelector('input[name="sector"]:checked').value;
  const item = findItem(gauntletsData, x, y, sector);
  const details = document.getElementById("landDetails");
  if (item) {
    details.innerHTML = `<h3>${item.name || 'Gauntlet'}</h3><p>${item.description || item.info || 'No description available.'}</p>`;
  } else {
    details.innerHTML = '<p>No gauntlet info for this area.</p>';
  }
}

function handleLandClick(e) {
  const img = e.currentTarget;
  const rect = img.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const sector = document.querySelector('input[name="sector"]:checked').value;
  const shield = findItem(shieldsData, x, y, sector);
  const gauntlet = findItem(gauntletsData, x, y, sector);
  const details = document.getElementById("landDetails");
  let html = '<h3>Land Details</h3>';
  if (shield) html += `<h4>Shield: ${shield.name || 'Unnamed'}</h4><p>${shield.description || shield.info || 'No description.'}</p>`;
  if (gauntlet) html += `<h4>Gauntlet: ${gauntlet.name || 'Unnamed'}</h4><p>${gauntlet.description || gauntlet.info || 'No description.'}</p>`;
  if (!shield && !gauntlet) html += '<p>No shield or gauntlet info for this land.</p>';
  details.innerHTML = html;
}

function showSectorData(sector, overlay) {
  const details = document.getElementById("landDetails");
  const sectorName = sector === "s1" ? "Solace 1" : "Solace 2";

  if (overlay === "shields") {
    const results = (shieldsData || []).filter(item => item.sector === sectorName);
    details.innerHTML = `
      <h3 class="info-header">Shields in ${sectorName}</h3>
      ${results.length > 0 
        ? results.map(r => `<p><strong>${r.address}</strong> — ${r.size}, ${r.rarity}</p>`).join("")
        : "<p>No shields data.</p>"}
    `;
    return;
  }

  if (overlay === "gauntlets") {
    const results = (gauntletsData || []).filter(item => item.sector === sectorName);
    details.innerHTML = `
      <h3 class="info-header">Gauntlets in ${sectorName}</h3>
      ${results.length > 0 
        ? results.map(r => `<p><strong>${r.address}</strong> — ${r.size}, ${r.rarity}</p>`).join("")
        : "<p>No gauntlets data.</p>"}
    `;
    return;
  }

  if (overlay === "combined") {
    const shieldsResults = (shieldsData || []).filter(item => item.sector === sectorName);
    const gauntletsResults = (gauntletsData || []).filter(item => item.sector === sectorName);

    details.innerHTML = `
      <h3 class="info-header">Combined Land in ${sectorName}</h3>
      <div class="combined-columns">
        <div class="combined-col">
          <h4 class="info-subheader">Shields</h4>
          ${shieldsResults.length > 0 
            ? shieldsResults.map(r => `<p><strong>${r.address}</strong> — ${r.size}, ${r.rarity}</p>`).join("")
            : "<p>No shields data.</p>"}
        </div>
        <div class="combined-col">
          <h4 class="info-subheader">Gauntlets</h4>
          ${gauntletsResults.length > 0 
            ? gauntletsResults.map(r => `<p><strong>${r.address}</strong> — ${r.size}, ${r.rarity}</p>`).join("")
            : "<p>No gauntlets data.</p>"}
        </div>
      </div>
    `;
    return;
  }

  // fallback
  document.getElementById("landDetails").innerHTML = `<p>No data found for ${overlay} in ${sector}.</p>`;
}

function updateMap() {
  const sector = document.querySelector('input[name="sector"]:checked').value;
  const overlay = document.querySelector('input[name="overlay"]:checked').value;

  const baseMap = document.getElementById("baseMap");
  const shields = document.getElementById("shieldsOverlay");
  const gauntlets = document.getElementById("gauntletsOverlay");

  // Sector switch
  if (sector === "s1") {
    baseMap.src = "images/deep-lakes-s1.png";
    shields.src = "images/shields-solace-1.png";
    gauntlets.src = "images/gauntlets-solace-1.png";
    baseMap.className = "layer s1-base";
    shields.className = "layer s1-shields";
    gauntlets.className = "layer s1-gauntlets";
    document.getElementById("innerMap").className = "inner-map s1";
  } else {
    baseMap.src = "images/great-lagoons-s2.png";
    shields.src = "images/shields-solace-2.png";
    gauntlets.src = "images/gauntlets-solace-2.png";
    baseMap.className = "layer s2-base";
    shields.className = "layer s2-shields";
    gauntlets.className = "layer s2-gauntlets";
    document.getElementById("innerMap").className = "inner-map s2";
  }

  // Overlay switch
  if (overlay === "shields") {
    shields.style.display = "block";
    shields.style.opacity = "1";
    gauntlets.style.display = "none";
  } else if (overlay === "gauntlets") {
    shields.style.display = "none";
    gauntlets.style.display = "block";
    gauntlets.style.opacity = "1";
  } else if (overlay === "combined") {
    shields.style.display = "block";
    shields.style.opacity = "1";
    shields.style.filter = "drop-shadow(0 0 6px #3b82f6)";
    gauntlets.style.display = "block";
    gauntlets.style.opacity = "0.6";
    gauntlets.style.filter = "drop-shadow(0 0 6px #10b981)";
  } else if (overlay === "district") {
    // District map only
    if (sector === "s1") {
      baseMap.src = "images/deep-lakes-s1.png";
    } else {
      baseMap.src = "images/great-lagoons-s2.png";
    }
    shields.style.display = "none";
    gauntlets.style.display = "none";
  }

  baseMap.style.pointerEvents = "auto";

  // Sidebar data
  if (overlay !== "district") {
    showSectorData(sector, overlay);
  } else {
    document.getElementById("landDetails").innerHTML = `<h3>District view — ${sector === "s1" ? "Solace 1" : "Solace 2"}</h3><p>Showing all district placements for this sector.</p>`;
  }
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  const shieldsPromise = fetch('shields.json').then(r => r.json()).then(data => { shieldsData = data; console.log('Shields JSON loaded:', data.length); });
  const gauntletsPromise = fetch('gauntlets.json').then(r => r.json()).then(data => { gauntletsData = data; console.log('Gauntlets JSON loaded:', data.length); });

  Promise.all([shieldsPromise, gauntletsPromise]).then(() => {
    document.getElementById('shieldsOverlay').addEventListener('click', handleShieldClick);
    document.getElementById('gauntletsOverlay').addEventListener('click', handleGauntletClick);
    document.getElementById('baseMap').addEventListener('click', handleLandClick);
    updateMap();
  });

  document.querySelectorAll('#sectorToggle input, #overlayToggle input')
    .forEach(el => el.addEventListener('change', updateMap));
});
