import React, { useEffect, useRef } from 'react';
import embed from 'vega-embed';

const VibeChart = ({ spec }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current && spec) {
            embed(containerRef.current, spec, { actions: true, renderer: 'svg' })
                .then((result) => {
                    // Chart rendered
                })
                .catch((error) => console.error(error));
        }
    }, [spec]);

    return <div ref={containerRef} className="chart-container" />;
};

export default VibeChart;
