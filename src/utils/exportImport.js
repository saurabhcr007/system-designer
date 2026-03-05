// ══════════════════════════════════════════
// Export / Import Utilities
// ══════════════════════════════════════════

export function exportToJSON(nodes, edges, name = 'My Architecture') {
    const data = {
        meta: {
            name,
            created: new Date().toISOString(),
            generator: 'VibeArch System Designer',
            version: '1.0.0',
        },
        nodes: nodes.map((n) => ({
            ...n,
            selected: undefined,
            dragging: undefined,
        })),
        edges: edges.map((e) => ({
            ...e,
            selected: undefined,
        })),
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '-').toLowerCase()}-architecture.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function importFromJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                // Validate structure
                if (!data.nodes || !Array.isArray(data.nodes)) {
                    throw new Error('Invalid format: missing nodes array');
                }
                if (!data.edges || !Array.isArray(data.edges)) {
                    throw new Error('Invalid format: missing edges array');
                }

                // Validate each node has required fields
                for (const node of data.nodes) {
                    if (!node.id || !node.position) {
                        throw new Error('Invalid node: missing id or position');
                    }
                }

                resolve(data);
            } catch (err) {
                reject(new Error(`Failed to parse JSON: ${err.message}`));
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}
