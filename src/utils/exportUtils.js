// utils/exportUtils.js
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } from 'docx';

// Helper function to get nested property value
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => {
        return current ? current[key] : undefined;
    }, obj);
};

// Format cell value for export
const formatValueForExport = (value, columnKey) => {
    if (value === null || value === undefined) {
        return '';
    }

    // Handle nested objects
    if (typeof value === 'object' && !(value instanceof Date)) {
        if (value.name) return value.name;
        if (value.filename) return value.filename;
        return JSON.stringify(value);
    }
    switch (columnKey) {
        case 'dealAmount':
        case 'tokenReceivedAmount':
        case 'balanceAmount':
            return `₹${Number(value).toLocaleString('en-IN')}`;

        case 'receivedPercent':
        case 'remainPercent':
            return `${value}%`;

        case 'createdAt':
        case 'tokenDate':
            return new Date(value).toLocaleDateString('en-IN');

        default:
            return String(value);
    }
};

export const exportToCSV = (data, columns, filename = 'export') => {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    // Use all columns for export
    const exportColumns = columns.map(col => ({
        key: col.key,
        label: col.label
    }));

    // Create CSV header
    const headers = exportColumns.map(col => col.label).join(',');

    // Create CSV rows
    const rows = data.map(row => {
        return exportColumns.map(column => {
            const value = getNestedValue(row, column.key);
            const formattedValue = formatValueForExport(value, column.key);

            // Escape quotes and wrap in quotes if contains comma or quotes
            if (formattedValue.includes(',') || formattedValue.includes('"') || formattedValue.includes('\n')) {
                return `"${formattedValue.replace(/"/g, '""')}"`;
            }

            return formattedValue;
        }).join(',');
    });

    // Combine header and rows
    const csvContent = [headers, ...rows].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
};

export const exportToDOCX = async (data, columns, filename = 'export') => {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    // Use all columns for export
    const exportColumns = columns.map(col => ({
        key: col.key,
        label: col.label
    }));

    // Create table rows
    const rows = data.map((row, rowIndex) => {
        const cells = exportColumns.map(column => {
            const value = getNestedValue(row, column.key);
            const formattedValue = formatValueForExport(value, column.key);

            return new TableCell({
                children: [new Paragraph({
                    children: [new TextRun(String(formattedValue))],
                })],
            });
        });

        return new TableRow({
            children: cells,
        });
    });

    // Add header row
    const headerRow = new TableRow({
        children: exportColumns.map(column =>
            new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({
                        text: column.label,
                        bold: true,
                    })],
                })],
                shading: {
                    fill: "DDDDDD",
                },
            })
        ),
    });

    // Create document with title
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Clients Export - ${new Date().toLocaleDateString()}`,
                            bold: true,
                            size: 28,
                        }),
                    ],
                }),
                new Paragraph({}),
                new Table({
                    rows: [headerRow, ...rows],
                }),
            ],
        }],
    });

    // Generate blob and download
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.docx`);
};

// Export specific columns only
export const exportSelectedColumns = (data, selectedColumns, filename = 'export') => {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    const headers = selectedColumns.map(col => col.label).join(',');

    const rows = data.map(row => {
        return selectedColumns.map(column => {
            const value = getNestedValue(row, column.key);
            const formattedValue = formatValueForExport(value, column.key);

            if (formattedValue.includes(',') || formattedValue.includes('"') || formattedValue.includes('\n')) {
                return `"${formattedValue.replace(/"/g, '""')}"`;
            }

            return formattedValue;
        }).join(',');
    });

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
};