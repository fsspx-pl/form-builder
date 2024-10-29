'use client'

import { useSelection } from '@payloadcms/ui';
import * as XLSX from 'xlsx';
import classes from './index.module.scss';

const collection = 'form-submissions';

export const ExportButton = () => {
  const select = useSelection();

  const exportXLSX = async () => {
    const selectedIds = Array.from(select.selected.entries()).filter(([key, selected]) => selected && key).map(([key]) => key);

    try {
      const response = await fetch(`/api/form-submissions/batch`, {
        method: 'POST',
        body: JSON.stringify({ submissionIds: selectedIds })
      });

      const submissions = await response.json();
      
      // Transform nested submission data into flat structure
      const flattenedData = submissions.map((submission: any) => {
        // Create base object with common fields
        const baseData = {
          id: submission.id,
          createdAt: submission.createdAt,
          updatedAt: submission.updatedAt,
        };

        // Convert submission data array into key-value pairs
        const formFields = submission.submissionData.reduce((acc: any, item: any) => ({
          ...acc,
          [item.field]: item.value
        }), {});

        // Combine base data with form fields
        return {
          ...baseData,
          ...formFields
        };
      });

      const ws = XLSX.utils.json_to_sheet(flattenedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Entries');
      XLSX.writeFile(wb, `${collection}-export-${new Date().toISOString()}.xlsx`);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className={classes.container}>
      <button onClick={exportXLSX} disabled={!select.count}>
        {select.count ? `(${select.count})` : ''} Export
      </button>
    </div>
  );
};
