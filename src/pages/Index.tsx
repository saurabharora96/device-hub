import { useState, useMemo } from 'react';
import { useInventory } from '@/context/InventoryContext';
import { Layout } from '@/components/layout/Layout';
import { DeviceTable } from '@/components/devices/DeviceTable';
import { DeviceModal } from '@/components/devices/DeviceModal';
import { LabelFilter } from '@/components/devices/LabelFilter';
import { Button } from '@/components/ui/button';
import { Plus, Server, AlertCircle, CheckCircle, FilterX } from 'lucide-react';

const Index = () => {
  const { devices, globalLabels } = useInventory();
  const [filters, setFilters] = useState<Record<string, string | null>>({});
  const [modalOpen, setModalOpen] = useState(false);

  // Get all unique values for each label
  const labelValues = useMemo(() => {
    const values: Record<string, string[]> = {};
    globalLabels.forEach((label) => {
      values[label.key] = devices
        .map((device) => device.labels[label.key])
        .filter(Boolean);
    });
    return values;
  }, [devices, globalLabels]);

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return device.labels[key] === value;
      });
    });
  }, [devices, filters]);

  const handleFilterChange = (labelKey: string, value: string | null) => {
    setFilters((prev) => ({ ...prev, [labelKey]: value }));
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

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

        {/* Label Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {globalLabels.map((label) => (
            <LabelFilter
              key={label.id}
              labelKey={label.key}
              values={labelValues[label.key] || []}
              selectedValue={filters[label.key] || null}
              onSelect={(value) => handleFilterChange(label.key, value)}
            />
          ))}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground"
            >
              <FilterX className="w-4 h-4 mr-1" />
              Clear filters
            </Button>
          )}
          {filteredDevices.length !== devices.length && (
            <span className="text-sm text-muted-foreground ml-auto">
              Showing {filteredDevices.length} of {devices.length} devices
            </span>
          )}
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
