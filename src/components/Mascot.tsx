import React from 'react';
import fishmascotmerkel from '../data/mascots/fishmascotmerkel.png';
import fishmascot from '../data/mascots/fishmascot.png';
import fishmascothaftbefehl from '../data/mascots/fishmascothaftbefehl.png';

type MascotType = 'mascotfish' | 'mascotmerkel' | 'mascothaftbefehl';

interface MascotProps {
    activeMascot: MascotType;
}

const Mascot: React.FC<MascotProps> = ({ activeMascot }) => {
    const getMascotImage = () => {
        switch (activeMascot) {
            case 'mascotmerkel':
                return fishmascotmerkel;
            case 'mascotfish':
                return fishmascot;
            case 'mascothaftbefehl':
                return fishmascothaftbefehl;
            default:
                return fishmascot;
        }
    };

    const containerStyle: React.CSSProperties = {
        width: '280px',
        height: '280px',
        position: 'relative',
        overflow: 'hidden'
    };

    const imageStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        position: 'relative',
        top: '-10px',
        left: '0',
        objectFit: 'contain',
        transition: 'opacity 0.3s ease-in-out'
    };

    return (
        <div style={containerStyle}>
            <img
                key={activeMascot}
                src={getMascotImage()}
                alt={activeMascot}
                style={imageStyle}
            />
        </div>
    );
};

export default Mascot;