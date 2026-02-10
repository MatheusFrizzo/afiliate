(async function () {
    try {
        const params = new URLSearchParams(window.location.search);
        const getUTM = (name) => params.get(name) || '';

        const path = window.location.pathname;

        const produto =
            document.body?.dataset?.produto ||
            document.querySelector('body[data-produto]')?.dataset.produto ||
            'home';

        let geo = {};
        try {
            geo = await (await fetch('https://ipapi.co/json/')).json();
        } catch {
            geo = await (await fetch('https://ipinfo.io/json')).json();
        }

        /* ======================
           PAGEVIEW
        ====================== */

        const pageviewPayload = {
            event: 'pageview',
            timestamp: new Date().toISOString(),

            pagina_completa: window.location.href,
            pagina_path: path,
            produto,

            ip: geo.ip || '',
            pais: geo.country_name || geo.country || '',
            estado: geo.region || '',
            cidade: geo.city || '',
            latitude: geo.latitude || '',
            longitude: geo.longitude || '',
            isp: geo.org || '',

            userAgent: navigator.userAgent,
            idioma: navigator.language,
            referrer: document.referrer,

            utm_source: getUTM('utm_source'),
            utm_medium: getUTM('utm_medium'),
            utm_campaign: getUTM('utm_campaign'),
            utm_content: getUTM('utm_content'),
            utm_term: getUTM('utm_term'),

            plataforma:
                getUTM('utm_source').includes('google') ? 'google' :
                getUTM('utm_source').includes('facebook') ? 'meta' :
                getUTM('utm_source').includes('instagram') ? 'meta' :
                'direct'
        };

        fetch('https://n8n.thrivedaily.cloud/webhook/site', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Source': 'thrivedaily'
            },
            body: JSON.stringify(pageviewPayload)
        });

        /* ======================
           CTA TRACKING
        ====================== */

        const CTA_MAP = {
            check_availability: 'CHECK AVAILABILITY & PRICING',
            official_website: 'OFFICIAL WEBSITE',
            go_official: 'GO TO OFFICIAL WEBSITE'
        };

        document.addEventListener('click', async (e) => {
            const el = e.target.closest('a, button');
            if (!el) return;

            let cta = el.dataset.cta || null;

            if (!cta) {
                const text = el.innerText?.trim().toUpperCase();
                for (const [key, label] of Object.entries(CTA_MAP)) {
                    if (text?.includes(label)) {
                        cta = key;
                        break;
                    }
                }
            }

            if (!cta) return;

            const ctaPayload = {
                event: 'cta_click',
                timestamp: new Date().toISOString(),

                cta,
                cta_text: el.innerText.trim(),
                cta_href: el.href || null,

                pagina_completa: location.href,
                pagina_path: location.pathname,
                produto,
                plataforma: 'site'
            };

            try {
                const res = await fetch('https://n8n.thrivedaily.cloud/webhook/site', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Source': 'thrivedaily'
                    },
                    body: JSON.stringify(ctaPayload)
                });

                console.log('CTA tracking enviado:', res.status, ctaPayload);
            } catch (err) {
                console.error('Erro CTA tracking:', err);
            }
        });

    } catch (err) {
        console.error('Tracking error:', err);
    }
})();
