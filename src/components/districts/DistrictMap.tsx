import React, { useState, useRef, useEffect } from 'react';
import {
  Compass, MapPin, ChevronDown, ChevronUp,
  Building, Users, BookOpen, Scroll, Flame, Sparkles,
  ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, Map, List,
  Plus, Edit3, Trash2, Download, Upload, X, ArrowRight,
  Layers, Crosshair, Globe, Sprout
} from 'lucide-react';
import { District } from '../../types/game';
import districtsData from '../../data/districts.json';

export interface CustomPin {
  id: string;
  name: string;
  tooltip: string;
  referenceMaterial: string;
  districtId: string;
  domain?: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  color?: 'gold' | 'crimson' | 'emerald' | 'azure';
  createdAt: number;
}

interface StratumConfig {
  id: string;
  name: string;
  height: string;
  tier: string;
  tag: string;
  // Center coordinates on the map for auto-centering & zoom
  centerX: number;
  centerY: number;
  zoom: number;
}

// 11 Official Districts ordered by altitude from Spire Peak to the Under-Spire Abyss
const SPIRE_STRATA: StratumConfig[] = [
  { id: 'new-heaven', name: 'Новые Небеса', height: '900-1000м', tier: 'Верхний Шпиль', tag: 'Солнце и знать', centerX: 58, centerY: 9, zoom: 2.2 },
  { id: 'amaranth', name: 'Амарант', height: '800-900м', tier: 'Верхний Шпиль', tag: 'Лед и маски', centerX: 68, centerY: 25, zoom: 2.1 },
  { id: 'silver-quarter', name: 'Серебряный Квартал', height: '600-800м', tier: 'Средний Шпиль', tag: 'Банки и стража', centerX: 46, centerY: 36, zoom: 2.0 },
  { id: 'perch', name: 'Насест (3 Сектора)', height: '500-600м', tier: 'Внешние уступы', tag: 'Верхний, Средний, Нижний', centerX: 59.5, centerY: 51.5, zoom: 1.65 },
  { id: 'the-works', name: 'Заводы', height: '350-500м', tier: 'Средний Шпиль', tag: 'Чугун и пар', centerX: 66, centerY: 70, zoom: 2.0 },
  { id: 'north-docks', name: 'Северные Доки', height: '250-350м', tier: 'Средний Шпиль', tag: 'Небесные корабли', centerX: 58, centerY: 82, zoom: 2.1 },
  { id: 'the-garden-district', name: 'Садовый Квартал', height: '200-350м', tier: 'Средний Шпиль', tag: 'Агро-своды и грибы', centerX: 52, centerY: 74, zoom: 2.1 },
  { id: 'red-row', name: 'Красный Квартал', height: '100-250м', tier: 'Нижний Шпиль', tag: 'Кровь и криминал', centerX: 46, centerY: 92, zoom: 2.3 },
  { id: 'derelictus', name: 'Дереликтус', height: '0-100м', tier: 'Нижний Шпиль', tag: 'Трущобы дроу', centerX: 28, centerY: 92, zoom: 2.3 },
  { id: 'vermissian', name: 'Вермисиан', height: '-100м', tier: 'Подшпилье', tag: 'Проклятое метро', centerX: 10, centerY: 83, zoom: 2.5 },
  { id: 'the-heart', name: 'Сердце', height: '-300м', tier: 'Бездна', tag: 'Оккультный разлом', centerX: 10, centerY: 93, zoom: 2.5 }
];

const DOMAINS_LIST = [
  'Академия', 'Криминал', 'Коммерция', 'Высший свет',
  'Низы', 'Оккультизм', 'Порядок', 'Религия', 'Технологии'
];

interface DistrictMapProps {
  isCompactScreen?: boolean;
  initialDistrictId?: string;
  onNavigateToLore?: (districtId: string) => void;
}

export const DistrictMap: React.FC<DistrictMapProps> = ({
  isCompactScreen = false,
  initialDistrictId,
  onNavigateToLore
}) => {
  const districts: District[] = districtsData as District[];
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(initialDistrictId || 'amaranth');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [expandedLandmark, setExpandedLandmark] = useState<string | null>(null);

  // Zoom & Pan
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Custom User Pins
  const [pins, setPins] = useState<CustomPin[]>(() => {
    try {
      const saved = localStorage.getItem('spire_custom_pins');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return [];
  });

  // Pin Creation & Editing State
  const [isPinModeActive, setIsPinModeActive] = useState<boolean>(false);
  const [editingPin, setEditingPin] = useState<Partial<CustomPin> | null>(null);
  const [activeViewingPin, setActiveViewingPin] = useState<CustomPin | null>(null);
  const [hoveredPin, setHoveredPin] = useState<CustomPin | null>(null);
  const [showPinManager, setShowPinManager] = useState<boolean>(false);
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [showImportDialog, setShowImportDialog] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapImageRef = useRef<HTMLImageElement>(null);

  const activeDistrict = districts.find(d => d.id === selectedDistrictId) || districts[0];
  const isPerchActive = activeDistrict.id === 'perch';
  const [activePerchSector, setActivePerchSector] = useState<'all' | 'middle' | 'upper' | 'lower'>('all');

  // Save pins to local storage
  useEffect(() => {
    try {
      localStorage.setItem('spire_custom_pins', JSON.stringify(pins));
    } catch (e) {
      console.warn('Failed to save pins', e);
    }
  }, [pins]);

  // ISOLATE MOUSE WHEEL ZOOM FROM PAGE SCROLLING
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const handleNativeWheel = (e: WheelEvent) => {
      // Prevent browser from scrolling the outer window
      e.preventDefault();
      e.stopPropagation();

      const zoomFactor = e.deltaY < 0 ? 0.18 : -0.18;
      setZoom(prev => Math.min(Math.max(prev + zoomFactor, 0.85), 4.5));
    };

    container.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleNativeWheel);
    };
  }, []);

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.35, 4.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.35, 0.85));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Drag & Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPinModeActive) return; // In pin placing mode, do not pan on click
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Auto-center and zoom into a selected district stratum
  const handleSelectStratum = (stratum: StratumConfig) => {
    setSelectedDistrictId(stratum.id);
    setExpandedLandmark(null);
    if (stratum.id === 'perch') {
      setActivePerchSector('all');
    }

    const targetZoom = stratum.zoom;
    const baseW = 850;
    const baseH = 1100;

    const dx = (50 - stratum.centerX) / 100 * baseW * targetZoom;
    const dy = (50 - stratum.centerY) / 100 * baseH * targetZoom;

    setZoom(targetZoom);
    setPan({ x: dx, y: dy });
  };

  useEffect(() => {
    if (initialDistrictId) {
      const cfg = SPIRE_STRATA.find(s => s.id === initialDistrictId);
      if (cfg) {
        handleSelectStratum(cfg);
      }
    }
  }, [initialDistrictId]);

  // Focus on specific Perch sector (Middle, Upper, Lower)
  const handleSelectPerchSector = (sector: 'all' | 'middle' | 'upper' | 'lower') => {
    setActivePerchSector(sector);
    const baseW = 850;
    const baseH = 1100;
    let targetX = 59.5;
    let targetY = 51.5;
    let targetZoom = 1.65;

    if (sector === 'middle') {
      targetX = 40.0;
      targetY = 46.3;
      targetZoom = 2.45;
    } else if (sector === 'upper') {
      targetX = 58.3;
      targetY = 47.6;
      targetZoom = 2.45;
    } else if (sector === 'lower') {
      targetX = 80.6;
      targetY = 60.2;
      targetZoom = 2.45;
    }

    const dx = (50 - targetX) / 100 * baseW * targetZoom;
    const dy = (50 - targetY) / 100 * baseH * targetZoom;
    setZoom(targetZoom);
    setPan({ x: dx, y: dy });
  };

  useEffect(() => {
    if (initialDistrictId) {
      const cfg = SPIRE_STRATA.find(s => s.id === initialDistrictId);
      if (cfg) {
        handleSelectStratum(cfg);
      }
    }
  }, [initialDistrictId]);

  // Handle click on map canvas for placing new pins
  const handleMapCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPinModeActive) return;

    if (!mapImageRef.current) return;
    const rect = mapImageRef.current.getBoundingClientRect();

    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    if (clickX < 0 || clickX > 100 || clickY < 0 || clickY > 100) return;

    const closestStratum = SPIRE_STRATA.reduce((prev, curr) => {
      return (Math.abs(curr.centerY - clickY) < Math.abs(prev.centerY - clickY) ? curr : prev);
    });

    setEditingPin({
      id: Date.now().toString(),
      name: '',
      tooltip: '',
      referenceMaterial: '',
      districtId: closestStratum.id,
      domain: 'Криминал',
      x: parseFloat(clickX.toFixed(1)),
      y: parseFloat(clickY.toFixed(1)),
      color: 'gold',
      createdAt: Date.now()
    });

    setIsPinModeActive(false);
  };

  // Save new or edited pin
  const handleSavePin = () => {
    if (!editingPin || !editingPin.name?.trim()) return;

    const fullPin: CustomPin = {
      id: editingPin.id || Date.now().toString(),
      name: editingPin.name.trim(),
      tooltip: editingPin.tooltip?.trim() || editingPin.name.trim(),
      referenceMaterial: editingPin.referenceMaterial?.trim() || '',
      districtId: editingPin.districtId || activeDistrict.id,
      domain: editingPin.domain || 'Криминал',
      x: editingPin.x ?? 50,
      y: editingPin.y ?? 50,
      color: editingPin.color || 'gold',
      createdAt: editingPin.createdAt || Date.now()
    };

    setPins(prev => {
      const idx = prev.findIndex(p => p.id === fullPin.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = fullPin;
        return copy;
      }
      return [...prev, fullPin];
    });

    setEditingPin(null);
  };

  // Delete pin
  const handleDeletePin = (pinId: string) => {
    setPins(prev => prev.filter(p => p.id !== pinId));
    if (activeViewingPin?.id === pinId) {
      setActiveViewingPin(null);
    }
    if (editingPin?.id === pinId) {
      setEditingPin(null);
    }
  };

  // Export pins to JSON
  const handleExportPins = () => {
    const jsonStr = JSON.stringify(pins, null, 2);
    navigator.clipboard.writeText(jsonStr);
    alert('JSON с вашими метками скопирован в буфер обмена!');
  };

  // Import pins from JSON
  const handleImportPins = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (Array.isArray(parsed)) {
        setPins(parsed);
        setShowImportDialog(false);
        setImportJsonText('');
        alert(`Успешно импортировано ${parsed.length} меток!`);
      } else {
        alert('Ошибка: формат должен быть массивом JSON.');
      }
    } catch (e: any) {
      alert(`Ошибка чтения JSON: ${e.message}`);
    }
  };

  return (
    <div className={`space-y-3 text-[#e0dacf] flex flex-col ${isCompactScreen ? 'h-full overflow-hidden' : ''}`}>
      
      {/* Compact Top Header Bar */}
      <div className="bg-gradient-to-r from-[#1c1209] via-[#10131d] to-[#090b10] border border-[#523e14] rounded-xl px-4 py-2.5 shadow-xl flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#780016] to-[#36000a] border border-[#c59b27] flex items-center justify-center text-[#e5b83b] shadow-md">
            <Compass size={18} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-heading font-black text-[#e5b83b] leading-tight">
              Интерактивная Карта Шпиля
            </h2>
            <span className="text-[10px] text-[#959085] uppercase tracking-widest font-heading block">
              11 ярусов • Автофокус и зум • Пользовательские метки
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPinModeActive(!isPinModeActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all border ${
              isPinModeActive
                ? 'bg-[#c59b27] text-black border-[#f0cb78] shadow-lg animate-pulse'
                : 'bg-[#151824] hover:bg-[#780016] text-[#f0cb78] hover:text-white border-[#45371c]'
            }`}
            title="Поставить новую метку на карту"
          >
            <Plus size={14} />
            <span>{isPinModeActive ? 'Кликните на карту...' : 'Поставить метку'}</span>
          </button>

          <button
            onClick={() => setShowPinManager(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#12141e] hover:bg-[#1a1e2d] text-[#a8a192] hover:text-white border border-[#2b3042] text-xs font-heading font-semibold transition-colors"
          >
            <MapPin size={13} className="text-[#c59b27]" />
            <span>Метки ({pins.length})</span>
          </button>

          <div className="flex bg-[#0b0c12] p-0.5 rounded-lg border border-[#2e3346]">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-heading font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-[#780016] text-white border border-[#c59b27]/40 shadow-md'
                  : 'text-[#959085] hover:text-[#e0dacf]'
              }`}
            >
              <Map size={13} />
              <span>Карта</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-heading font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-[#780016] text-white border border-[#c59b27]/40 shadow-md'
                  : 'text-[#959085] hover:text-[#e0dacf]'
              }`}
            >
              <List size={13} />
              <span>Список</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pin Mode Banner Notification */}
      {isPinModeActive && (
        <div className="bg-gradient-to-r from-[#3b2409] to-[#1a1208] border-2 border-[#c59b27] rounded-lg p-2.5 px-4 flex items-center justify-between shadow-xl flex-shrink-0 animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <Crosshair size={18} className="text-[#f0cb78] animate-spin" />
            <div>
              <span className="font-heading font-bold text-xs sm:text-sm text-[#f0cb78] block">
                Режим добавления метки активен
              </span>
              <span className="text-[11px] text-[#dcd4c7]">
                Кликните в любую точку на карте, чтобы привязать локацию со справочным материалом.
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsPinModeActive(false)}
            className="px-2.5 py-1 rounded-md bg-black/60 hover:bg-[#780016] text-xs text-[#e0dacf] border border-[#4a3b19] transition-colors"
          >
            Отмена
          </button>
        </div>
      )}

      {/* VIEW: INTERACTIVE MAP (Fits 100% on Single Viewport Screen) */}
      {viewMode === 'map' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch flex-1 min-h-0 overflow-hidden">
          
          {/* 1. Left Vertical Stratum Needle (3 cols on xl) */}
          <div className="xl:col-span-3 bg-[#090b10] border border-[#3e321e] rounded-xl p-2.5 shadow-xl flex flex-col min-h-0 h-full overflow-hidden">
            <div className="flex items-center justify-between px-2 py-1 text-xs font-heading font-bold text-[#f0cb78] uppercase tracking-wider border-b border-[#252838] pb-1.5 flex-shrink-0">
              <span className="flex items-center gap-1.5">
                <Layers size={13} className="text-[#c59b27]" />
                Срез Шпиля (11 ярусов)
              </span>
              <span className="text-[10px] text-[#736c60] font-mono">Высота</span>
            </div>

            <div className="space-y-1 overflow-y-auto flex-1 pr-1 pt-1.5">
              {SPIRE_STRATA.map((stratum, idx) => {
                const isSelected = activeDistrict.id === stratum.id;
                const isPerch = stratum.id === 'perch';
                const isGarden = stratum.id === 'the-garden-district';

                return (
                  <button
                    key={stratum.id}
                    onClick={() => handleSelectStratum(stratum)}
                    className={`w-full text-left p-2 rounded-lg border transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#780016] to-[#36000a] text-white border-[#f0cb78] shadow-md ring-1 ring-[#c59b27]/50'
                        : 'bg-[#0f1118] text-[#c5bea8] border-[#222533] hover:border-[#c59b27]/60 hover:bg-[#151824]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono w-4 text-center ${isSelected ? 'text-[#f0cb78] font-bold' : 'text-[#6e685c]'}`}>
                        {idx + 1}
                      </span>
                      <div>
                        <span className={`font-heading text-xs font-bold flex items-center gap-1 ${isSelected ? 'text-[#f0cb78]' : 'group-hover:text-[#f0cb78]'}`}>
                          {stratum.name}
                          {isPerch && <span title="Огибает внешнюю границу"><Globe size={11} className="text-[#60a5fa]" /></span>}
                          {isGarden && <span title="Агро-своды"><Sprout size={11} className="text-[#4ade80]" /></span>}
                        </span>
                        <span className="text-[10px] text-[#857e72] block">
                          {stratum.tier}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-[#8a8274] block">
                        {stratum.height}
                      </span>
                      <span className="text-[9px] text-[#c59b27] font-serif italic">
                        {stratum.tag}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Middle: Large Dedicated Map Canvas (5 cols on xl) */}
          <div className="xl:col-span-5 h-full flex flex-col min-h-0 overflow-hidden">
            <div className={`relative bg-[#07080c] border-2 border-[#4a3b19] rounded-xl overflow-hidden shadow-2xl flex-1 flex flex-col min-h-0 ${
              isFullscreen ? 'fixed inset-4 z-50 flex flex-col' : ''
            }`}>
              {/* Floating Toolbar */}
              <div className="absolute top-2.5 left-2.5 z-30 flex items-center gap-1 bg-black/85 backdrop-blur-md p-1 rounded-lg border border-[#3e3422] shadow-xl">
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 rounded-md bg-[#141724] hover:bg-[#780016] text-[#f0cb78] hover:text-white transition-colors"
                  title="Приблизить (+)"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 rounded-md bg-[#141724] hover:bg-[#780016] text-[#f0cb78] hover:text-white transition-colors"
                  title="Отдалить (-)"
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="p-1.5 rounded-md bg-[#141724] hover:bg-[#262c3e] text-[#b8b0a1] hover:text-white transition-colors"
                  title="Сбросить масштаб"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-md bg-[#141724] hover:bg-[#780016] text-[#b8b0a1] hover:text-white transition-colors"
                  title={isFullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим"}
                >
                  {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
              </div>

              {/* District Active Floating Banner & Perch Sector Switcher */}
              <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-2">
                {isPerchActive && (
                  <div className="flex items-center gap-1 bg-black/90 backdrop-blur-md px-2 py-1 rounded-lg border border-[#38bdf8]/60 shadow-xl pointer-events-auto">
                    <span className="text-[10px] text-[#38bdf8] font-heading font-bold mr-1 flex items-center gap-1">
                      <Globe size={11} /> Сектора:
                    </span>
                    <button
                      onClick={() => handleSelectPerchSector('all')}
                      className={`px-2 py-0.5 rounded text-[10px] font-heading transition-colors ${
                        activePerchSector === 'all'
                          ? 'bg-[#0284c7] text-white font-bold shadow'
                          : 'text-[#94a3b8] hover:text-white hover:bg-white/10'
                      }`}
                    >
                      Все 3
                    </button>
                    <button
                      onClick={() => handleSelectPerchSector('middle')}
                      className={`px-2 py-0.5 rounded text-[10px] font-heading transition-colors ${
                        activePerchSector === 'middle'
                          ? 'bg-[#0284c7] text-white font-bold shadow'
                          : 'text-[#94a3b8] hover:text-white hover:bg-white/10'
                      }`}
                    >
                      Средний
                    </button>
                    <button
                      onClick={() => handleSelectPerchSector('upper')}
                      className={`px-2 py-0.5 rounded text-[10px] font-heading transition-colors ${
                        activePerchSector === 'upper'
                          ? 'bg-[#0284c7] text-white font-bold shadow'
                          : 'text-[#94a3b8] hover:text-white hover:bg-white/10'
                      }`}
                    >
                      Верхний
                    </button>
                    <button
                      onClick={() => handleSelectPerchSector('lower')}
                      className={`px-2 py-0.5 rounded text-[10px] font-heading transition-colors ${
                        activePerchSector === 'lower'
                          ? 'bg-[#0284c7] text-white font-bold shadow'
                          : 'text-[#94a3b8] hover:text-white hover:bg-white/10'
                      }`}
                    >
                      Нижний
                    </button>
                  </div>
                )}

                <div className="bg-black/85 backdrop-blur-md px-3 py-1 rounded-lg border border-[#c59b27] shadow-xl pointer-events-none">
                  <span className="text-[9px] uppercase tracking-wider font-heading text-[#959085] block">
                    Выбранный ярус:
                  </span>
                  <span className="font-heading font-black text-xs text-[#f0cb78]">
                    {activeDistrict.nameRu}
                  </span>
                </div>
              </div>

              {/* Map Canvas with Isolated Wheel Zoom */}
              <div
                ref={mapContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={handleMapCanvasClick}
                className={`w-full flex-1 overflow-hidden relative flex items-center justify-center select-none ${
                  isPinModeActive ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
                }`}
              >
                <div
                  style={{
                    transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                    transformOrigin: 'center center',
                    willChange: isDragging ? 'transform' : 'auto',
                    transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  className="relative w-[750px] sm:w-[850px] aspect-[1700/2200] max-w-none flex-shrink-0"
                >
                  {/* Clean Authentic Map Illustration */}
                  <img
                    ref={mapImageRef}
                    src="./assets/images/spire-map-full.jpg"
                    alt="Официальная карта Шпиля"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-contain pointer-events-none"
                    draggable={false}
                  />

                  {/* SPECIAL OVERLAY FOR PERCH: EXACT 3 Canonical Sectors with Circles */}
                  {isPerchActive && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* High-Precision SVG Ellipses matching 1700x2200 map pixels exactly */}
                      <svg viewBox="0 0 1700 2200" className="absolute inset-0 w-full h-full">
                        {/* 1. Middle Perch (Dovecote, Ant Park, Clock Tower, Drop Street) */}
                        <ellipse
                          cx="680"
                          cy="1019"
                          rx="115"
                          ry="135"
                          fill={activePerchSector === 'middle' ? 'rgba(56, 189, 248, 0.22)' : 'rgba(56, 189, 248, 0.10)'}
                          stroke={activePerchSector === 'middle' ? '#f0cb78' : '#38bdf8'}
                          strokeWidth={activePerchSector === 'middle' ? '7' : '4.5'}
                          strokeDasharray="14 10"
                          className="transition-all duration-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]"
                        />

                        {/* 2. Upper Perch (Cathedral of our Glorious Lady, Sevenhooks, Little Whitecross) */}
                        <ellipse
                          cx="990"
                          cy="1047"
                          rx="135"
                          ry="105"
                          fill={activePerchSector === 'upper' ? 'rgba(56, 189, 248, 0.22)' : 'rgba(56, 189, 248, 0.10)'}
                          stroke={activePerchSector === 'upper' ? '#f0cb78' : '#38bdf8'}
                          strokeWidth={activePerchSector === 'upper' ? '7' : '4.5'}
                          strokeDasharray="14 10"
                          className="transition-all duration-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]"
                        />

                        {/* 3. Lower Perch (Ropers, Knotters, The Gutter, The Hang-Under) */}
                        <ellipse
                          cx="1370"
                          cy="1325"
                          rx="130"
                          ry="95"
                          fill={activePerchSector === 'lower' ? 'rgba(56, 189, 248, 0.22)' : 'rgba(56, 189, 248, 0.10)'}
                          stroke={activePerchSector === 'lower' ? '#f0cb78' : '#38bdf8'}
                          strokeWidth={activePerchSector === 'lower' ? '7' : '4.5'}
                          strokeDasharray="14 10"
                          className="transition-all duration-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]"
                        />
                      </svg>

                      {/* Interactive Badges positioned directly at the circles */}
                      {/* Middle Perch Badge */}
                      <div
                        style={{ left: '40.0%', top: '53.5%' }}
                        className="absolute -translate-x-1/2 pointer-events-auto"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPerchSector('middle');
                          }}
                          className={`group px-2.5 py-1 rounded-full text-[10px] font-heading font-black tracking-wide border shadow-2xl flex items-center gap-1.5 transition-all ${
                            activePerchSector === 'middle'
                              ? 'bg-[#0284c7] text-white border-[#f0cb78] scale-110 ring-2 ring-[#38bdf8]'
                              : 'bg-black/90 text-[#38bdf8] border-[#0284c7] hover:scale-105 hover:bg-[#0369a1] hover:text-white'
                          }`}
                          title="Висячие платформы на цепях: Dovecote, Ant Park, Clock Tower"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-ping" />
                          Средний Насест (Middle Perch)
                        </button>
                      </div>

                      {/* Upper Perch Badge */}
                      <div
                        style={{ left: '58.3%', top: '41.5%' }}
                        className="absolute -translate-x-1/2 -translate-y-full pointer-events-auto"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPerchSector('upper');
                          }}
                          className={`group px-2.5 py-1 rounded-full text-[10px] font-heading font-black tracking-wide border shadow-2xl flex items-center gap-1.5 transition-all ${
                            activePerchSector === 'upper'
                              ? 'bg-[#0284c7] text-white border-[#f0cb78] scale-110 ring-2 ring-[#38bdf8]'
                              : 'bg-black/90 text-[#38bdf8] border-[#0284c7] hover:scale-105 hover:bg-[#0369a1] hover:text-white'
                          }`}
                          title="Скальный карниз: Cathedral of our Glorious Lady, Sevenhooks, Little Whitecross"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-ping" />
                          Верхний Насест (Upper Perch)
                        </button>
                      </div>

                      {/* Lower Perch Badge */}
                      <div
                        style={{ left: '80.6%', top: '54.5%' }}
                        className="absolute -translate-x-1/2 -translate-y-full pointer-events-auto"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPerchSector('lower');
                          }}
                          className={`group px-2.5 py-1 rounded-full text-[10px] font-heading font-black tracking-wide border shadow-2xl flex items-center gap-1.5 transition-all ${
                            activePerchSector === 'lower'
                              ? 'bg-[#0284c7] text-white border-[#f0cb78] scale-110 ring-2 ring-[#38bdf8]'
                              : 'bg-black/90 text-[#38bdf8] border-[#0284c7] hover:scale-105 hover:bg-[#0369a1] hover:text-white'
                          }`}
                          title="Веревочные кварталы: Ropers, Knotters, The Gutter, The Hang-Under"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-ping" />
                          Нижний Насест (Lower Perch)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* User-Created Custom Hotspot Pins Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {pins.map((pin) => {
                      const isHovered = hoveredPin?.id === pin.id;
                      const isFromActiveDistrict = pin.districtId === activeDistrict.id;

                      const colorClasses = {
                        gold: 'bg-gradient-to-br from-[#c59b27] to-[#784f00] border-[#f0cb78] text-black',
                        crimson: 'bg-gradient-to-br from-[#96001c] to-[#42000c] border-[#f87171] text-white',
                        emerald: 'bg-gradient-to-br from-[#0f766e] to-[#042f2e] border-[#34d399] text-white',
                        azure: 'bg-gradient-to-br from-[#1d4ed8] to-[#172554] border-[#60a5fa] text-white'
                      }[pin.color || 'gold'];

                      return (
                        <div
                          key={pin.id}
                          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveViewingPin(pin);
                            }}
                            onMouseEnter={() => setHoveredPin(pin)}
                            onMouseLeave={() => setHoveredPin(null)}
                            className={`group relative flex items-center justify-center transition-transform duration-200 ${
                              isHovered ? 'scale-125 z-40' : isFromActiveDistrict ? 'scale-110 z-30' : 'scale-100 z-20'
                            }`}
                          >
                            <span className="absolute w-7 h-7 rounded-full border border-[#f0cb78] bg-[#c59b27]/20 animate-ping opacity-60 pointer-events-none" />
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border shadow-xl ${colorClasses}`}>
                              <MapPin size={11} />
                            </div>
                          </button>

                          {/* Sleek Tooltip with Short Description & Click Action */}
                          {isHovered && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveViewingPin(pin);
                              }}
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-black/95 backdrop-blur-md border border-[#c59b27] rounded-xl shadow-2xl z-50 text-left pointer-events-auto cursor-pointer animate-in fade-in zoom-in-95 duration-150"
                            >
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#780016] text-white font-heading font-bold">
                                  {pin.domain || 'Локация'}
                                </span>
                                <span className="text-[9px] text-[#959085]">
                                  {districts.find(d => d.id === pin.districtId)?.nameRu || ''}
                                </span>
                              </div>
                              <h4 className="font-heading font-bold text-xs text-[#f0cb78] leading-tight">
                                {pin.name}
                              </h4>
                              {pin.tooltip && (
                                <p className="text-[10px] text-[#ccc5b8] mt-1 line-clamp-3 leading-relaxed">
                                  {pin.tooltip}
                                </p>
                              )}
                              <div className="mt-2 pt-1.5 border-t border-[#3e321e] flex items-center justify-between text-[10px] text-[#e5b83b] font-heading font-semibold">
                                <span>Открыть справку</span>
                                <ArrowRight size={11} />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Tip Bar */}
              <div className="bg-black/85 backdrop-blur-md px-3 py-1.5 border-t border-[#2b3040] flex items-center justify-between text-[11px] text-[#878072] flex-shrink-0">
                <span>Колесико: зум • Перетаскивание: панорама</span>
                <span className="text-[#c59b27] font-heading font-semibold">
                  {pins.length === 0 ? 'Нажмите «Поставить метку», чтобы добавить объект' : `Метки на карте: ${pins.length}`}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Right: District Lore Dossier (4 cols on xl) */}
          <div className="xl:col-span-4 bg-[#0e1017] border border-[#453416] rounded-xl p-4 sm:p-5 shadow-2xl space-y-4 flex flex-col min-h-0 h-full overflow-hidden">
            
            {/* Dossier Header */}
            <div className="flex-shrink-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-heading font-semibold px-2 py-0.5 rounded bg-[#261f12] text-[#c59b27] border border-[#4a3b14]">
                  {activeDistrict.level}
                </span>
                <span className="text-xs text-[#878072] font-mono uppercase tracking-widest">
                  {activeDistrict.nameEn}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-heading font-black text-[#f0cb78]">
                {activeDistrict.nameRu}
              </h3>

              <div className="flex flex-wrap items-center gap-1 mt-1.5">
                <span className="text-[#878072] text-[11px] mr-1">Сферы:</span>
                {activeDistrict.domains.map((dom, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.2 rounded bg-[#1b2333] text-[#9fcbf5] border border-[#2b3a54] text-[10px] font-medium"
                  >
                    {dom}
                  </span>
                ))}
              </div>

              {/* Perch Special Encircling Callout */}
              {isPerchActive && (
                <div className="mt-2 p-2 rounded-lg bg-[#0e1726] border border-[#2563eb]/50 text-xs text-[#93c5fd] flex items-start gap-2">
                  <Globe size={15} className="text-[#60a5fa] flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    <strong>Опоясывающий район:</strong> Насест не имеет единой точки — он огибает внешнюю границу Шпиля по всему периметру башни на высоте полумили над землей.
                  </span>
                </div>
              )}

              {onNavigateToLore && (
                <button
                  onClick={() => onNavigateToLore(activeDistrict.id)}
                  className="mt-2.5 w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-[#780016] hover:bg-[#99001c] text-white text-xs font-heading font-semibold transition-colors shadow border border-[#c59b27]/30"
                >
                  <BookOpen size={14} className="text-[#f0ca5b]" />
                  <span>Читать в Хрониках Шпиля</span>
                </button>
              )}
            </div>

            {/* Scrollable Dossier Content */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              {/* District Crop Art */}
              <div className="w-full rounded-lg border border-[#5e4713] bg-[#07080c] overflow-hidden shadow-lg flex-shrink-0">
                <div className="relative h-36 w-full bg-[#050608]">
                  <img
                    src={`./assets/images/districts/${activeDistrict.id}.jpg`}
                    alt={`Карта ${activeDistrict.nameRu}`}
                    className="w-full h-full object-cover object-center filter contrast-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = './assets/images/spire-map-full.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1017] via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Official Quote */}
              {activeDistrict.bookQuote && (
                <div className="bg-[#1c1115] border-l-4 border-[#8f1d2e] p-3 rounded-r-lg shadow-inner space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-heading font-bold uppercase tracking-wider text-[#e64c65]">
                    <BookOpen size={12} /> Книга правил Spire
                  </div>
                  <p className="text-xs text-[#f2ede4] font-flavor italic leading-relaxed">
                    «{activeDistrict.bookQuote}»
                  </p>
                </div>
              )}

              {/* Long Description */}
              <div className="space-y-1.5 bg-[#0a0c12] p-3.5 rounded-lg border border-[#232738]">
                <h4 className="text-[11px] font-heading font-bold text-[#c59b27] uppercase tracking-wider flex items-center gap-1.5">
                  <Scroll size={13} /> Описание и сущность
                </h4>
                <p className="text-xs text-[#dcd7cb] leading-relaxed">
                  {activeDistrict.longDescription || activeDistrict.description}
                </p>
              </div>

              {/* Atmosphere */}
              {activeDistrict.atmosphere && (
                <div className="bg-[#10131e] p-3 rounded-lg border border-[#20293b] space-y-1">
                  <h4 className="text-[10px] font-heading font-bold text-[#60a5fa] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={12} /> Атмосфера и ритм
                  </h4>
                  <p className="text-xs text-[#cad5e8] leading-relaxed italic">
                    {activeDistrict.atmosphere}
                  </p>
                </div>
              )}

              {/* Landmarks */}
              {activeDistrict.landmarks && activeDistrict.landmarks.length > 0 && (
                <div className="space-y-1.5 bg-[#0a0c12] p-3 rounded-lg border border-[#24293a]">
                  <h4 className="text-[11px] font-heading font-bold text-[#f0cb78] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={12} className="text-[#c59b27]" />
                    Ключевые места ({activeDistrict.landmarks.length})
                  </h4>

                  <div className="space-y-1.5">
                    {activeDistrict.landmarks.map((lm, i) => {
                      const isExpanded = expandedLandmark === lm.name;
                      return (
                        <div
                          key={i}
                          onClick={() => setExpandedLandmark(isExpanded ? null : lm.name)}
                          className={`p-2 rounded-lg border transition-all cursor-pointer ${
                            isExpanded
                              ? 'bg-[#181c28] border-[#c59b27]'
                              : 'bg-[#10121a] border-[#222738] hover:border-[#524115]'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-semibold text-[#f0cb78]">
                            <span>{lm.name}</span>
                            <span className="text-[10px] text-[#959085]">
                              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-[#d4cebf] leading-relaxed">
                            {lm.desc}
                          </p>
                          {isExpanded && lm.details && (
                            <div className="mt-2 pt-1.5 border-t border-[#2e3447] text-[11px] text-[#a8d1b5] bg-[#0c1410] p-2 rounded border border-[#1b3a26]">
                              {lm.details}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Rumors */}
              {activeDistrict.rumorsAndDangers && activeDistrict.rumorsAndDangers.length > 0 && (
                <div className="bg-[#171115] p-3 rounded-lg border border-[#4a1c27] space-y-1">
                  <h4 className="text-[10px] font-heading font-bold text-[#f87171] uppercase tracking-wider flex items-center gap-1.5">
                    <Flame size={12} /> Слухи и зацепки
                  </h4>
                  <ul className="space-y-1 text-[11px] text-[#decacb]">
                    {activeDistrict.rumorsAndDangers.map((rumor, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#e64c65] font-bold">•</span>
                        <span>{rumor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: DISTRICTS LIST */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1">
          {districts.map((dist) => (
            <div
              key={dist.id}
              onClick={() => {
                setSelectedDistrictId(dist.id);
                setViewMode('map');
                const cfg = SPIRE_STRATA.find(s => s.id === dist.id);
                if (cfg) handleSelectStratum(cfg);
              }}
              className="p-4 rounded-xl bg-[#0d0f17] border border-[#262a3b] hover:border-[#c59b27] transition-all cursor-pointer space-y-2.5 group"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-heading font-semibold px-2 py-0.5 rounded bg-[#261f12] text-[#c59b27] border border-[#4a3b14]">
                  {dist.level}
                </span>
                <span className="text-xs text-[#878072] font-mono uppercase tracking-wider">
                  {dist.nameEn}
                </span>
              </div>

              <h3 className="text-lg font-heading font-bold text-[#e5b83b] group-hover:text-[#f0cb78] transition-colors">
                {dist.nameRu}
              </h3>

              <p className="text-xs text-[#bfb8ac] line-clamp-2 leading-relaxed">
                {dist.description}
              </p>

              <div className="flex items-center justify-between text-xs text-[#c59b27] pt-2 border-t border-[#1e2333]">
                <span>{dist.landmarks?.length || 0} локаций</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Показать на карте <ArrowRight size={13} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: ADD / EDIT CUSTOM PIN */}
      {editingPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/92 animate-in fade-in duration-150">
          <div className="bg-[#0e1017] border-2 border-[#c59b27] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-[#e0dacf]">
            <div className="flex items-center justify-between border-b border-[#2e3346] pb-3">
              <h3 className="font-heading font-bold text-lg text-[#f0cb78] flex items-center gap-2">
                <MapPin size={18} className="text-[#c59b27]" />
                Новая локация на карте Шпиля
              </h3>
              <button onClick={() => setEditingPin(null)} className="text-[#959085] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#959085] block mb-1 font-heading">Название места / объекта *</label>
                <input
                  type="text"
                  value={editingPin.name || ''}
                  onChange={(e) => setEditingPin({ ...editingPin, name: e.target.value })}
                  placeholder="Например: Тайное святилище Луны, Притон контрабандистов..."
                  className="w-full px-3.5 py-2 bg-[#08090d] border border-[#2e3346] focus:border-[#c59b27] rounded-xl text-sm text-[#f0ebe1] outline-none"
                />
              </div>

              <div>
                <label className="text-[#959085] block mb-1 font-heading">Короткий тултип (виден при наведении на пин) *</label>
                <textarea
                  value={editingPin.tooltip || ''}
                  onChange={(e) => setEditingPin({ ...editingPin, tooltip: e.target.value })}
                  placeholder="1-2 предложения с атмосферой и сутью локации..."
                  rows={2}
                  className="w-full px-3.5 py-2 bg-[#08090d] border border-[#2e3346] focus:border-[#c59b27] rounded-xl text-xs text-[#f0ebe1] outline-none"
                />
              </div>

              <div>
                <label className="text-[#959085] block mb-1 font-heading">Справочный материал и зацепки (открывается по клику)</label>
                <textarea
                  value={editingPin.referenceMaterial || ''}
                  onChange={(e) => setEditingPin({ ...editingPin, referenceMaterial: e.target.value })}
                  placeholder="Подробный лор, NPC, слухи, тайны, зацепки для ведущего..."
                  rows={5}
                  className="w-full px-3.5 py-2 bg-[#08090d] border border-[#2e3346] focus:border-[#c59b27] rounded-xl text-xs text-[#f0ebe1] outline-none font-serif leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#959085] block mb-1 font-heading">Привязка к району</label>
                  <select
                    value={editingPin.districtId || activeDistrict.id}
                    onChange={(e) => setEditingPin({ ...editingPin, districtId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#08090d] border border-[#2e3346] rounded-xl text-xs text-[#f0ebe1] outline-none"
                  >
                    {districts.map(d => (
                      <option key={d.id} value={d.id}>{d.nameRu}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[#959085] block mb-1 font-heading">Сфера влияния</label>
                  <select
                    value={editingPin.domain || 'Криминал'}
                    onChange={(e) => setEditingPin({ ...editingPin, domain: e.target.value })}
                    className="w-full px-3 py-2 bg-[#08090d] border border-[#2e3346] rounded-xl text-xs text-[#f0ebe1] outline-none"
                  >
                    {DOMAINS_LIST.map(dom => (
                      <option key={dom} value={dom}>{dom}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <span className="text-[#959085] font-heading">Цвет метки:</span>
                {(['gold', 'crimson', 'emerald', 'azure'] as const).map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setEditingPin({ ...editingPin, color })}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      editingPin.color === color ? 'scale-125 border-white ring-2 ring-[#c59b27]' : 'border-transparent opacity-70'
                    } ${
                      color === 'gold' ? 'bg-[#c59b27]' :
                      color === 'crimson' ? 'bg-[#96001c]' :
                      color === 'emerald' ? 'bg-[#0f766e]' : 'bg-[#1d4ed8]'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#2e3346]">
              {editingPin.id && pins.some(p => p.id === editingPin.id) ? (
                <button
                  type="button"
                  onClick={() => handleDeletePin(editingPin.id!)}
                  className="px-3 py-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900 border border-red-800 text-xs flex items-center gap-1.5"
                >
                  <Trash2 size={13} /> Удалить
                </button>
              ) : <div />}

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingPin(null)}
                  className="px-4 py-2 rounded-xl bg-[#141724] text-[#959085] hover:text-white text-xs font-heading"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSavePin}
                  disabled={!editingPin.name?.trim()}
                  className="px-5 py-2 rounded-xl bg-[#780016] hover:bg-[#96001c] disabled:opacity-40 text-[#f0cb78] hover:text-white border border-[#c59b27] text-xs font-heading font-bold transition-all shadow-md"
                >
                  Сохранить локацию
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW PIN REFERENCE MATERIAL */}
      {activeViewingPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/92 animate-in fade-in duration-150">
          <div className="bg-[#0c0e15] border-2 border-[#543f16] rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-4 text-[#e0dacf] relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveViewingPin(null)}
              className="absolute top-4 right-4 text-[#959085] hover:text-white p-1"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-heading font-bold bg-[#780016] text-[#f0cb78] border border-[#c59b27]">
                  {activeViewingPin.domain || 'Сфера Шпиля'}
                </span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-heading bg-[#171a26] text-[#9fcbf5] border border-[#2b3549]">
                  {districts.find(d => d.id === activeViewingPin.districtId)?.nameRu}
                </span>
              </div>

              <h2 className="text-2xl font-heading font-black text-[#f0cb78] pt-1">
                {activeViewingPin.name}
              </h2>
            </div>

            {/* Tooltip Quote */}
            {activeViewingPin.tooltip && (
              <div className="p-3.5 rounded-xl bg-[#151211] border-l-4 border-[#c59b27] border border-[#2b251d]">
                <p className="text-xs sm:text-sm text-[#e0dacf] font-serif italic leading-relaxed">
                  «{activeViewingPin.tooltip}»
                </p>
              </div>
            )}

            {/* Full Reference Material */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-heading font-bold text-[#c59b27] uppercase tracking-wider flex items-center gap-2">
                <BookOpen size={14} /> Справочные материалы и детали локации
              </h4>
              <div className="bg-[#08090e] p-4 rounded-xl border border-[#232738] text-sm text-[#ded7ca] leading-relaxed whitespace-pre-wrap font-serif">
                {activeViewingPin.referenceMaterial || 'Справочный материал для этой локации пока не заполнен. Вы можете добавить описание в режиме редактирования.'}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-between items-center pt-2.5 border-t border-[#232738]">
              <button
                onClick={() => {
                  setEditingPin(activeViewingPin);
                  setActiveViewingPin(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141724] hover:bg-[#780016] text-xs font-heading font-semibold text-[#f0cb78] hover:text-white border border-[#3e3422] transition-colors"
              >
                <Edit3 size={13} />
                <span>Редактировать справку</span>
              </button>

              <button
                onClick={() => setActiveViewingPin(null)}
                className="px-4 py-1.5 rounded-lg bg-[#181a24] text-[#959085] hover:text-white text-xs font-heading"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PIN MANAGER / EXPORT / IMPORT */}
      {showPinManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/92 animate-in fade-in duration-150">
          <div className="bg-[#0d0f17] border-2 border-[#3e3422] rounded-2xl max-w-xl w-full p-5 shadow-2xl space-y-3.5 text-[#e0dacf]">
            <div className="flex items-center justify-between border-b border-[#252a3b] pb-2.5">
              <h3 className="font-heading font-bold text-base text-[#f0cb78] flex items-center gap-2">
                <MapPin size={16} className="text-[#c59b27]" />
                Управление метками локаций ({pins.length})
              </h3>
              <button onClick={() => setShowPinManager(false)} className="text-[#959085] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {pins.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#807a6f]">
                  У вас пока нет созданных меток. Включите «Поставить метку» и кликните по карте!
                </div>
              ) : (
                pins.map(p => (
                  <div key={p.id} className="p-2.5 rounded-xl bg-[#080a10] border border-[#212638] flex items-center justify-between gap-3">
                    <div>
                      <span className="font-heading font-bold text-xs text-[#f0cb78] block">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-[#857e72]">
                        {districts.find(d => d.id === p.districtId)?.nameRu} • {p.domain}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingPin(p);
                          setShowPinManager(false);
                        }}
                        className="p-1.5 rounded-lg bg-[#141724] hover:bg-[#780016] text-[#c59b27] hover:text-white"
                        title="Редактировать"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeletePin(p.id)}
                        className="p-1.5 rounded-lg bg-[#141724] hover:bg-red-950 text-[#857e72] hover:text-red-400"
                        title="Удалить"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between items-center pt-2.5 border-t border-[#252a3b] text-xs">
              <div className="flex gap-2">
                <button
                  onClick={handleExportPins}
                  disabled={pins.length === 0}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#141724] hover:bg-[#202538] text-[#c59b27] disabled:opacity-40 border border-[#2b3042]"
                >
                  <Download size={13} /> Экспорт JSON
                </button>
                <button
                  onClick={() => setShowImportDialog(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#141724] hover:bg-[#202538] text-[#9fcbf5] border border-[#2b3042]"
                >
                  <Upload size={13} /> Импорт JSON
                </button>
              </div>

              <button
                onClick={() => setShowPinManager(false)}
                className="px-4 py-1.5 rounded-lg bg-[#780016] text-white font-heading font-bold"
              >
                Готово
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: IMPORT JSON */}
      {showImportDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/92 animate-in fade-in duration-150">
          <div className="bg-[#0e1017] border-2 border-[#c59b27] rounded-2xl max-w-md w-full p-5 space-y-3">
            <h4 className="font-heading font-bold text-sm text-[#f0cb78]">Вставьте JSON меток:</h4>
            <textarea
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="[ { id: ..., name: ... } ]"
              rows={6}
              className="w-full px-3 py-2 bg-[#06070a] border border-[#2e3346] rounded-xl text-xs text-[#f0ebe1] outline-none font-mono"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImportDialog(false)}
                className="px-3 py-1.5 rounded-lg bg-[#141724] text-xs text-[#8a8274]"
              >
                Отмена
              </button>
              <button
                onClick={handleImportPins}
                className="px-4 py-1.5 rounded-lg bg-[#780016] text-xs text-[#f0cb78] font-bold border border-[#c59b27]"
              >
                Импортировать
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
