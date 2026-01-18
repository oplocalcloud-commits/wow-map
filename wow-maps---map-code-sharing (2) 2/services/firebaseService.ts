
import { GoogleGenAI } from "@google/genai";
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { Category, MapEntry } from '../types';

/**
 * FIREBASE CONFIGURATION
 */
const firebaseConfig = {
  apiKey: "AIzaSyBhdOrBgBEPIoBofhgUuvmTNidmLgQc7eA",
  authDomain: "wow-map-b3588.firebaseapp.com",
  projectId: "wow-map-b3588",
  storageBucket: "wow-map-b3588.firebasestorage.app",
  messagingSenderId: "386018138588",
  appId: "1:386018138588:web:3bc5653ff4f5c7731e5719",
  measurementId: "G-0Z8G10MKJ8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// --- CATEGORY CRUD ---

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const addCategory = async (data: Omit<Category, 'id'>) => {
  return await addDoc(collection(db, "categories"), data);
};

export const updateCategory = async (id: string, data: Partial<Category>) => {
  try {
    const docRef = doc(db, "categories", id);
    const { id: _, ...updateData } = data as any;
    return await updateDoc(docRef, updateData);
  } catch (error) {
    console.error("Firebase updateCategory error:", error);
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  return await deleteDoc(doc(db, "categories", id));
};

// --- MAP CRUD ---

export const fetchAllMaps = async (): Promise<MapEntry[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "maps"));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MapEntry[];
  } catch (error) {
    console.error("Error fetching all maps:", error);
    return [];
  }
};

export const fetchMapsByCategory = async (catId: string): Promise<MapEntry[]> => {
  try {
    const q = query(collection(db, "maps"), where("categoryId", "==", catId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MapEntry[];
  } catch (error) {
    console.error("Error fetching maps by category:", error);
    return [];
  }
};

export const addMap = async (data: Omit<MapEntry, 'id'>) => {
  return await addDoc(collection(db, "maps"), data);
};

export const updateMap = async (id: string, data: Partial<MapEntry>) => {
  try {
    const docRef = doc(db, "maps", id);
    const { id: _, ...updateData } = data as any;
    return await updateDoc(docRef, updateData);
  } catch (error) {
    console.error("Firebase updateMap error:", error);
    throw error;
  }
};

export const deleteMap = async (id: string) => {
  return await deleteDoc(doc(db, "maps", id));
};

// --- GEN AI INTEL ---

export const generateMapIntel = async (mapTitle: string, currentDescription: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a high-tech tactical briefing for a gaming map titled "${mapTitle}". 
      Initial context: ${currentDescription}. 
      Style: Professional military intel, futuristic, concise. 
      Limit to 60 words.`,
      config: {
        systemInstruction: "You are a tactical military AI embedded in the WOW MAPS network. Your goal is to convert simple map descriptions into immersive tactical intelligence briefings for professional gamers.",
      },
    });
    return response.text || currentDescription;
  } catch (error) {
    console.error("Gemini AI Briefing Failed:", error);
    return currentDescription;
  }
};
