(function () {

  const N8N_WEBHOOK_URL = "https://SEU_N8N_WEBHOOK_AQUI";

  function getProductFromUrl() {
    const path = window.location.pathname.toLowerCase();

    return path.includes('orexiburn') ? 'orexiburn' :
           path.includes('prodentim') ? 'prodentim' :
           'unknown';
  }

  function sendToN8n(payload) {
    fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }).catch(() => {});
  }

  // 🔹 PAGE VIEW
  sendToN8n({
    event: "page_view",
    product: getProductFromUrl(),
    url: window.location.href,
    referrer: document.referrer,
    timestamp: new Date().toISOString()
  });

  // 🔹 CTA CLICK
  document.addEventListener("click", function (e) {
    const btn = e.target.closest("a[data-cta]");
    if (!btn) return;

    e.preventDefault();

    const destination = btn.href;

    sendToN8n({
      event: "cta_click",
      product: getProductFromUrl(),
      cta_name: btn.dataset.cta,
      url: window.location.href,
      destination: destination,
      timestamp: new Date().toISOString()
    });

    setTimeout(() => {
      window.location.href = destination;
    }, 150);
  });

})();
