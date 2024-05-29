'use client'
import React from 'react';
import { AnalysisByCriteriaPage } from '@/app/components/templates/analysisByCriteriaPage'
/**
 * AnalysisByTitlePage
 * Page for Title search analysis
 *
 * Path: '/analysis/title'
 */
export default function AnalysisByTitlePage() {
  return (
    <AnalysisByCriteriaPage keyProp="title" />
  );
}