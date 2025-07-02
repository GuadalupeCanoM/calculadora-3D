"use server";

import { analyzeGcode } from '@/ai/flows/gcode-analyzer';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc, setDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

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

export async function saveProject(uid: string, projectData: any) {
  if (!uid) return { error: 'Usuario no autenticado.' };
  if (!projectData.jobName || !projectData.jobName.trim()) {
    return { error: 'El nombre del trabajo es obligatorio.' };
  }

  try {
    // Use jobName as the document ID for easy updates (upsert)
    const projectRef = doc(db, 'usuarios', uid, 'proyectos', projectData.jobName.trim());
    await setDoc(projectRef, {
      ...projectData,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return { success: true, id: projectRef.id };
  } catch (e) {
    console.error("Error saving project: ", e);
    if (e instanceof Error) {
        return { error: `Error al guardar el proyecto: ${e.message}` };
    }
    return { error: 'Ocurrió un error desconocido al guardar el proyecto.' };
  }
}

export async function getProjects(uid: string) {
    if (!uid) return { error: 'Usuario no autenticado.' };

    try {
        const projectsRef = collection(db, 'usuarios', uid, 'proyectos');
        const q = query(projectsRef, orderBy('updatedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const projects = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return { data: projects };
    } catch (e) {
        console.error("Error fetching projects: ", e);
        if (e instanceof Error) {
            return { error: `Error al obtener los proyectos: ${e.message}` };
        }
        return { error: 'Ocurrió un error desconocido al obtener los proyectos.' };
    }
}


export async function deleteProject(uid: string, projectId: string) {
    if (!uid) return { error: 'Usuario no autenticado.' };
    if (!projectId) return { error: 'ID del proyecto no válido.' };

    try {
        await deleteDoc(doc(db, 'usuarios', uid, 'proyectos', projectId));
        return { success: true };
    } catch (e) {
        console.error("Error deleting project: ", e);
        if (e instanceof Error) {
            return { error: `Error al eliminar el proyecto: ${e.message}` };
        }
        return { error: 'Ocurrió un error desconocido al eliminar el proyecto.' };
    }
}
