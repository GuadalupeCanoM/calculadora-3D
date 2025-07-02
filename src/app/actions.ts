"use server";

import { analyzeGcode } from '@/ai/flows/gcode-analyzer';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';

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
    const cleanedJobName = projectData.jobName.trim();
    // Use cleaned jobName as the document ID for easy updates (upsert)
    const projectRef = doc(db, 'usuarios', uid, 'proyectos', cleanedJobName);

    await setDoc(projectRef, {
      ...projectData,
      jobName: cleanedJobName, // Ensure the saved name is also trimmed
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
        // The orderBy clause would require a custom index in Firestore.
        // To avoid this manual step for the user, we fetch all documents
        // and sort them on the server before sending them to the client.
        const querySnapshot = await getDocs(projectsRef);
        const projects = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Sort projects by 'updatedAt' in descending order.
        // The `toDate()` method converts a Firestore Timestamp to a JS Date.
        // We provide a fallback for documents that might not have the field yet.
        projects.sort((a: any, b: any) => {
            const timeA = a.updatedAt?.toDate?.() || new Date(0);
            const timeB = b.updatedAt?.toDate?.() || new Date(0);
            return timeB.getTime() - timeA.getTime();
        });

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
