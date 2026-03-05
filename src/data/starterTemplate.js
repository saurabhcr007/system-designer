// ══════════════════════════════════════════
// Starter Template — Sample System Architecture
// A typical microservices architecture to get started
// ══════════════════════════════════════════

export const starterTemplate = {
    nodes: [
        // — Traffic Layer —
        {
            id: 'starter-dns',
            type: 'base',
            position: { x: 400, y: 20 },
            data: { label: 'DNS', icon: '🌐', color: '#4ade80', componentId: 'dns', isEntryPoint: true },
        },
        {
            id: 'starter-cdn',
            type: 'base',
            position: { x: 180, y: 120 },
            data: { label: 'CDN', icon: '🌍', color: '#fbbf24', componentId: 'cdn' },
        },
        {
            id: 'starter-lb',
            type: 'base',
            position: { x: 400, y: 120 },
            data: { label: 'Load Balancer', icon: '⚖️', color: '#818cf8', componentId: 'load-balancer' },
        },
        {
            id: 'starter-waf',
            type: 'base',
            position: { x: 620, y: 120 },
            data: { label: 'WAF', icon: '🛡️', color: '#34d399', componentId: 'waf' },
        },

        // — Compute Layer —
        {
            id: 'starter-api',
            type: 'base',
            position: { x: 400, y: 250 },
            data: { label: 'API Gateway', icon: '🔀', color: '#f472b6', componentId: 'api-gateway' },
        },
        {
            id: 'starter-auth',
            type: 'base',
            position: { x: 640, y: 250 },
            data: { label: 'Auth Server', icon: '🔑', color: '#f472b6', componentId: 'auth-server' },
        },
        {
            id: 'starter-user-svc',
            type: 'base',
            position: { x: 200, y: 380 },
            data: { label: 'User Service', icon: '⚙️', color: '#a78bfa', componentId: 'service', technology: 'Node.js', replicas: 3 },
        },
        {
            id: 'starter-order-svc',
            type: 'base',
            position: { x: 420, y: 380 },
            data: { label: 'Order Service', icon: '⚙️', color: '#a78bfa', componentId: 'service', technology: 'Go', replicas: 2 },
        },
        {
            id: 'starter-payment-svc',
            type: 'base',
            position: { x: 640, y: 380 },
            data: { label: 'Payment Service', icon: '⚙️', color: '#a78bfa', componentId: 'service', technology: 'Java' },
        },

        // — Messaging —
        {
            id: 'starter-kafka',
            type: 'base',
            position: { x: 420, y: 510 },
            data: { label: 'Kafka', icon: '📨', color: '#818cf8', componentId: 'kafka' },
        },
        {
            id: 'starter-worker',
            type: 'base',
            position: { x: 640, y: 510 },
            data: { label: 'Email Worker', icon: '👷', color: '#e2e8f0', componentId: 'worker' },
        },

        // — Storage Layer —
        {
            id: 'starter-postgres',
            type: 'base',
            position: { x: 200, y: 530 },
            data: { label: 'PostgreSQL', icon: '🗄️', color: '#4ade80', componentId: 'postgres', dbType: 'PostgreSQL', replication: true },
        },
        {
            id: 'starter-redis',
            type: 'base',
            position: { x: 80, y: 380 },
            data: { label: 'Redis Cache', icon: '⚡', color: '#f87171', componentId: 'redis', dbType: 'Redis' },
        },
        {
            id: 'starter-s3',
            type: 'base',
            position: { x: 80, y: 530 },
            data: { label: 'S3 Storage', icon: '🪣', color: '#fb923c', componentId: 's3' },
        },

        // — Monitoring —
        {
            id: 'starter-prometheus',
            type: 'base',
            position: { x: 80, y: 180 },
            data: { label: 'Prometheus', icon: '📊', color: '#fb923c', componentId: 'prometheus' },
        },
        {
            id: 'starter-grafana',
            type: 'base',
            position: { x: 80, y: 260 },
            data: { label: 'Grafana', icon: '📈', color: '#fbbf24', componentId: 'grafana' },
        },
    ],

    edges: [
        // DNS → LB
        { id: 'se-1', source: 'starter-dns', target: 'starter-lb', type: 'custom', data: { edgeType: 'sync', label: 'resolve', color: '#4ade80' } },
        // DNS → CDN
        { id: 'se-2', source: 'starter-dns', target: 'starter-cdn', type: 'custom', data: { edgeType: 'sync', label: '', color: '#fbbf24' } },
        // LB → WAF
        { id: 'se-3', source: 'starter-lb', target: 'starter-waf', type: 'custom', data: { edgeType: 'sync', label: '', color: '#818cf8' } },
        // LB → API Gateway
        { id: 'se-4', source: 'starter-lb', target: 'starter-api', type: 'custom', data: { edgeType: 'sync', label: 'route', color: '#818cf8' } },
        // API → Auth
        { id: 'se-5', source: 'starter-api', target: 'starter-auth', type: 'custom', data: { edgeType: 'sync', label: 'verify JWT', color: '#f472b6' } },
        // API → User Service
        { id: 'se-6', source: 'starter-api', target: 'starter-user-svc', type: 'custom', data: { edgeType: 'sync', label: '/users', color: '#f472b6' } },
        // API → Order Service
        { id: 'se-7', source: 'starter-api', target: 'starter-order-svc', type: 'custom', data: { edgeType: 'sync', label: '/orders', color: '#f472b6' } },
        // API → Payment Service
        { id: 'se-8', source: 'starter-api', target: 'starter-payment-svc', type: 'custom', data: { edgeType: 'grpc', label: 'gRPC', color: '#f472b6' } },
        // User Service → PostgreSQL
        { id: 'se-9', source: 'starter-user-svc', target: 'starter-postgres', type: 'custom', data: { edgeType: 'db-query', label: 'SQL', color: '#4ade80' } },
        // User Service → Redis
        { id: 'se-10', source: 'starter-user-svc', target: 'starter-redis', type: 'custom', data: { edgeType: 'db-query', label: 'cache', color: '#f87171' } },
        // Order Service → Kafka
        { id: 'se-11', source: 'starter-order-svc', target: 'starter-kafka', type: 'custom', data: { edgeType: 'async', label: 'events', color: '#818cf8' } },
        // Payment Service → Kafka
        { id: 'se-12', source: 'starter-payment-svc', target: 'starter-kafka', type: 'custom', data: { edgeType: 'async', label: 'payment.done', color: '#818cf8' } },
        // Kafka → Worker
        { id: 'se-13', source: 'starter-kafka', target: 'starter-worker', type: 'custom', data: { edgeType: 'async', label: 'consume', color: '#e2e8f0' } },
        // Order Service → PostgreSQL
        { id: 'se-14', source: 'starter-order-svc', target: 'starter-postgres', type: 'custom', data: { edgeType: 'db-query', label: 'SQL', color: '#4ade80' } },
        // CDN → S3
        { id: 'se-15', source: 'starter-cdn', target: 'starter-s3', type: 'custom', data: { edgeType: 'sync', label: 'origin', color: '#fb923c' } },
        // Prometheus → Grafana
        { id: 'se-16', source: 'starter-prometheus', target: 'starter-grafana', type: 'custom', data: { edgeType: 'sync', label: 'scrape', color: '#fb923c' } },
    ],
};
