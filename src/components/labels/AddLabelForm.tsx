import { useState } from 'react';
import { useInventory } from '@/context/InventoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

export function AddLabelForm() {
  const { addGlobalLabel, globalLabels } = useInventory();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const normalizedValue = value.trim().toLowerCase().replace(/\s+/g, '_');
    
    if (!normalizedValue) {
      setError('Label key is required');
      return;
    }

    if (globalLabels.some((l) => l.key === normalizedValue)) {
      setError('This label already exists');
      return;
    }

    addGlobalLabel(value.trim());
    setValue('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1">
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError('');
          }}
          placeholder="Enter new label key (e.g., datacenter)"
          className={error ? 'border-destructive' : ''}
        />
        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      </div>
      <Button type="submit">
        <Plus className="w-4 h-4 mr-2" />
        Add Label
      </Button>
    </form>
  );
}
