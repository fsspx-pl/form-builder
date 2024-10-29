'use client'

import { useSelection } from '@payloadcms/ui';
import * as XLSX from 'xlsx';
import classes from './index.module.scss';

const collection = 'form-submissions';

export const ExportButton = () => {
  const select = useSelection();

  const exportXLSX = async () => {
    const selectedIds = Array.from(select.selected.keys());

    try {
      const docs = await Promise.all(
        selectedIds.map(async id => {
          const response = await fetch(`/api/export/${collection}/${id}`);
          if (!response.ok) throw new Error(`Failed to fetch document ${id}`);
          return response.json();
        })
      );

      const ws = XLSX.utils.json_to_sheet(docs);
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
