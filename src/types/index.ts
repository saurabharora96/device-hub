export interface GlobalLabel {
  id: number;
  key: string;
}

export interface Device {
  id: number;
  name: string;
  ip: string;
  status: 'up' | 'down';
  labels: Record<string, string>;
}

export interface DeviceFormData {
  name: string;
  ip: string;
  labels: Record<string, string>;
}
