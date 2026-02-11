import { useState } from 'react';
import MainDashboard from './components/MainDashboard';
import PresentErosionRate from './components/PresentErosionRate';
import DominantCause from './components/DominantCause';
import PredictedErosionRisk from './components/PredictedErosionRisk';
import ImageZoomModal from './components/ImageZoomModal';

export default function App() {
    const [currentView, setCurrentView] = useState('main');
    const [selectedRiver, setSelectedRiver] = useState({ id: 1, name: 'Ganga (Main Stem)', state: 'Bihar', district: 'Patna', active: true, location: 'Patna, Bihar', coverage: '~151 Kms' });
    const [zoomImage, setZoomImage] = useState(null);

    const handleNavigate = (view) => setCurrentView(view);
    const handleBack = () => setCurrentView('main');
    const handleSelectRiver = (river) => setSelectedRiver(river);
    const handleZoom = (src) => setZoomImage(src);
    const handleCloseZoom = () => setZoomImage(null);

    return (
        <>
            {/* Compact Sticky Header */}
            <header className="dashboard-header">
                <div className="dashboard-header-inner">
                    <div>
                        <h1 className="dashboard-title">🌊 Indian Riverbank Erosion Dashboard</h1>
                        <p className="dashboard-subtitle">LiDAR DEMs · Satellite Analysis · Risk Prediction</p>
                    </div>
                    {currentView !== 'main' && (
                        <button className="back-button" onClick={handleBack}>
                            ← Back to Dashboard
                        </button>
                    )}
                </div>
            </header>

            {/* Views — flex:1 fills remaining viewport */}
            <div className="dashboard-container">
                {currentView === 'main' && (
                    <MainDashboard
                        selectedRiver={selectedRiver}
                        onSelectRiver={handleSelectRiver}
                        onNavigate={handleNavigate}
                    />
                )}
                {currentView === 'erosion-rate' && (
                    <PresentErosionRate onBack={handleBack} onZoom={handleZoom} />
                )}
                {currentView === 'dominant-cause' && (
                    <DominantCause onBack={handleBack} onZoom={handleZoom} />
                )}
                {currentView === 'predicted-risk' && (
                    <PredictedErosionRisk onBack={handleBack} />
                )}
            </div>

            {/* Zoom Modal */}
            {zoomImage && (
                <ImageZoomModal src={zoomImage} onClose={handleCloseZoom} />
            )}
        </>
    );
}
