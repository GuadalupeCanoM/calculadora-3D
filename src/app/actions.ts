
"use server";

import { analyzeGcode } from '@/ai/flows/gcode-analyzer';
import { db } from '@/lib/firebase';
import type { FormData } from '@/lib/schema';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, orderBy } from 'firebase/firestore';

async function blobToDataURI(blob: Blob): Promise<string> {
    const buffer = Buffer.from(await blob.arrayBuffer());
    return `data:${blob.type};base64,${buffer.toString('base64')}`;
}

export async function handleAnalyzeGcode(formData: FormData) {
  const file = formData.get('gcodeFile') as File | null;

  if (!file) {
    return { error: 'No file uploaded.' };
  }

  try {
    const gcodeDataUri = await blobToDataURI(file);
    const result = await analyzeGcode({
      filename: file.name,
      gcodeDataUri,
    });
    return { data: result };
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
        return { error: `Failed to analyze G-code file: ${e.message}` };
    }
    return { error: 'An unknown error occurred during G-code analysis.' };
  }
}

// Firestore Server Actions
export async function saveProject(uid: string, data: Omit<FormData, 'id'>) {
    if (!uid) {
        return { error: 'User is not authenticated.' };
    }

    try {
        const projectData = {
            ...data,
            uid,
            createdAt: new Date(),
        };

        const docRef = await addDoc(collection(db, "projects"), projectData);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("🔥 Error in saveProject:", error);
        if (error instanceof Error) {
            return { error: `Could not save project: ${error.message}` };
        }
        return { error: "An unknown error occurred while saving the project." };
    }
}

export async function getProjects(uid: string) {
    if (!uid) {
        return { error: 'User is not authenticated.' };
    }
    try {
        const q = query(collection(db, "projects"), where("uid", "==", uid), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const projects = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return { data: projects };
    } catch (error) {
        console.error("🔥 Error in getProjects:", error);
        if (error instanceof Error) {
            return { error: `Could not retrieve projects: ${error.message}` };
        }
        return { error: "An unknown error occurred while fetching projects." };
    }
}

export async function deleteProject(uid: string, projectId: string) {
    if (!uid) {
        return { error: 'User is not authenticated.' };
    }
    try {
        const projectRef = doc(db, 'projects', projectId);
        // Security is handled by Firestore rules, but an explicit check here is good practice.
        // const projectDoc = await getDoc(projectRef);
        // if (!projectDoc.exists() || projectDoc.data().uid !== uid) {
        //     return { error: 'Permission denied or project not found.' };
        // }
        await deleteDoc(projectRef);
        return { success: true };
    } catch (error) {
        console.error("🔥 Error in deleteProject:", error);
        if (error instanceof Error) {
            return { error: `Could not delete project: ${error.message}` };
        }
        return { error: "An unknown error occurred while deleting the project." };
    }
}
