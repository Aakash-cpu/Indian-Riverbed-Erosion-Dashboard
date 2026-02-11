import { useState } from 'react';
import ImageZoomModal from './ImageZoomModal';

const SCENARIOS = [
    {
        title: 'SSP1- 2.6',
        color: '#00c853', // Green
        bg: 'rgba(0, 200, 83, 0.1)',
        border: 'rgba(0, 200, 83, 0.3)',
        details: [
            'Strong Mitigation adopted',
            'Low emissions',
            'Warming by ~2° C by 2100',
            'Positive or Low Impacts'
        ]
    },
    {
        title: 'SSP2- 4.5',
        color: '#d84315', // Brownish/Orange? Wireframe looks brown/bronze. Let's try a brown-orange.
        bg: 'rgba(216, 67, 21, 0.1)',
        border: 'rgba(216, 67, 21, 0.3)',
        details: [
            'Middle Pathway',
            'Moderate emissions',
            'Warming by ~2.8° C by 2100',
            'Business -as- usual Outcome'
        ]
    },
    {
        title: 'SSP5- 8.5',
        color: '#c62828', // Red
        bg: 'rgba(198, 40, 40, 0.1)',
        border: 'rgba(198, 40, 40, 0.3)',
        details: [
            'Poor Mitigation',
            'High emissions',
            'Warming by ~4.4° C by 2100',
            'Negative and Extreme Impacts'
        ]
    }
];

const YEARS = [2030, 2035, 2040, 2045, 2050];

export default function PredictedErosionRisk() {
    const [selectedYear, setSelectedYear] = useState('');
    const [zoomedImage, setZoomedImage] = useState(null);

    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value));
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflowY: 'auto', // Allow scrolling if content overflows
            overflowX: 'hidden',
            padding: '20px',
            gap: '24px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)'
        }}>
            {/* Zoom Modal */}
            {zoomedImage && (
                <ImageZoomModal
                    src={zoomedImage}
                    onClose={() => setZoomedImage(null)}
                />
            )}

            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <h2 style={{
                    background: 'linear-gradient(90deg, #0d47a1, #1565c0)', // Dark Blue bg as per wireframe text background
                    display: 'inline-block',
                    padding: '10px 30px',
                    borderRadius: '4px',
                    fontSize: '1.4rem',
                    color: '#fff',
                    marginBottom: '15px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}>
                    Predicted Erosion Risk for Different Climate Scenarios
                </h2>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <h3 style={{
                        background: '#0d47a1', // Darker blue
                        padding: '8px 40px',
                        borderRadius: '4px',
                        fontSize: '1.1rem',
                        color: '#fff',
                        fontWeight: 500
                    }}>
                        CMIP 6 Model Scenarios
                    </h3>
                </div>
            </div>

            {/* Year Selection */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                <div className="glass-card" style={{ padding: '15px 25px', display: 'flex', flexDirection: 'column', width: '300px' }}>
                    <label style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        color: '#fff',
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                    }}>Select the Year</label>
                    <select
                        value={selectedYear}
                        onChange={handleYearChange}
                        style={{
                            padding: '10px',
                            background: '#fff',
                            color: '#000',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                    >
                        <option value="" disabled>Select a year</option>
                        {YEARS.map(year => (
                            <option key={year} value={year} disabled={year !== 2050}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Scenarios Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                marginBottom: '20px'
            }}>
                {SCENARIOS.map((scenario) => (
                    <div key={scenario.title} style={{
                        border: `1px solid ${scenario.border}`, // Fallback border
                        borderRadius: '0', // Wireframe has rectangular headers
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 0 15px rgba(0,0,0,0.2)'
                    }}>
                        {/* Title Bar */}
                        <div style={{
                            background: '#0a192f', // Dark background for title
                            padding: '12px',
                            textAlign: 'center',
                            borderBottom: `2px solid ${scenario.color}`
                        }}>
                            <h4 style={{
                                color: '#fff',
                                fontStyle: 'italic',
                                fontWeight: 'bold',
                                fontSize: '1.2rem',
                                margin: 0
                            }}>{scenario.title}</h4>
                        </div>
                        {/* Content */}
                        <div style={{
                            background: scenario.color, // Full colored background as per wireframe
                            padding: '20px',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            gap: '8px'
                        }}>
                            {scenario.details.map((line, idx) => (
                                <p key={idx} style={{
                                    margin: 0,
                                    fontSize: '0.95rem',
                                    color: 'rgba(255,255,255,0.95)',
                                    fontWeight: 500,
                                    lineHeight: '1.4'
                                }}>{line}</p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Content - Only Visible for 2050 */}
            {selectedYear === 2050 && (
                <div className="animate-in" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    {/* Images Row */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px'
                    }}>
                        {/* Image 1 (PNG 8) */}
                        <div
                            onClick={() => setZoomedImage('images/PNG -8.jpg')}
                            style={{
                                cursor: 'pointer',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: '#fff', // White background placeholder like wireframe
                                height: '300px', // Fixed height for consistency
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            <img
                                src="images/PNG -8.jpg"
                                alt="Analysis 1"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain', // Keep aspect ratio
                                    background: 'black'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: 10,
                                left: 10,
                                background: 'rgba(0,0,0,0.6)',
                                padding: '2px 8px',
                                fontSize: '0.8rem',
                                color: '#fff'
                            }}>PNG 8</div>
                        </div>

                        {/* Image 2 (PNG 9) */}
                        <div
                            onClick={() => setZoomedImage('images/PNG -9.jpg')}
                            style={{
                                cursor: 'pointer',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: '#fff',
                                height: '300px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            <img
                                src="images/PNG -9.jpg"
                                alt="Analysis 2"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    background: 'black'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: 10,
                                left: 10,
                                background: 'rgba(0,0,0,0.6)',
                                padding: '2px 8px',
                                fontSize: '0.8rem',
                                color: '#fff'
                            }}>PNG 9</div>
                        </div>
                    </div>

                    {/* Instruction Text */}
                    <div style={{
                        background: '#fff',
                        color: '#000',
                        padding: '10px 20px',
                        display: 'inline-block',
                        fontSize: '1rem',
                        fontWeight: 500,
                        alignSelf: 'flex-start',
                        maxWidth: '400px'
                    }}>
                        Click on the images for high resolution analysis
                    </div>

                    {/* Videos Row (Using same video for both slots or just one as per availability)
                         User said: "current i have only one video use that video only no problem"
                         Wireframe has "Video 1" and "Video 2". I will put the video in one and maybe a placeholder in other?
                         Actually, the wireframe shows two video boxes at bottom. I will duplicate the video for now to match layout or make it just one.
                         Wireframe shows Video 1 (left) and Video 2 (right).
                         I will assume I should just show the one video I have. I'll center it or show it in the grid.
                         Let's stick to the wireframe layout and put the SAME video in both slots or just use one big slot?
                         The user said "play the video infinitely" (singular).
                         I'll put it in a grid but maybe just one centered if I only have one?
                         Wireframe clearly has 2 distinct boxes. I'll put the video in the first box and maybe a "No Data" or similar in 2nd, or just duplicate it so it looks complete.
                         Let's duplicate it for now as "Simulation 1" and "Simulation 2" to fill the space, or leave the second blank.
                         Better: I will use the one video in the left slot, and maybe an image placeholder or empty in the right slot to roughly match the wireframe "Video 2" box without breaking anything.
                     */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                        alignItems: 'end' // Align to bottom
                    }}>
                        {/* Video 1 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <div style={{
                                background: '#fff',
                                padding: '5px 10px',
                                color: '#000',
                                fontSize: '0.8rem',
                                width: 'fit-content'
                            }}>Video 1</div>
                            <video
                                src="videos/Vid2_velocity.mp4"
                                autoPlay
                                loop
                                muted
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}
                            />
                        </div>

                        {/* Video 2 Mockup - using same video or empty?
                            Let's just leave it empty with a label to match wireframe style, or maybe use PNG 7 or something?
                            Actually, let's just duplicate the video to make it look "full" if that's what the user wants for "design it well",
                            or just Center the one video?
                            Wireframe has 2 boxes. I'll put the video in the first one.
                            I'll leave the second one as a placeholder.
                        */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <div style={{
                                background: '#fff',
                                padding: '5px 10px',
                                color: '#000',
                                fontSize: '0.8rem',
                                width: 'fit-content'
                            }}>Video 2</div>
                            <div style={{
                                width: '100%',
                                height: '200px', // Approximate height
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(0,0,0,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#aaa'
                            }}>
                                [No Video 2 Available]
                            </div>
                        </div>

                    </div>

                    {/* Footer Label */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{
                            background: '#fff',
                            color: '#000',
                            padding: '8px 20px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                        }}>
                            HEC- RAS 2D Unsteady Flow Simulation
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

