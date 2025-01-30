import React from 'react';
import { Clock, RefreshCw } from 'lucide-react';

const MensajesPrediccion = ({ prediction }) => {
  if (!prediction) return null;

  return (
    <div className="mt-1.5 flex items-center gap-2">
      {prediction.needs_review && (
        <div className="inline-flex shrink-0 items-center gap-1 bg-white bg-opacity-15 
                      px-0 py-0.5 rounded-full border border-white border-opacity-20
                      shadow-sm backdrop-blur-sm">
          <RefreshCw size={10} className="animate-spin" />
          <span className="text-xs font-medium text-white whitespace-nowrap">¡Vuelve a practicar!</span>
        </div>
      )}
      <div className="inline-flex shrink-0 items-center gap-1 bg-white bg-opacity-15 
                    px-2 py-0.5 rounded-full border border-white border-opacity-20
                    shadow-sm backdrop-blur-sm">
        <Clock size={10} />
        <span className="text-xs font-medium text-white whitespace-nowrap">
          Tiempo recomendado: {prediction.recommended_timer}s
        </span>
      </div>
    </div>
  );
};

export default MensajesPrediccion;