import { useState, useMemo } from 'react';
import { useInventory } from '@/context/InventoryContext';
import { Layout } from '@/components/layout/Layout';
import { DeviceTable } from '@/components/devices/DeviceTable';
import { DeviceModal } from '@/components/devices/DeviceModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Server, AlertCircle, CheckCircle } from 'lucide-react';

const Index = () => {
  const { devices } = useInventory();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const filteredDevices = useMemo(() => {
    if (!search.trim()) return devices;
    
    const query = search.toLowerCase();
    return devices.filter(
      (device) =>
        device.name.toLowerCase().includes(query) ||
        device.ip.includes(query) ||
        Object.entries(device.labels).some(
          ([key, value]) =>
            key.toLowerCase().includes(query) || value.toLowerCase().includes(query)
        )
    );
  }, [devices, search]);

  const upCount = devices.filter((d) => d.status === 'up').length;
  const downCount = devices.filter((d) => d.status === 'down').length;

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Device Inventory</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor your network devices
            </p>
          </div>
          <Button onClick={() => setModalOpen(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Device
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Server className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{devices.length}</p>
                <p className="text-sm text-muted-foreground">Total Devices</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{upCount}</p>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{downCount}</p>
                <p className="text-sm text-muted-foreground">Offline</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, IP, or label..."
            className="pl-10"
          />
        </div>

        {/* Table */}
        <DeviceTable devices={filteredDevices} />

        {/* Add Modal */}
        <DeviceModal open={modalOpen} onOpenChange={setModalOpen} />
      </div>
    </Layout>
  );
};

export default Index;
