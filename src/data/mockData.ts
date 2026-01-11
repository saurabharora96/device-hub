import { Device, GlobalLabel } from '@/types';

export const initialGlobalLabels: GlobalLabel[] = [
  { id: 1, key: 'environment' },
  { id: 2, key: 'region' },
];

export const initialDevices: Device[] = [
  {
    id: 101,
    name: 'web-server-01',
    ip: '192.168.1.10',
    status: 'up',
    labels: { environment: 'prod', region: 'us-east' },
  },
  {
    id: 102,
    name: 'db-node-01',
    ip: '192.168.1.20',
    status: 'down',
    labels: { environment: 'prod', region: 'us-west' },
  },
  {
    id: 103,
    name: 'cache-server-01',
    ip: '192.168.1.30',
    status: 'up',
    labels: { environment: 'staging', region: 'us-east' },
  },
  {
    id: 104,
    name: 'api-gateway-01',
    ip: '192.168.1.40',
    status: 'up',
    labels: { environment: 'prod', region: 'eu-west' },
  },
];
