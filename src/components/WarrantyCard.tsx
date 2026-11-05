import React from 'react';
import { ShieldCheck, Layers, FileText } from 'lucide-react';

interface WarrantyCardProps {
  workmanship: string;
  materials: string;
  conditions: string;
}

export function WarrantyCard({
  workmanship,
  materials,
  conditions,
}: WarrantyCardProps) {
  return (
    <div className="bg-[#F6F5F1] border border-obsidian/15 p-8 sm:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-obsidian/10">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-copper block mb-1.5">
            Respaldo Técnico Documentado
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-semibold text-obsidian tracking-tight">
            Garantía de la intervención
          </h3>
        </div>
        <span className="px-3.5 py-1.5 bg-obsidian text-alabaster font-mono text-[10px] uppercase tracking-[0.2em] self-start sm:self-auto">
          Cobertura Configurable por Proyecto
        </span>
      </div>

      {/* Two Primary Warranty Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-limestone/55 border border-obsidian/12 flex items-start gap-4">
          <div className="w-11 h-11 bg-obsidian text-alabaster flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-copper" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-obsidian/60 block mb-1">
              Garantía de mano de obra
            </span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-obsidian tracking-tight">
              {workmanship}
            </p>
            <p className="text-xs text-obsidian/65 mt-1.5 leading-relaxed">
              Sobre la ejecución constructiva realizada directamente por el equipo técnico de RADECO.
            </p>
          </div>
        </div>

        <div className="p-6 bg-limestone/55 border border-obsidian/12 flex items-start gap-4">
          <div className="w-11 h-11 bg-obsidian text-alabaster flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 text-copper" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-obsidian/60 block mb-1">
              Garantía de materiales
            </span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-obsidian tracking-tight">
              {materials}
            </p>
            <p className="text-xs text-obsidian/65 mt-1.5 leading-relaxed">
              Conforme a las fichas técnicas y certificados de los sistemas impermeabilizantes y de cobertura empleados.
            </p>
          </div>
        </div>
      </div>

      {/* Condiciones de garantía */}
      {conditions && (
        <div className="pt-6 border-t border-obsidian/10">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-obsidian font-semibold mb-2.5">
            <FileText className="w-3.5 h-3.5 text-copper" />
            <span>Condiciones de garantía aplicables a esta obra</span>
          </div>
          <p className="text-xs sm:text-sm text-obsidian/70 leading-relaxed bg-obsidian/[0.03] border-l-2 border-copper px-4 py-3">
            {conditions}
          </p>
        </div>
      )}
    </div>
  );
}

