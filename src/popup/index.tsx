import '../setPublicPath';

import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';

const PopupApp = lazy(() => import('./PopupApp'));

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <Suspense fallback={<div>Loading...</div>}>
      <PopupApp />
    </Suspense>
  );
}