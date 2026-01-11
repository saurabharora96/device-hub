import { useState } from 'react';
import { Device } from '@/types';
import { useInventory } from '@/context/InventoryContext';
import { StatusIndicator } from './StatusIndicator';
import { LabelBadge } from './LabelBadge';
import { DeviceModal } from './DeviceModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';

interface DeviceTableProps {
  devices: Device[];
}

export function DeviceTable({ devices }: DeviceTableProps) {
  const { deleteDevice } = useInventory();
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [deletingDevice, setDeletingDevice] = useState<Device | null>(null);

  const handleDelete = () => {
    if (deletingDevice) {
      deleteDevice(deletingDevice.id);
      setDeletingDevice(null);
    }
  };

  return (
    <>
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-24">Status</TableHead>
              <TableHead>Device Name</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Labels</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  No devices found. Add your first device to get started.
                </TableCell>
              </TableRow>
            ) : (
              devices.map((device) => (
                <TableRow key={device.id} className="table-row-hover">
                  <TableCell>
                    <StatusIndicator status={device.status} />
                  </TableCell>
                  <TableCell className="font-mono font-medium">{device.name}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">{device.ip}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(device.labels).map(([key, value]) => (
                        <LabelBadge key={key} labelKey={key} value={value} />
                      ))}
                      {Object.keys(device.labels).length === 0 && (
                        <span className="text-sm text-muted-foreground">No labels</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingDevice(device)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingDevice(device)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DeviceModal
        open={!!editingDevice}
        onOpenChange={(open) => !open && setEditingDevice(null)}
        device={editingDevice}
      />

      <AlertDialog open={!!deletingDevice} onOpenChange={(open) => !open && setDeletingDevice(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Device</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deletingDevice?.name}</strong>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
