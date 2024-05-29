'use client'
import { AnalysisByCriteriaPage } from '@/app/components/templates/analysisByCriteriaPage'
/**
 *  AnalysisByContentPage
 *  Page for Content search analysis
 *
 * Path: '/analysis/content'
 *
 * @param {void}
 * @returns {JSX.Element}
 */
export default function AnalysisByContentPage() {

  return (
    <AnalysisByCriteriaPage keyProp="content" />
  );
}