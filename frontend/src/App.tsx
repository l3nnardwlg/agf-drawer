import React, { useState, useEffect } from 'react';
import { AppRoute, ActiveView, CableItem, CableUnit, StorageLocation, MovementItem, UserSession } from './types';
import { initialCables, initialStorageLocations, initialMovements } from './data/mockData';

// Public SaaS Views
import { LandingPageView } from './views/LandingPageView';
import { FeaturesPageView } from './views/FeaturesPageView';
import { PricingPageView } from './views/PricingPageView';
import { AuthPageView } from './views/AuthPageView';

// Dashboard Components
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { MobileNavbar } from './components/MobileNavbar';
import { CommandPalette } from './components/CommandPalette';
import { AddCableModal } from './components/AddCableModal';
import { ReturnCableModal } from './components/ReturnCableModal';
import { ConnectorCatalogModal } from './components/ConnectorCatalogModal';

// Dashboard Views
import { OverviewView } from './views/OverviewView';
import { CableFinderView } from './views/CableFinderView';
import { CableDetailView } from './views/CableDetailView';
import { StorageView } from './views/StorageView';
import { InUseView } from './views/InUseView';
import { InventoryView } from './views/InventoryView';
import { MovementsView } from './views/MovementsView';
import { SettingsView } from './views/SettingsView';
import { DesignSystemView } from './views/DesignSystemView';

export const App: React.FC = () => {
  // SaaS URL Route State
  const parseCurrentRoute = (): AppRoute => {
    const path = window.location.pathname;
    if (path.startsWith('/dashboard')) return 'dashboard';
    if (path === '/login') return 'login';
    if (path === '/register') return 'register';
    if (path === '/features') return 'features';
    if (path === '/pricing') return 'pricing';
    return 'landing';
  };

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(parseCurrentRoute);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  // Dashboard Sub-View State
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [selectedCable, setSelectedCable] = useState<CableItem | null>(null);
  const [isLightMode, setIsLightMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data states
  const [cables, setCables] = useState<CableItem[]>(initialCables);
  const [storageLocations, setStorageLocations] = useState<StorageLocation[]>(initialStorageLocations);
  const [movements, setMovements] = useState<MovementItem[]>(initialMovements);

  // Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAddCableModalOpen, setIsAddCableModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnUnit, setReturnUnit] = useState<CableUnit | null>(null);
  const [returnCableName, setReturnCableName] = useState<string>('');
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [catalogSide, setCatalogSide] = useState<'A' | 'B'>('A');

  // Handle Route Navigation with Browser History
  const navigateRoute = (route: AppRoute) => {
    setCurrentRoute(route);
    let path = '/';
    if (route === 'dashboard') path = '/dashboard';
    else if (route === 'login') path = '/login';
    else if (route === 'register') path = '/register';
    else if (route === 'features') path = '/features';
    else if (route === 'pricing') path = '/pricing';

    window.history.pushState({ route }, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(parseCurrentRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Try fetching from backend API if available
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const meRes = await fetch('/api/v1/me');
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.user) {
            setCurrentUser({
              id: meData.user.id,
              email: meData.user.email,
              username: meData.user.username,
              displayName: meData.user.displayName,
            });
          }
        }

        const res = await fetch('/api/v1/workspaces');
        if (res.ok) {
          const wsData = await res.json();
          if (wsData.workspaces && wsData.workspaces.length > 0) {
            const wsId = wsData.workspaces[0].id;
            const itemsRes = await fetch(`/api/v1/workspaces/${wsId}/inventory`);
            if (itemsRes.ok) {
              const invData = await itemsRes.json();
              if (invData.items && invData.items.length > 0) {
                const mapped: CableItem[] = invData.items.map((item: any) => ({
                  id: item.id,
                  name: item.name,
                  category: item.category || 'Kabel',
                  connector_a: item.connector_a || item.connectorA || 'USB-C',
                  connector_b: item.connector_b || item.connectorB || 'USB-A',
                  color: item.color || 'Schwarz',
                  length_cm: item.length_cm || item.lengthCm || 100,
                  total: item.total || item.total_units || 1,
                  stored: item.stored || item.available_units || 1,
                  inUse: item.in_use || item.in_use_units || 0,
                  loaned: item.loaned || 0,
                  missing: item.missing || 0,
                  storageLocationName: item.storageLocationName || 'Lager',
                  units: item.units || [],
                }));
                setCables(mapped);
              }
            }
          }
        }
      } catch (e) {
        // Fallback to rich mock data
      }
    };
    fetchBackendData();
  }, []);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleSelectCable = (cable: CableItem) => {
    setSelectedCable(cable);
    setActiveView('cable-detail');
  };

  const handleOpenReturnModal = (unit: CableUnit, cableTitle?: string) => {
    setReturnUnit(unit);
    setReturnCableName(cableTitle || selectedCable?.name || 'Kabel');
    setIsReturnModalOpen(true);
  };

  const handleConfirmReturn = (unitId: string, targetLocationId: string, returnNotes?: string) => {
    const targetLoc = storageLocations.find((l) => l.id === targetLocationId);
    const locName = targetLoc ? targetLoc.name : 'Lager';

    setCables((prev) =>
      prev.map((c) => {
        const hasUnit = c.units?.some((u) => u.id === unitId);
        if (!hasUnit) return c;

        const updatedUnits = (c.units || []).map((u) =>
          u.id === unitId
            ? {
                ...u,
                status: 'stored' as const,
                storageLocationId: targetLocationId,
                location_name: locName,
                usageLocation: null,
                notes: returnNotes || u.notes,
              }
            : u
        );

        return {
          ...c,
          stored: c.stored + 1,
          inUse: Math.max(0, c.inUse - 1),
          units: updatedUnits,
        };
      })
    );

    if (selectedCable) {
      setSelectedCable((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          stored: prev.stored + 1,
          inUse: Math.max(0, prev.inUse - 1),
          units: (prev.units || []).map((u) =>
            u.id === unitId
              ? {
                  ...u,
                  status: 'stored' as const,
                  storageLocationId: targetLocationId,
                  location_name: locName,
                  usageLocation: null,
                }
              : u
          ),
        };
      });
    }

    const newMovement: MovementItem = {
      id: 'mov-' + Date.now(),
      action: 'return',
      title: `${returnCableName || 'Kabel'} ins Lager zurückgebucht`,
      item_name: returnCableName,
      to: locName,
      user_initials: currentUser?.displayName ? currentUser.displayName.slice(0, 2).toUpperCase() : 'LW',
      timestamp: 'gerade eben',
      date_group: 'Heute, 17. Oktober 2026',
    };
    setMovements((prev) => [newMovement, ...prev]);
  };

  const handleUpdateUnitStatus = (unitId: string, newStatus: CableUnit['status'], usageLocation?: string) => {
    setCables((prev) =>
      prev.map((c) => {
        const hasUnit = c.units?.some((u) => u.id === unitId);
        if (!hasUnit) return c;

        const oldUnit = c.units?.find((u) => u.id === unitId);
        const oldStatus = oldUnit?.status || 'stored';

        const updatedUnits = (c.units || []).map((u) =>
          u.id === unitId
            ? {
                ...u,
                status: newStatus,
                usageLocation: newStatus === 'in_use' ? usageLocation || 'Arbeitsplatz' : null,
              }
            : u
        );

        let storedDiff = 0;
        let inUseDiff = 0;
        let missingDiff = 0;

        if (oldStatus === 'stored') storedDiff--;
        if (oldStatus === 'in_use') inUseDiff--;
        if (oldStatus === 'missing') missingDiff--;

        if (newStatus === 'stored') storedDiff++;
        if (newStatus === 'in_use') inUseDiff++;
        if (newStatus === 'missing') missingDiff++;

        return {
          ...c,
          stored: Math.max(0, c.stored + storedDiff),
          inUse: Math.max(0, c.inUse + inUseDiff),
          missing: Math.max(0, c.missing + missingDiff),
          units: updatedUnits,
        };
      })
    );

    if (selectedCable) {
      setSelectedCable((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          units: (prev.units || []).map((u) =>
            u.id === unitId
              ? {
                  ...u,
                  status: newStatus,
                  usageLocation: newStatus === 'in_use' ? usageLocation || 'Arbeitsplatz' : null,
                }
              : u
          ),
        };
      });
    }
  };

  const handleAddCable = (newCableData: Partial<CableItem>, initialCount: number, locationId?: string) => {
    const loc = storageLocations.find((l) => l.id === locationId);
    const locName = loc ? loc.name : 'Hauptlager Schrank A';

    const newUnits: CableUnit[] = Array.from({ length: initialCount }).map((_, i) => ({
      id: 'unit-' + Date.now() + '-' + i,
      itemId: 'cable-' + Date.now(),
      unitIdentifier: `UNIT-${i + 1}`,
      status: 'stored' as const,
      storageLocationId: locationId,
      location_name: locName,
      updatedAt: new Date().toISOString(),
    }));

    const newCable: CableItem = {
      id: 'cable-' + Date.now(),
      name: newCableData.name || `${newCableData.connector_a} auf ${newCableData.connector_b}`,
      connector_a: newCableData.connector_a || 'USB-C',
      connector_b: newCableData.connector_b || 'USB-A',
      color: newCableData.color || 'Schwarz',
      length_cm: newCableData.length_cm || 100,
      manufacturer: newCableData.manufacturer,
      cable_standard: newCableData.cable_standard,
      notes: newCableData.notes,
      total: initialCount,
      stored: initialCount,
      inUse: 0,
      loaned: 0,
      missing: 0,
      storageLocationName: locName,
      units: newUnits,
      createdAt: new Date().toISOString(),
    };

    setCables((prev) => [newCable, ...prev]);

    const newMovement: MovementItem = {
      id: 'mov-' + Date.now(),
      action: 'create',
      title: `${newCable.name} (${initialCount}x) neu erfasst`,
      item_name: newCable.name,
      to: locName,
      user_initials: currentUser?.displayName ? currentUser.displayName.slice(0, 2).toUpperCase() : 'LW',
      timestamp: 'gerade eben',
      date_group: 'Heute, 17. Oktober 2026',
    };
    setMovements((prev) => [newMovement, ...prev]);
  };

  const handleAddUnitToCable = (cableId: string) => {
    setCables((prev) =>
      prev.map((c) => {
        if (c.id !== cableId) return c;
        const count = (c.units || []).length + 1;
        const newUnit: CableUnit = {
          id: 'unit-' + Date.now(),
          itemId: c.id,
          unitIdentifier: `UNIT-${count}`,
          status: 'stored',
          location_name: c.storageLocationName || 'Lager',
          updatedAt: new Date().toISOString(),
        };
        const updatedUnits = [...(c.units || []), newUnit];
        return {
          ...c,
          total: c.total + 1,
          stored: c.stored + 1,
          units: updatedUnits,
        };
      })
    );

    if (selectedCable && selectedCable.id === cableId) {
      setSelectedCable((prev) => {
        if (!prev) return null;
        const count = (prev.units || []).length + 1;
        const newUnit: CableUnit = {
          id: 'unit-' + Date.now(),
          itemId: prev.id,
          unitIdentifier: `UNIT-${count}`,
          status: 'stored',
          location_name: prev.storageLocationName || 'Lager',
        };
        return {
          ...prev,
          total: prev.total + 1,
          stored: prev.stored + 1,
          units: [...(prev.units || []), newUnit],
        };
      });
    }
  };

  // Compute breadcrumbs
  const getBreadcrumbs = () => {
    switch (activeView) {
      case 'overview':
        return ['Übersicht'];
      case 'cable-finder':
        return ['Kabel-Finder', 'Katalog'];
      case 'cable-detail':
        return ['Kabel-Finder', selectedCable?.name || 'Detail'];
      case 'storage':
        return ['Lagerorte', 'Schrankverwaltung'];
      case 'in-use':
        return ['In Verwendung', 'Aktive Kabel'];
      case 'inventory':
        return ['Inventar', 'Gesamtbestand'];
      case 'movements':
        return ['Bewegungsverlauf', 'Audit-Log'];
      case 'settings':
        return ['Einstellungen'];
      case 'design-system':
        return ['UI-Bibliothek', 'Design System 002'];
      default:
        return ['Kabel-Finder'];
    }
  };

  // 1. Public Landing Page
  if (currentRoute === 'landing') {
    return (
      <LandingPageView
        onNavigateRoute={navigateRoute}
        onOpenDashboard={() => navigateRoute('dashboard')}
      />
    );
  }

  // 2. Public Features Deep-Dive
  if (currentRoute === 'features') {
    return (
      <FeaturesPageView
        onNavigateRoute={navigateRoute}
        onOpenDashboard={() => navigateRoute('dashboard')}
      />
    );
  }

  // 3. Public Pricing Page
  if (currentRoute === 'pricing') {
    return (
      <PricingPageView
        onNavigateRoute={navigateRoute}
        onOpenDashboard={() => navigateRoute('dashboard')}
      />
    );
  }

  // 4. Auth Pages (Login / Register)
  if (currentRoute === 'login' || currentRoute === 'register') {
    return (
      <AuthPageView
        initialMode={currentRoute === 'register' ? 'register' : 'login'}
        onNavigateRoute={navigateRoute}
        onAuthSuccess={(session) => {
          setCurrentUser(session);
          navigateRoute('dashboard');
        }}
      />
    );
  }

  // 5. SaaS Production Dashboard (/dashboard)
  return (
    <div className={`min-h-screen flex ${isLightMode ? 'bg-[#F9F9FB] text-neutral-900' : 'bg-black text-white'}`}>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          activeView={activeView}
          onNavigate={(view) => {
            setActiveView(view);
            if (view !== 'cable-detail') setSelectedCable(null);
          }}
          stats={{
            cablesCount: cables.reduce((acc, c) => acc + c.total, 0),
            inUseCount: cables.reduce((acc, c) => acc + c.inUse, 0),
            storageCount: storageLocations.length,
          }}
          currentWorkspace={currentUser?.workspaceName || 'AGF Studios'}
        />
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <TopHeader
          activeView={activeView}
          breadcrumbs={getBreadcrumbs()}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenAddModal={() => setIsAddCableModalOpen(true)}
          isLightMode={isLightMode}
          onToggleLightMode={() => setIsLightMode(!isLightMode)}
          onOpenCatalogModal={() => {
            setCatalogSide('A');
            setIsCatalogOpen(true);
          }}
          onNavigateLanding={() => navigateRoute('landing')}
        />

        {/* View Viewport */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-6">
          {activeView === 'overview' && (
            <OverviewView
              cables={cables}
              storageLocations={storageLocations}
              movements={movements}
              onSelectCable={handleSelectCable}
              onNavigate={(view) => setActiveView(view)}
              onOpenAddModal={() => setIsAddCableModalOpen(true)}
              onSearchSubmit={(q) => {
                setSearchQuery(q);
                setActiveView('cable-finder');
              }}
            />
          )}

          {activeView === 'cable-finder' && (
            <CableFinderView
              cables={cables}
              onSelectCable={handleSelectCable}
              onOpenAddModal={() => setIsAddCableModalOpen(true)}
              initialSearchQuery={searchQuery}
              isLightMode={isLightMode}
            />
          )}

          {activeView === 'cable-detail' && selectedCable && (
            <CableDetailView
              cable={selectedCable}
              storageLocations={storageLocations}
              movements={movements}
              onBack={() => setActiveView('cable-finder')}
              onOpenReturnModal={(unit) => handleOpenReturnModal(unit, selectedCable.name)}
              onUpdateUnitStatus={handleUpdateUnitStatus}
              onAddUnit={handleAddUnitToCable}
            />
          )}

          {activeView === 'storage' && (
            <StorageView
              storageLocations={storageLocations}
              cables={cables}
              onSelectCable={handleSelectCable}
            />
          )}

          {activeView === 'in-use' && (
            <InUseView
              cables={cables}
              onOpenReturnModal={handleOpenReturnModal}
              onSelectCable={handleSelectCable}
            />
          )}

          {activeView === 'inventory' && (
            <InventoryView
              cables={cables}
              onSelectCable={handleSelectCable}
              onOpenAddModal={() => setIsAddCableModalOpen(true)}
            />
          )}

          {activeView === 'movements' && <MovementsView movements={movements} />}

          {activeView === 'settings' && <SettingsView />}

          {activeView === 'design-system' && <DesignSystemView />}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNavbar
          activeView={activeView}
          onNavigate={(view) => {
            setActiveView(view);
            if (view !== 'cable-detail') setSelectedCable(null);
          }}
          onOpenAddModal={() => setIsAddCableModalOpen(true)}
        />
      </div>

      {/* Global Command Palette Modal (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        cables={cables}
        storageLocations={storageLocations}
        onSelectCable={handleSelectCable}
        onSelectStorage={(loc) => {
          setActiveView('storage');
        }}
        onNavigate={(view) => setActiveView(view)}
        onOpenAddModal={() => setIsAddCableModalOpen(true)}
      />

      {/* Add Cable Modal */}
      <AddCableModal
        isOpen={isAddCableModalOpen}
        onClose={() => setIsAddCableModalOpen(false)}
        onAddCable={handleAddCable}
        storageLocations={storageLocations}
        onOpenConnectorCatalog={(side) => {
          setCatalogSide(side);
          setIsCatalogOpen(true);
        }}
      />

      {/* Return Cable / Einlagern Modal */}
      <ReturnCableModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        unit={returnUnit}
        cableName={returnCableName}
        storageLocations={storageLocations}
        onConfirmReturn={handleConfirmReturn}
      />

      {/* Connector Catalog 51-type modal */}
      <ConnectorCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSelectConnector={(conn) => {
          // Can be used to inject into Add modal or search
        }}
      />
    </div>
  );
};
export default App;
