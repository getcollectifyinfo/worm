import React from 'react';
import type { CapacitySettings } from './types';
import { GameSettingsModal, SettingsSection, SettingsRange } from '../GameSettingsModal';

interface SettingsMenuProps {
    settings: CapacitySettings;
    onUpdateSettings: (settings: Partial<CapacitySettings>) => void;
    onClose: () => void;
    tier: 'GUEST' | 'FREE' | 'PRO';
    onOpenProModal: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ settings, onUpdateSettings, onClose, tier, onOpenProModal }) => {
  const isLocked = tier !== 'PRO';

  return (
    <GameSettingsModal
        isOpen={true}
        onClose={onClose}
        title="Capacity Settings"
    >
        <SettingsSection title="Game Configuration">
            <SettingsRange
                min={30}
                max={300}
                step={10}
                value={settings.gameDuration}
                onChange={(val) => onUpdateSettings({ gameDuration: val })}
                leftLabel="Short (30s)"
                rightLabel="Long (300s)"
                valueLabel={<>Duration: <span className="text-purple-600 font-bold">{settings.gameDuration}s</span></>}
                isLocked={isLocked}
                onLockedClick={onOpenProModal}
            />
            
            <SettingsRange
                min={5}
                max={20}
                step={1}
                value={Math.round(settings.planeSpeed * 10000)}
                onChange={(val) => onUpdateSettings({ planeSpeed: val / 10000 })}
                leftLabel="Low"
                rightLabel="High"
                valueLabel={<>Movement Sensitivity: <span className="text-purple-600 font-bold">{Math.round(settings.planeSpeed * 10000)}</span></>}
                isLocked={isLocked}
                onLockedClick={onOpenProModal}
            />

            <SettingsRange
                min={0.05}
                max={0.5}
                step={0.01}
                value={settings.scrollSpeed}
                onChange={(val) => onUpdateSettings({ scrollSpeed: val })}
                leftLabel="Slow"
                rightLabel="Fast"
                valueLabel={<>Scroll Speed: <span className="text-purple-600 font-bold">{settings.scrollSpeed}</span></>}
                isLocked={isLocked}
                onLockedClick={onOpenProModal}
            />

            <SettingsRange
                min={200}
                max={2000}
                step={100}
                value={settings.spawnRate}
                onChange={(val) => onUpdateSettings({ spawnRate: val })}
                leftLabel="Frequent (200ms)"
                rightLabel="Sparse (2000ms)"
                valueLabel={<>Spawn Rate: <span className="text-purple-600 font-bold">{settings.spawnRate}ms</span></>}
                isLocked={isLocked}
                onLockedClick={onOpenProModal}
            />

            <SettingsRange
                min={0.15}
                max={0.4}
                step={0.01}
                value={settings.gapWidth || 0.25}
                onChange={(val) => onUpdateSettings({ gapWidth: val })}
                leftLabel="Narrow"
                rightLabel="Wide"
                valueLabel={<>Path Width: <span className="text-purple-600 font-bold">{Math.round((settings.gapWidth || 0.25) * 100)}%</span></>}
                isLocked={isLocked}
                onLockedClick={onOpenProModal}
            />

            <SettingsRange
                min={1000}
                max={5000}
                step={500}
                value={settings.taskChangeSpeed}
                onChange={(val) => onUpdateSettings({ taskChangeSpeed: val })}
                leftLabel="Fast (1s)"
                rightLabel="Slow (5s)"
                valueLabel={<>Task Change: <span className="text-purple-600 font-bold">{settings.taskChangeSpeed}ms</span></>}
                isLocked={isLocked}
                onLockedClick={onOpenProModal}
            />
        </SettingsSection>
    </GameSettingsModal>
  );
};

export default SettingsMenu;
