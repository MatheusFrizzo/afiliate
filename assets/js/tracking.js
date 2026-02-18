(function () {

  const N8N_WEBHOOK_URL = "https://n8n.thrivedaily.cloud/webhook/site";

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

// ===============================
// GERAR ID ÚNICO POR VISITANTE
// ===============================

function generateVisitorId() {
    return 'v_' + Math.random().toString(36).substring(2, 12);
}

let visitorId = localStorage.getItem('visitor_id');

if (!visitorId) {
    visitorId = generateVisitorId();
    localStorage.setItem('visitor_id', visitorId);
}

// ===============================
// LINK BASE DA CLICKBANK
// ===============================

const clickbankBaseUrl = "https://1d95djjcmhvxc8me-ab3is3llf.hop.clickbank.net"; 

// ===============================
// CAPTURAR TODOS OS BOTÕES CTA
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const ctas = document.querySelectorAll("[data-cta]");

    ctas.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();

            const finalUrl = clickbankBaseUrl + "?tid=" + visitorId;

            console.log("Redirecionando com TID:", visitorId);

            window.location.href = finalUrl; //alert(finalUrl);
        });
    });

});
