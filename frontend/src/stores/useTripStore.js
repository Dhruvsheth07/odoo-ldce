import { create } from 'zustand';

const useTripStore = create((set) => ({
  trips: [],
  currentTrip: null,
  activeTab: 'overview',
  isLoading: false,

  setTrips: (trips) => set({ trips }),
  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setLoading: (loading) => set({ isLoading: loading }),

  updateTripInList: (updatedTrip) => set((state) => ({
    trips: state.trips.map(t => t.id === updatedTrip.id ? updatedTrip : t),
    currentTrip: state.currentTrip?.id === updatedTrip.id ? updatedTrip : state.currentTrip,
  })),

  removeTripFromList: (tripId) => set((state) => ({
    trips: state.trips.filter(t => t.id !== tripId),
    currentTrip: state.currentTrip?.id === tripId ? null : state.currentTrip,
  })),
}));

export default useTripStore;
