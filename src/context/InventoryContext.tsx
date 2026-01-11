import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Device, GlobalLabel, DeviceFormData } from '@/types';
import { initialDevices, initialGlobalLabels } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

interface InventoryContextType {
  devices: Device[];
  globalLabels: GlobalLabel[];
  addDevice: (data: DeviceFormData) => void;
  updateDevice: (id: number, data: DeviceFormData) => void;
  deleteDevice: (id: number) => void;
  addGlobalLabel: (key: string) => void;
  updateGlobalLabel: (id: number, key: string) => void;
  deleteGlobalLabel: (id: number) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [globalLabels, setGlobalLabels] = useState<GlobalLabel[]>(initialGlobalLabels);
  const { toast } = useToast();

  const addDevice = (data: DeviceFormData) => {
    const newDevice: Device = {
      id: Date.now(),
      name: data.name,
      ip: data.ip,
      status: 'up',
      labels: data.labels,
    };
    setDevices((prev) => [...prev, newDevice]);
    toast({
      title: 'Device Added',
      description: `${data.name} has been added to the inventory.`,
    });
  };

  const updateDevice = (id: number, data: DeviceFormData) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === id
          ? { ...device, name: data.name, ip: data.ip, labels: data.labels }
          : device
      )
    );
    toast({
      title: 'Device Updated',
      description: `${data.name} has been updated successfully.`,
    });
  };

  const deleteDevice = (id: number) => {
    const device = devices.find((d) => d.id === id);
    setDevices((prev) => prev.filter((d) => d.id !== id));
    toast({
      title: 'Device Deleted',
      description: `${device?.name} has been removed from the inventory.`,
      variant: 'destructive',
    });
  };

  const addGlobalLabel = (key: string) => {
    const newLabel: GlobalLabel = {
      id: Date.now(),
      key: key.toLowerCase().replace(/\s+/g, '_'),
    };
    setGlobalLabels((prev) => [...prev, newLabel]);
    toast({
      title: 'Label Created',
      description: `"${key}" label has been added to the schema.`,
    });
  };

  const updateGlobalLabel = (id: number, key: string) => {
    const oldLabel = globalLabels.find((l) => l.id === id);
    const newKey = key.toLowerCase().replace(/\s+/g, '_');
    
    setGlobalLabels((prev) =>
      prev.map((label) => (label.id === id ? { ...label, key: newKey } : label))
    );

    // Update all devices with the new label key
    if (oldLabel) {
      setDevices((prev) =>
        prev.map((device) => {
          if (device.labels[oldLabel.key] !== undefined) {
            const { [oldLabel.key]: value, ...rest } = device.labels;
            return { ...device, labels: { ...rest, [newKey]: value } };
          }
          return device;
        })
      );
    }

    toast({
      title: 'Label Updated',
      description: `Label has been renamed to "${key}".`,
    });
  };

  const deleteGlobalLabel = (id: number) => {
    const label = globalLabels.find((l) => l.id === id);
    setGlobalLabels((prev) => prev.filter((l) => l.id !== id));

    // Remove the label from all devices
    if (label) {
      setDevices((prev) =>
        prev.map((device) => {
          const { [label.key]: _, ...rest } = device.labels;
          return { ...device, labels: rest };
        })
      );
    }

    toast({
      title: 'Label Deleted',
      description: `"${label?.key}" has been removed from all devices.`,
      variant: 'destructive',
    });
  };

  return (
    <InventoryContext.Provider
      value={{
        devices,
        globalLabels,
        addDevice,
        updateDevice,
        deleteDevice,
        addGlobalLabel,
        updateGlobalLabel,
        deleteGlobalLabel,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
