(function () {

  const N8N_WEBHOOK_URL = "https://n8n.thrivedaily.cloud/webhook/site";

  // ===============================
  // GERAR / RECUPERAR VISITOR ID
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
  // PEGAR DADOS DO HTML
  // ===============================

  const product = document.body.dataset.produto || "unknown";
  const hoplink = document.body.dataset.hoplink;

  // ===============================
  // ENVIAR PARA N8N
  // ===============================

  function sendToN8n(payload) {
    fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...payload,
        visitor_id: visitorId
      })
    }).catch(() => {});
  }

  // ===============================
  // PAGE VIEW
  // ===============================

  sendToN8n({
    event: "page_view",
    product: product,
    url: window.location.href,
    referrer: document.referrer,
    timestamp: new Date().toISOString()
  });

  // ===============================
  // CTA CLICK
  // ===============================

  document.addEventListener("click", function (e) {

    const btn = e.target.closest("[data-cta]");
    if (!btn || !hoplink) return;

    e.preventDefault();

    const finalUrl = hoplink + "?tid=" + visitorId;

    sendToN8n({
      event: "cta_click",
      product: product,
      cta_name: btn.dataset.cta,
      destination: finalUrl,
      timestamp: new Date().toISOString()
    });

    setTimeout(() => {
      window.location.href = finalUrl;
    }, 150);

  });

})();