import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

export default defineConfig({
  name: 'rtm-calendar',
  title: 'RTM Events Calendar',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: '/studio',
  plugins: [
    structureTool(),
    visionTool(),
  ],
  schema: {
    types: [
      {
        name: 'event',
        type: 'document',
        title: 'Wydarzenie / IP',
        fields: [
          {
            name: 'title',
            type: 'string',
            title: 'Tytuł',
            validation: (Rule: any) => Rule.required(),
          },
          {
            name: 'type',
            type: 'string',
            title: 'Typ',
            options: {
              list: [
                { title: 'Film', value: 'film' },
                { title: 'Serial', value: 'serial' },
                { title: 'Gra', value: 'gra' },
                { title: 'Wydarzenie', value: 'wydarzenie' },
              ],
              layout: 'radio',
            },
            validation: (Rule: any) => Rule.required(),
          },
          {
            name: 'quarter',
            type: 'number',
            title: 'Kwartał 2027',
            options: {
              list: [
                { title: 'Q1 (sty–mar)', value: 1 },
                { title: 'Q2 (kwi–cze)', value: 2 },
                { title: 'Q3 (lip–wrz)', value: 3 },
                { title: 'Q4 (paź–gru)', value: 4 },
              ],
              layout: 'radio',
            },
            validation: (Rule: any) => Rule.required().integer().min(1).max(4),
          },
          {
            name: 'date',
            type: 'string',
            title: 'Termin premiery / data',
            description: 'Np. 17.12.2027 lub "early 2027" jeśli data niepewna',
            validation: (Rule: any) => Rule.required(),
          },
          {
            name: 'studio',
            type: 'string',
            title: 'Studio / wydawca / organizator',
          },
          {
            name: 'ip',
            type: 'string',
            title: 'IP / rodzaj własności',
          },
          {
            name: 'buzz',
            type: 'number',
            title: 'Potencjał buzz (1–10)',
            validation: (Rule: any) => Rule.required().min(1).max(10).integer(),
          },
          {
            name: 'risk',
            type: 'number',
            title: 'Ryzyko (1–10)',
            validation: (Rule: any) => Rule.required().min(1).max(10).integer(),
          },
          {
            name: 'recommendation',
            type: 'string',
            title: 'Rekomendacja licencyjna',
            options: {
              list: [
                { title: 'Wysoka', value: 'wysoka' },
                { title: 'Średnia / wysoka', value: 'srednia' },
                { title: 'Średnia', value: 'srednia-niska' },
              ],
              layout: 'radio',
            },
            validation: (Rule: any) => Rule.required(),
          },
          {
            name: 'layer',
            type: 'number',
            title: 'Warstwa licencyjna',
            description: '1 = Anchor license | 2 = Fandom premium | 3 = High-upside / trigger-based',
            options: {
              list: [
                { title: 'W1 — Anchor license (masowy retail)', value: 1 },
                { title: 'W2 — Fandom-driven premium', value: 2 },
                { title: 'W3 — High-upside / trigger-based', value: 3 },
              ],
              layout: 'radio',
            },
            validation: (Rule: any) => Rule.required().integer().min(1).max(3),
          },
          {
            name: 'target',
            type: 'string',
            title: 'Grupa docelowa',
          },
          {
            name: 'certainty',
            type: 'string',
            title: 'Pewność informacji',
            options: {
              list: [
                { title: 'Wysoka', value: 'wysoka' },
                { title: 'Średnia', value: 'srednia' },
                { title: 'Niska', value: 'niska' },
              ],
              layout: 'radio',
            },
          },
          {
            name: 'notes',
            type: 'text',
            title: 'Notatki / uzasadnienie',
            rows: 4,
          },
          {
            name: 'source',
            type: 'url',
            title: 'Źródło (URL)',
          },
        ],
        preview: {
          select: { title: 'title', subtitle: 'date' },
        },
      },
    ],
  },
})
