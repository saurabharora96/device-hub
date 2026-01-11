import { useInventory } from '@/context/InventoryContext';
import { Layout } from '@/components/layout/Layout';
import { LabelItem } from '@/components/labels/LabelItem';
import { AddLabelForm } from '@/components/labels/AddLabelForm';
import { Tags, Info } from 'lucide-react';

const Settings = () => {
  const { globalLabels, devices } = useInventory();

  const getLabelUsageCount = (labelKey: string) => {
    return devices.filter((device) => device.labels[labelKey] !== undefined).length;
  };

  return (
    <Layout>
      <div className="p-8 max-w-3xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Label Schema</h1>
          <p className="text-muted-foreground mt-1">
            Define the labels that can be assigned to devices
          </p>
        </div>

        {/* Info Card */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-8">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">How labels work</p>
              <p className="text-muted-foreground mt-1">
                Global labels define the schema for your device metadata. When you add a label
                here, it becomes available as a field when adding or editing devices.
              </p>
            </div>
          </div>
        </div>

        {/* Add Form */}
        <div className="mb-8">
          <AddLabelForm />
        </div>

        {/* Labels List */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Tags className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-medium text-foreground">
              Configured Labels ({globalLabels.length})
            </h2>
          </div>

          {globalLabels.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-card">
              <Tags className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No labels defined yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add your first label above to get started.
              </p>
            </div>
          ) : (
            globalLabels.map((label) => (
              <LabelItem
                key={label.id}
                label={label}
                deviceCount={getLabelUsageCount(label.key)}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
