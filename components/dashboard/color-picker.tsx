'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onColorSelect: (color: string) => void;
  currentColor: string;
  presetColors: string[];
}

export function ColorPicker({
  isOpen,
  onClose,
  onColorSelect,
  currentColor,
  presetColors
}: ColorPickerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Trip Color</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex justify-center">
            <div
              className="h-16 w-16 rounded-full border-2 border-white shadow-md"
              style={{ backgroundColor: currentColor }}
            />
          </div>

          <div className="grid grid-cols-5 gap-2">
            {presetColors.map(color => (
              <button
                key={color}
                className="h-10 w-full rounded-md border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#359572] focus:ring-offset-2"
                style={{
                  backgroundColor: color,
                  borderColor: color === currentColor ? 'white' : color,
                  boxShadow:
                    color === currentColor ? '0 0 0 2px #359572' : 'none'
                }}
                onClick={() => onColorSelect(color)}
              />
            ))}
          </div>

          <div>
            <label
              htmlFor="custom-color"
              className="mb-2 block text-sm font-medium"
            >
              Custom Color
            </label>
            <input
              type="color"
              id="custom-color"
              value={currentColor}
              onChange={e => onColorSelect(e.target.value)}
              className="h-10 w-full cursor-pointer rounded-md border-0"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="bg-[#359572] hover:bg-[#2c7a5e]"
              onClick={() => onColorSelect(currentColor)}
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
