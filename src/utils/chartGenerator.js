export const generateVegaSpec = (data, axes, chartType = 'bubble') => {
    const { mood, intensity, impact, relevance, time } = axes;

    const baseSpec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        width: 'container',
        height: 400,
        data: { values: data },
        background: 'transparent',
        config: {
            font: 'Inter',
            view: { stroke: 'transparent' },
            axis: {
                domain: false,
                grid: true,
                gridColor: '#334155', // Darker grid for dark mode
                gridDash: [4, 4],
                tickColor: 'transparent',
                labelColor: '#94a3b8', // Muted text
                labelFontSize: 11,
                titleColor: '#f1f5f9', // Light text
                titleFont: 'Inter',
                titleFontWeight: 500,
                titleFontSize: 12,
                titlePadding: 10
            },
            legend: {
                titleFont: 'Inter',
                titleColor: '#f1f5f9',
                labelColor: '#94a3b8',
                offset: 20,
                symbolType: 'circle'
            }
        }
    };

    if (chartType === 'bubble') {
        return {
            ...baseSpec,
            mark: { type: 'circle', opacity: 0.8, stroke: '#fff', strokeWidth: 1.5 },
            encoding: {
                x: {
                    field: impact?.name || 'x',
                    type: 'quantitative',
                    title: impact?.name || 'Etki (Impact)',
                    scale: { zero: false, padding: 20 }
                },
                y: {
                    field: intensity?.name || 'y',
                    type: 'quantitative',
                    title: intensity?.name || 'Yoğunluk (Intensity)',
                    scale: { zero: false, padding: 20 }
                },
                size: {
                    field: relevance?.name || 'size',
                    type: 'quantitative',
                    title: 'Alaka (Relevance)',
                    scale: { range: [100, 1000] },
                    legend: null
                },
                color: {
                    field: mood?.name || 'category',
                    type: 'nominal',
                    title: 'Kategori',
                    scale: { scheme: 'tableau10' }
                },
                tooltip: [
                    { field: mood?.name, title: 'Kategori' },
                    { field: impact?.name, title: 'Etki' },
                    { field: intensity?.name, title: 'Yoğunluk' }
                ]
            }
        };
    } else if (chartType === 'radar') {
        return {
            ...baseSpec,
            encoding: {
                theta: { field: mood?.name, type: 'nominal', stack: true },
                radius: { field: intensity?.name, type: 'quantitative', scale: { type: 'sqrt', zero: true, rangeMin: 20 } },
                color: { field: mood?.name, type: 'nominal', legend: null },
                order: { field: intensity?.name, sort: 'descending' }
            },
            layer: [
                { mark: { type: 'arc', innerRadius: 20, stroke: '#fff', opacity: 0.8 } },
                {
                    mark: { type: 'text', radiusOffset: 20, fontSize: 11 },
                    encoding: {
                        text: { field: mood?.name },
                        color: { value: '#f1f5f9' } // Light text for labels
                    }
                }
            ]
        };
    } else if (chartType === 'heatmap') {
        return {
            ...baseSpec,
            mark: { type: 'rect', cornerRadius: 2 },
            encoding: {
                x: { field: mood?.name, type: 'nominal', title: 'Kategori', axis: { labelAngle: 0 } },
                y: { field: time?.name || 'id', type: time ? 'temporal' : 'ordinal', title: 'Zaman' },
                color: {
                    field: intensity?.name,
                    type: 'quantitative',
                    title: 'Yoğunluk',
                    scale: { scheme: 'blues' }
                }
            }
        };
    } else if (chartType === 'scatter') {
        return {
            ...baseSpec,
            mark: { type: 'point', filled: true, opacity: 0.7 },
            encoding: {
                x: { field: impact?.name, type: 'quantitative', title: 'Etki' },
                y: { field: intensity?.name, type: 'quantitative', title: 'Yoğunluk' },
                color: { field: mood?.name, type: 'nominal', title: 'Kategori' },
                size: { value: 60 }
            }
        };
    } else if (chartType === 'bar') {
        return {
            ...baseSpec,
            mark: 'bar',
            encoding: {
                x: { field: mood?.name, type: 'nominal', title: 'Kategori', axis: { labelAngle: 0 } },
                y: { field: intensity?.name, type: 'quantitative', aggregate: 'mean', title: 'Ortalama Yoğunluk' },
                color: { field: mood?.name, type: 'nominal', legend: null }
            }
        };
    } else if (chartType === 'line') {
        return {
            ...baseSpec,
            mark: { type: 'line', point: true, interpolate: 'monotone' },
            encoding: {
                x: { field: time?.name || 'id', type: time ? 'temporal' : 'ordinal', title: 'Zaman' },
                y: { field: intensity?.name, type: 'quantitative', title: 'Yoğunluk' },
                color: { field: mood?.name, type: 'nominal', title: 'Kategori' }
            }
        };
    } else if (chartType === 'pie') {
        return {
            ...baseSpec,
            mark: { type: 'arc', outerRadius: 120 },
            encoding: {
                theta: { field: intensity?.name, type: 'quantitative', stack: true },
                color: { field: mood?.name, type: 'nominal', title: 'Kategori' },
                tooltip: [{ field: mood?.name }, { field: intensity?.name }]
            }
        };
    } else if (chartType === 'area') {
        return {
            ...baseSpec,
            mark: { type: 'area', opacity: 0.6 },
            encoding: {
                x: { field: time?.name || 'id', type: time ? 'temporal' : 'ordinal', title: 'Zaman' },
                y: { field: intensity?.name, type: 'quantitative', stack: true, title: 'Kümülatif Yoğunluk' },
                color: { field: mood?.name, type: 'nominal', title: 'Kategori' }
            }
        };
    } else if (chartType === 'histogram') {
        return {
            ...baseSpec,
            mark: 'bar',
            encoding: {
                x: { field: intensity?.name, type: 'quantitative', bin: true, title: 'Yoğunluk Aralığı' },
                y: { aggregate: 'count', title: 'Frekans' },
                color: { value: '#4f46e5' }
            }
        };
    } else if (chartType === 'donut') {
        return {
            ...baseSpec,
            mark: { type: 'arc', innerRadius: 80, outerRadius: 120 },
            encoding: {
                theta: { field: intensity?.name, type: 'quantitative', stack: true },
                color: { field: mood?.name, type: 'nominal', title: 'Kategori' },
                tooltip: [{ field: mood?.name }, { field: intensity?.name }]
            }
        };
    }

    return baseSpec;
};

export const generateInsights = (data, axes) => {
    const { mood, intensity, impact } = axes;
    const insights = [];

    if (intensity) {
        const maxVal = Math.max(...data.map(d => d[intensity.name]));
        const maxItem = data.find(d => d[intensity.name] === maxVal);
        insights.push(`**Zirve Yoğunluk**: Kaydedilen en yüksek yoğunluk değeri ${maxVal.toFixed(2)}` + (mood ? `, **${maxItem[mood.name]}** kategorisinde gözlemlendi.` : '.'));
    }

    if (impact && intensity) {
        insights.push(`**Etki Korelasyonu**: Veriler, **${impact.name}** ile **${intensity.name}** arasında potansiyel bir ilişki olduğunu gösteriyor, yüksek etkili kümelerin daha fazla incelenmesi önerilir.`);
    }

    if (mood) {
        const counts = {};
        data.forEach(d => {
            const val = d[mood.name];
            counts[val] = (counts[val] || 0) + 1;
        });
        const dominantMood = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        insights.push(`**Baskın Tema**: **${dominantMood}**, veri setinin %${(counts[dominantMood] / data.length * 100).toFixed(0)}'sini oluşturarak birincil kategori olarak öne çıkıyor.`);
    }

    return insights;
};
