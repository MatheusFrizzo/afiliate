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
    }).catch(() => { });
  }

  // ===============================
  // PAGE VIEW
  // ===============================

  sendToN8n({
    event: "page_view",
    product: product,
    page_url: window.location.href,
    page_path: window.location.pathname,
    referrer: document.referrer || null,
    timestamp: new Date().toISOString()
  });

  // ===============================
  // CHATWOOT TRACKING CORRETO
  // ===============================

  function sendChatwootData() {

    if (!window.$chatwoot) {
      setTimeout(sendChatwootData, 500);
      return;
    }

    window.$chatwoot.setCustomAttributes({
      product: product,
      visitor_id: visitorId,
      page: window.location.pathname,
      utm_source: new URLSearchParams(window.location.search).get("utm_source"),
      utm_campaign: new URLSearchParams(window.location.search).get("utm_campaign")
    });

  }

  window.addEventListener("chatwoot:ready", function () {
    sendChatwootData();
  });

  sendChatwootEvent();

  // ===============================
  // CTA CLICK
  // ===============================

  document.addEventListener("click", function (e) {

    const btn = e.target.closest("[data-cta]");
    if (!btn || !hoplink) return;

    e.preventDefault();

    const finalUrl = hoplink + "?aff_sub1=" + visitorId + "&aff_sub2=" + product;

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