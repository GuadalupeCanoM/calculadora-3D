
"use server";

import { analyzeGcode } from '@/ai/flows/gcode-analyzer';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { formSchema } from '@/lib/schema';

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

  // Server-side validation
  const validated = formSchema.safeParse(projectData);
  if (!validated.success) {
    console.error('Save Project Validation Error:', validated.error.flatten());
    return { error: 'Los datos del proyecto no son válidos. Revisa los campos marcados.' };
  }
  
  const { id: projectId, ...data } = validated.data;

  if (!data.jobName || !data.jobName.trim()) {
    return { error: 'El nombre del trabajo es obligatorio.' };
  }

  try {
    const dataToSave = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    const projectsCollection = collection(db, 'usuarios', uid, 'proyectos');

    if (projectId) {
      // Update existing project
      const projectRef = doc(projectsCollection, projectId);
      await setDoc(projectRef, dataToSave, { merge: true });
      const result = { success: true, id: projectId };
      // By forcing the result through JSON serialization and parsing,
      // we ensure it's a clean object that won't cause the client promise to hang.
      return JSON.parse(JSON.stringify(result));
    } else {
      // Create new project
      const newProjectData = { ...dataToSave, createdAt: serverTimestamp() };
      const newProjectRef = await addDoc(projectsCollection, newProjectData);
      const result = { success: true, id: newProjectRef.id };
      // By forcing the result through JSON serialization and parsing,
      // we ensure it's a clean object that won't cause the client promise to hang.
      return JSON.parse(JSON.stringify(result));
    }

  } catch (e) {
    console.error("Error saving project to Firestore: ", e);
    if (e instanceof Error) {
      if (e.message.toLowerCase().includes('maximum size')) {
        return { error: 'El proyecto es demasiado grande para guardar. Prueba con una imagen más pequeña.' };
      }
      return { error: `Error al guardar el proyecto: ${e.message}` };
    }
    return { error: 'Ocurrió un error desconocido al guardar el proyecto.' };
  }
}


export async function getProjects(uid: string) {
    if (!uid) return { error: 'Usuario no autenticado.' };

    try {
        const projectsRef = collection(db, 'usuarios', uid, 'proyectos');
        const querySnapshot = await getDocs(projectsRef);
        const projects = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

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
