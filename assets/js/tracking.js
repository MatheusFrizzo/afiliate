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

        const payload = {
            timestamp: new Date().toISOString(),

            pagina_completa: window.location.href,
            pagina_path: path,
            produto: produto,

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

        const res = await fetch('https://n8n.thrivedaily.cloud/webhook/site', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Source': 'thrivedaily'
            },
            body: JSON.stringify(payload)
        });

        console.log('Tracking enviado:', res.status, payload);

    } catch (err) {
        console.error('Tracking error:', err);
    }
})();
