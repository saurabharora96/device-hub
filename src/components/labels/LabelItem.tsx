import { useState } from 'react';
import { GlobalLabel } from '@/types';
import { useInventory } from '@/context/InventoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Pencil, Trash2, Check, X, Tag } from 'lucide-react';

interface LabelItemProps {
  label: GlobalLabel;
  deviceCount: number;
}

export function LabelItem({ label, deviceCount }: LabelItemProps) {
  const { updateGlobalLabel, deleteGlobalLabel } = useInventory();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label.key);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSave = () => {
    if (editValue.trim()) {
      updateGlobalLabel(label.id, editValue.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(label.key);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteGlobalLabel(label.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 rounded-lg border bg-card card-hover">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Tag className="w-5 h-5 text-primary" />
          </div>
          {isEditing ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-48"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
          ) : (
            <div>
              <span className="font-mono font-medium">{label.key}</span>
              <p className="text-sm text-muted-foreground">
                Used by {deviceCount} device{deviceCount !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon" onClick={handleSave} className="h-8 w-8 text-success">
                <Check className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCancel} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Label</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the <strong>"{label.key}"</strong> label? This will
              remove it from all {deviceCount} device{deviceCount !== 1 ? 's' : ''} that use it.
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
