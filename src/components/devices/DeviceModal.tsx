import { useEffect, useState } from 'react';
import { Device, DeviceFormData } from '@/types';
import { useInventory } from '@/context/InventoryContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DeviceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device?: Device | null;
}

export function DeviceModal({ open, onOpenChange, device }: DeviceModalProps) {
  const { globalLabels, addDevice, updateDevice } = useInventory();
  const [formData, setFormData] = useState<DeviceFormData>({
    name: '',
    ip: '',
    labels: {},
  });

  useEffect(() => {
    if (device) {
      setFormData({
        name: device.name,
        ip: device.ip,
        labels: { ...device.labels },
      });
    } else {
      // Initialize with empty label values for all global labels
      const emptyLabels: Record<string, string> = {};
      globalLabels.forEach((label) => {
        emptyLabels[label.key] = '';
      });
      setFormData({ name: '', ip: '', labels: emptyLabels });
    }
  }, [device, globalLabels, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty labels
    const filteredLabels: Record<string, string> = {};
    Object.entries(formData.labels).forEach(([key, value]) => {
      if (value.trim()) {
        filteredLabels[key] = value.trim();
      }
    });

    const data = { ...formData, labels: filteredLabels };

    if (device) {
      updateDevice(device.id, data);
    } else {
      addDevice(data);
    }
    onOpenChange(false);
  };

  const handleLabelChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      labels: { ...prev.labels, [key]: value },
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{device ? 'Edit Device' : 'Add New Device'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Device Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., web-server-01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ip">IP Address</Label>
            <Input
              id="ip"
              value={formData.ip}
              onChange={(e) => setFormData((prev) => ({ ...prev, ip: e.target.value }))}
              placeholder="e.g., 192.168.1.10"
              pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
              title="Please enter a valid IP address"
              required
            />
          </div>

          {globalLabels.length > 0 && (
            <div className="space-y-3 pt-2">
              <Label className="text-muted-foreground">Labels</Label>
              <div className="grid gap-3">
                {globalLabels.map((label) => (
                  <div key={label.id} className="grid grid-cols-3 items-center gap-3">
                    <Label htmlFor={`label-${label.key}`} className="text-sm font-mono capitalize">
                      {label.key}
                    </Label>
                    <Input
                      id={`label-${label.key}`}
                      value={formData.labels[label.key] || ''}
                      onChange={(e) => handleLabelChange(label.key, e.target.value)}
                      placeholder={`Enter ${label.key}...`}
                      className="col-span-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{device ? 'Update Device' : 'Add Device'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
