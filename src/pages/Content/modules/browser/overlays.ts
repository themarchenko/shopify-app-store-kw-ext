export function showBrowserOverlay() {
  // Create a new div element
  const overlay = document.createElement('div');

  // Set styles for the overlay div
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // semi-transparent background
  overlay.style.zIndex = '9999'; // High z-index to overlay everything
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.id = 'scrapingOverlay'; // Set an ID for easy removal

  // Add the text inside the overlay
  overlay.innerHTML =
    '<div style="color: white; font-size: 40px;">Scraping is running, please wait...</div>';

  // Append the overlay to the body
  document.body.appendChild(overlay);
}

export function hideOverlayClose() {
  const overlay = document.getElementById('scrapingOverlay');

  if (overlay) {
    overlay.remove(); // Remove the overlay if it exists
  }
}
