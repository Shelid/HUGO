'use client';

import React, { useState, useMemo } from 'react';
import { Project } from '@/types';
import { ProjectCard } from './ProjectCard';
import { MapPin, Layers } from 'lucide-react';

interface ProjectsCatalogClientProps {
  projects: Project[];
}

export function ProjectsCatalogClient({ projects }: ProjectsCatalogClientProps) {
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('Todos');
  const [selectedService, setSelectedService] = useState<string>('Todos');

  const municipalities = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.municipality) set.add(p.municipality);
    });
    return ['Todos', ...Array.from(set)];
  }, [projects]);

  const servicesList = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      p.services.forEach((s) => set.add(s));
    });
    return ['Todos', ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchMuni =
        selectedMunicipality === 'Todos' || p.municipality === selectedMunicipality;
      const matchSrv =
        selectedService === 'Todos' || p.services.includes(selectedService);
      return matchMuni && matchSrv;
    });
  }, [projects, selectedMunicipality, selectedService]);

  return (
    <div className="space-y-12">
      {/* Filter Bar */}
      <div className="bg-[#F6F5F1] border border-obsidian/15 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Municipality Filter */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-obsidian/55">
            <MapPin className="w-3.5 h-3.5 text-copper" />
            <span>Filtrar por Concejo / Municipio</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {municipalities.map((muni) => (
              <button
                key={muni}
                type="button"
                onClick={() => setSelectedMunicipality(muni)}
                className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider border transition-all ${
                  selectedMunicipality === muni
                    ? 'bg-obsidian text-alabaster border-obsidian'
                    : 'bg-white text-obsidian/75 border-obsidian/15 hover:border-obsidian/40'
                }`}
              >
                {muni}
              </button>
            ))}
          </div>
        </div>

        {/* Service Filter */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-obsidian/55">
            <Layers className="w-3.5 h-3.5 text-copper" />
            <span>Filtrar por Tipo de Intervención</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {servicesList.map((srv) => (
              <button
                key={srv}
                type="button"
                onClick={() => setSelectedService(srv)}
                className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider border transition-all ${
                  selectedService === srv
                    ? 'bg-copper text-white border-copper'
                    : 'bg-white text-obsidian/75 border-obsidian/15 hover:border-obsidian/40'
                }`}
              >
                {srv}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 bg-limestone/40 border border-obsidian/12 text-center space-y-4">
          <p className="font-display text-xl text-obsidian">
            No se encontraron obras con los filtros seleccionados.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedMunicipality('Todos');
              setSelectedService('Todos');
            }}
            className="px-5 py-2.5 bg-obsidian text-alabaster font-mono text-xs uppercase tracking-wider"
          >
            Restablecer filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {filtered.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

