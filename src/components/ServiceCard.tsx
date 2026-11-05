'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { ServiceDetail } from '@/types';

interface ServiceCardProps {
  service: ServiceDetail;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  // Dedicated subpages exist for the 4 main routes requested in section 29, plus dynamic fallback
  const dedicatedRoutes = new Set([
    'cubiertas-tejados',
    'impermeabilizacion',
    'terrazas',
    'rehabilitacion',
  ]);
  const targetHref = dedicatedRoutes.has(service.slug)
    ? `/servicios/${service.slug}`
    : `/servicios#${service.slug}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-[#F6F5F1] border border-obsidian/12 hover:border-obsidian/35 transition-all duration-500 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Technical Bar */}
      <div className="px-6 py-4 border-b border-obsidian/10 flex items-center justify-between bg-limestone/40">
        <span className="font-mono text-xs font-semibold tracking-[0.22em] text-copper">
          {service.index}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-obsidian/50">
          Especialidad RADECO
        </span>
      </div>

      {/* Image Container with Micro-Interaction */}
      <Link href={targetHref} className="block relative h-60 overflow-hidden bg-obsidian">
        <img
          src={service.image}
          alt={`${service.title} en Asturias — RADECO`}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-obsidian/15 to-transparent opacity-65 group-hover:opacity-45 transition-opacity duration-500" />
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] bg-obsidian/75 backdrop-blur-sm px-2.5 py-1 border border-white/15">
            Asturias
          </span>
          <span className="w-9 h-9 bg-alabaster text-obsidian flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-obsidian tracking-tight mb-2.5 group-hover:text-copper transition-colors">
            <Link href={targetHref}>{service.title}</Link>
          </h3>
          <p className="text-sm text-obsidian/70 leading-relaxed mb-5">
            {service.shortDescription}
          </p>
        </div>

        <div className="pt-4 border-t border-obsidian/10 space-y-2">
          {service.specifications.slice(0, 2).map((spec) => (
            <div key={spec.title} className="flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] uppercase tracking-wider text-obsidian/50">
                {spec.title}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-copper/60" />
            </div>
          ))}
          <div className="pt-2">
            <Link
              href={targetHref}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-obsidian font-semibold group-hover:text-copper transition-colors"
            >
              <span>Especificaciones técnicas</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

