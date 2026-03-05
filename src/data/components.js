// ══════════════════════════════════════════
// Component Library — All Architecture Components
// ══════════════════════════════════════════

export const componentCategories = [
    {
        id: 'traffic',
        label: 'Traffic & Edge',
        icon: '🌐',
        components: [
            { id: 'dns', label: 'DNS', icon: '🌐', color: '#4ade80', type: 'base' },
            { id: 'cdn', label: 'CDN', icon: '🌍', color: '#fbbf24', type: 'base' },
            { id: 'load-balancer', label: 'Load Balancer', icon: '⚖️', color: '#818cf8', type: 'base' },
            { id: 'api-gateway', label: 'API Gateway', icon: '🔀', color: '#f472b6', type: 'base' },
            { id: 'waf', label: 'WAF', icon: '🛡️', color: '#34d399', type: 'base' },
            { id: 'ingress', label: 'Ingress', icon: '📥', color: '#60a5fa', type: 'base' },
            { id: 'reverse-proxy', label: 'Reverse Proxy', icon: '🔁', color: '#a78bfa', type: 'base' },
        ],
    },
    {
        id: 'compute',
        label: 'Compute',
        icon: '⚙️',
        components: [
            { id: 'service', label: 'Service / App', icon: '⚙️', color: '#a78bfa', type: 'base', defaultData: { replicas: 1, healthCheck: '' } },
            { id: 'container', label: 'Container', icon: '🐳', color: '#38bdf8', type: 'base', defaultData: { image: '', port: '8080', envVars: '' } },
            { id: 'kubernetes', label: 'Kubernetes', icon: '☸️', color: '#326CE5', type: 'base', defaultData: { clusterName: 'K8s Cluster' } },
            { id: 'vm', label: 'VM / Server', icon: '🖥️', color: '#94a3b8', type: 'base' },
            { id: 'lambda', label: 'Lambda / Func', icon: 'λ', color: '#fb923c', type: 'base' },
            { id: 'worker', label: 'Worker', icon: '👷', color: '#e2e8f0', type: 'base' },
        ],
    },
    {
        id: 'storage',
        label: 'Storage',
        icon: '🗄️',
        components: [
            { id: 'postgres', label: 'PostgreSQL / MySQL', icon: '🗄️', color: '#4ade80', type: 'base', defaultData: { dbType: 'PostgreSQL', replication: false } },
            { id: 'mongodb', label: 'MongoDB', icon: '🍃', color: '#6dbd63', type: 'base', defaultData: { dbType: 'MongoDB', replication: false } },
            { id: 'redis', label: 'Redis / Cache', icon: '⚡', color: '#f87171', type: 'base', defaultData: { dbType: 'Redis', replication: false } },
            { id: 'elasticsearch', label: 'Elasticsearch', icon: '🔍', color: '#fbbf24', type: 'base', defaultData: { dbType: 'Elasticsearch', replication: false } },
            { id: 's3', label: 'S3 / Blob Store', icon: '🪣', color: '#fb923c', type: 'base' },
            { id: 'hdfs', label: 'HDFS', icon: '🗂️', color: '#94a3b8', type: 'base' },
        ],
    },
    {
        id: 'networking',
        label: 'Networking',
        icon: '🏗️',
        components: [
            { id: 'vpc', label: 'VPC', icon: '🏗️', color: '#818cf8', type: 'group' },
            { id: 'subnet', label: 'Subnet', icon: '📡', color: '#60a5fa', type: 'group' },
            { id: 'firewall', label: 'Firewall', icon: '🔥', color: '#f87171', type: 'base' },
            { id: 'vpn', label: 'VPN', icon: '🔐', color: '#34d399', type: 'base' },
            { id: 'nat-gateway', label: 'NAT Gateway', icon: '🌉', color: '#fbbf24', type: 'base' },
        ],
    },
    {
        id: 'messaging',
        label: 'Messaging',
        icon: '📨',
        components: [
            { id: 'kafka', label: 'Kafka', icon: '📨', color: '#818cf8', type: 'base' },
            { id: 'rabbitmq', label: 'RabbitMQ', icon: '🐇', color: '#ff6b35', type: 'base' },
            { id: 'sqs', label: 'SQS / Queue', icon: '📋', color: '#34d399', type: 'base' },
            { id: 'event-bus', label: 'Event Bus', icon: '🔔', color: '#f472b6', type: 'base' },
            { id: 'websocket', label: 'WebSocket', icon: '🔌', color: '#38bdf8', type: 'base' },
        ],
    },
    {
        id: 'monitoring',
        label: 'Monitoring',
        icon: '📊',
        components: [
            { id: 'prometheus', label: 'Prometheus', icon: '📊', color: '#fb923c', type: 'base' },
            { id: 'grafana', label: 'Grafana', icon: '📈', color: '#fbbf24', type: 'base' },
            { id: 'logging', label: 'Logging', icon: '📝', color: '#94a3b8', type: 'base' },
            { id: 'alert-manager', label: 'Alert Manager', icon: '🚨', color: '#f87171', type: 'base' },
            { id: 'apm', label: 'APM / Tracing', icon: '🔭', color: '#a78bfa', type: 'base' },
        ],
    },
    {
        id: 'security',
        label: 'Security',
        icon: '🔑',
        components: [
            { id: 'auth-server', label: 'Auth Server / OAuth', icon: '🔑', color: '#f472b6', type: 'base' },
            { id: 'secret-manager', label: 'Secret Manager', icon: '🗝️', color: '#34d399', type: 'base' },
            { id: 'sso', label: 'SSO / SAML', icon: '🪪', color: '#fbbf24', type: 'base' },
        ],
    },
    {
        id: 'ai',
        label: 'AI & Agents',
        icon: '🤖',
        components: [
            { id: 'ai-model', label: 'AI Model', icon: '🤖', color: '#c084fc', type: 'base' },
            { id: 'ai-agent', label: 'AI Agent', icon: '👾', color: '#fb923c', type: 'base' },
            { id: 'vector-db', label: 'Vector DB', icon: '🧠', color: '#818cf8', type: 'base', defaultData: { dbType: 'VectorDB', replication: false } },
            { id: 'embedding-svc', label: 'Embedding Svc', icon: '🔮', color: '#38bdf8', type: 'base' },
        ],
    },
];

// Helper to find a component definition by its ID
export function findComponentById(id) {
    for (const category of componentCategories) {
        const comp = category.components.find((c) => c.id === id);
        if (comp) return comp;
    }
    return null;
}

// Edge type definitions
export const edgeTypeOptions = [
    { id: 'sync', label: 'Sync HTTP', style: 'solid', color: '#818cf8' },
    { id: 'async', label: 'Async Event', style: 'dashed', color: '#34d399' },
    { id: 'db-query', label: 'Database Query', style: 'dotted', color: '#fbbf24' },
    { id: 'grpc', label: 'gRPC', style: 'double', color: '#f472b6' },
];
