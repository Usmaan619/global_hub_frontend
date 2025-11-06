'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

export default function SlowNetworkDialog() {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    console.log('connection: ', connection);

    if (!connection) return;

    const checkNetwork = () => {
      const effectiveType = connection.effectiveType;
      console.log('effectiveType: ', effectiveType);

      // 🔍 Check if network is 3g or worse
      if (['slow-2g', '2g', '3g'].includes(effectiveType)) {
        setShowDialog(true);
      } else {
        setShowDialog(false);
      }
    };

    checkNetwork(); // Initial check
    connection.addEventListener('change', checkNetwork); // Listen to network changes

    return () => {
      connection.removeEventListener('change', checkNetwork);
    };
  }, []);

  if (!showDialog) return null;

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-yellow-600">
            <AlertTriangle className="w-5 h-5" />
            Slow Network Detected
          </DialogTitle>
          <DialogDescription>
            Your current network connection is slow (3G or lower). Some features may load slowly or not work as expected.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
