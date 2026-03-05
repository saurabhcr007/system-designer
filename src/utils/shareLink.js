// ══════════════════════════════════════════
// Share Link Utilities
// ══════════════════════════════════════════

export function encodeToURL(nodes, edges) {
    try {
        const data = { nodes, edges };
        const json = JSON.stringify(data);
        const encoded = btoa(unescape(encodeURIComponent(json)));
        const url = new URL(window.location.href);
        url.hash = encoded;
        return url.toString();
    } catch (err) {
        console.error('Failed to encode design to URL:', err);
        return null;
    }
}

export function decodeFromURL() {
    try {
        const hash = window.location.hash.slice(1);
        if (!hash) return null;
        const json = decodeURIComponent(escape(atob(hash)));
        const data = JSON.parse(json);
        if (data.nodes && data.edges) {
            return data;
        }
        return null;
    } catch (err) {
        console.error('Failed to decode design from URL:', err);
        return null;
    }
}

export function copyShareLink(nodes, edges) {
    const url = encodeToURL(nodes, edges);
    if (url) {
        navigator.clipboard.writeText(url).catch(() => {
            // Fallback for older browsers
            const input = document.createElement('input');
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
        });
        return true;
    }
    return false;
}
