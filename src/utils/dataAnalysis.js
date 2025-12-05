import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export const parseFile = (file) => {
    return new Promise((resolve, reject) => {
        const extension = file.name.split('.').pop().toLowerCase();

        if (extension === 'csv') {
            Papa.parse(file, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => resolve(results.data),
                error: (error) => reject(error),
            });
        } else if (['xlsx', 'xls'].includes(extension)) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                resolve(json);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        } else {
            reject(new Error('Unsupported file type'));
        }
    });
};

export const analyzeColumns = (data) => {
    if (!data || data.length === 0) return [];

    const columns = Object.keys(data[0]);
    const columnStats = columns.map((col) => {
        const values = data.map((row) => row[col]).filter((v) => v !== null && v !== undefined);
        const nonNullCount = values.length;

        if (nonNullCount === 0) return { name: col, type: 'unknown' };

        const isNumeric = values.every((v) => !isNaN(Number(v)));
        const isDate = values.every((v) => !isNaN(Date.parse(v)));

        // Simple heuristic for categorical: low cardinality relative to data size
        const uniqueValues = new Set(values);
        const isCategorical = uniqueValues.size < Math.min(50, nonNullCount * 0.5);

        let type = 'text';
        if (isNumeric) type = 'numeric';
        else if (isDate) type = 'date';
        else if (isCategorical) type = 'categorical';

        return {
            name: col,
            type,
            uniqueCount: uniqueValues.size,
            min: isNumeric ? Math.min(...values) : null,
            max: isNumeric ? Math.max(...values) : null,
        };
    });

    return columnStats;
};

export const suggestVibeAxes = (columnStats) => {
    // Heuristic to map columns to "Vibe" axes
    const numericCols = columnStats.filter(c => c.type === 'numeric');
    const categoricalCols = columnStats.filter(c => c.type === 'categorical' || c.type === 'text');
    const dateCols = columnStats.filter(c => c.type === 'date');

    return {
        mood: categoricalCols.find(c => c.name.toLowerCase().includes('mood') || c.name.toLowerCase().includes('category') || c.name.toLowerCase().includes('kategori') || c.name.toLowerCase().includes('tür')) || categoricalCols[0],
        intensity: numericCols.find(c => c.name.toLowerCase().includes('intensity') || c.name.toLowerCase().includes('score') || c.name.toLowerCase().includes('yoğunluk') || c.name.toLowerCase().includes('puan')) || numericCols[0],
        impact: numericCols.find(c => c.name.toLowerCase().includes('impact') || c.name.toLowerCase().includes('value') || c.name.toLowerCase().includes('etki') || c.name.toLowerCase().includes('değer')) || numericCols[1] || numericCols[0],
        relevance: numericCols.find(c => c.name.toLowerCase().includes('relevance') || c.name.toLowerCase().includes('percent') || c.name.toLowerCase().includes('alaka') || c.name.toLowerCase().includes('yüzde')) || numericCols[2] || numericCols[0],
        time: dateCols[0] || null
    };
};
