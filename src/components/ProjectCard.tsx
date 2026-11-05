'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, MapPin, ShieldCheck, Clock } from 'lucide-react';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-[#F6F5F1] border border-obsidian/12 hover:border-obsidian/40 transition-all duration-500 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Location & Index Header */}
      <div className="px-6 py-3.5 border-b border-obsidian/10 flex items-center justify-between bg-limestone/45">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-obsidian/80">
          <MapPin className="w-3.5 h-3.5 text-copper shrink-0" />
          <span>
            {project.municipality}, {project.province}
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-obsidian/50">
          {project.gallery?.length || 1} FOTOS EXCLUSIVAS
        </span>
      </div>

      {/* Main Cover Photo */}
      <Link
        href={`/obras/${project.slug}`}
        className="block relative aspect-[16/10] overflow-hidden bg-obsidian"
      >
        <img
          src={project.coverImage}
          alt={`${project.title} — ${project.municipality}, ${project.province}`}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/75 via-obsidian/15 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500" />

        {/* Before/After Indicator Pill if available */}
        {project.beforeImage && project.afterImage && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-obsidian/85 backdrop-blur-md border border-white/15 text-[10px] font-mono uppercase tracking-[0.2em] text-alabaster">
            Comparativa Antes / Después
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
          <div className="flex flex-wrap gap-1.5">
            {project.services.slice(0, 3).map((srv) => (
              <span
                key={srv}
                className="px-2.5 py-0.5 bg-obsidian/80 backdrop-blur-sm border border-white/15 font-mono text-[10px] uppercase tracking-wider text-alabaster"
              >
                {srv}
              </span>
            ))}
          </div>
          <span className="w-10 h-10 bg-alabaster text-obsidian flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-2xl font-semibold text-obsidian tracking-tight mb-2 group-hover:text-copper transition-colors">
            <Link href={`/obras/${project.slug}`}>{project.title}</Link>
          </h3>
          <p className="text-sm text-obsidian/70 leading-relaxed line-clamp-2 mb-6">
            {project.subtitle}
          </p>
        </div>

        {/* Technical Footer Metadata */}
        <div className="pt-4 border-t border-obsidian/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-obsidian/65">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-copper" />
              {project.duration}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-copper" />
              Garantía: {project.warrantyWorkmanship}
            </span>
          </div>

          <Link
            href={`/obras/${project.slug}`}
            className="inline-flex items-center gap-1.5 uppercase tracking-[0.16em] text-[11px] font-semibold text-obsidian group-hover:text-copper transition-colors"
          >
            <span>Ver expediente de obra</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

