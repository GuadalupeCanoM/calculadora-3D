
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
  console.log("✔️ Entrando en saveProject en el servidor...");
  if (!uid) {
    console.error("❌ Error: Usuario no autenticado en saveProject.");
    return { error: 'Usuario no autenticado.' };
  }

  const validated = formSchema.safeParse(projectData);
  if (!validated.success) {
    console.error('❌ Error de validación en saveProject:', validated.error.flatten());
    return { error: 'Los datos del proyecto no son válidos. Revisa los campos marcados.' };
  }
  
  const { id: projectId, ...data } = validated.data;

  // Clean the data object to remove any 'undefined' values before saving to Firestore.
  // Firestore cannot store 'undefined' and will throw an error.
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );

  try {
    const dataToSave = {
      ...cleanData,
      updatedAt: serverTimestamp(),
    };

    console.log("💾 Datos a guardar en Firestore:", dataToSave);
    const projectsCollection = collection(db, 'usuarios', uid, 'proyectos');

    if (projectId) {
      console.log(`🔄 Actualizando proyecto con ID: ${projectId}`);
      const projectRef = doc(projectsCollection, projectId);
      await setDoc(projectRef, dataToSave, { merge: true });
      console.log("✅ Proyecto actualizado con éxito.");
      return { success: true, id: projectId };
    } else {
      console.log("✨ Creando nuevo proyecto...");
      const newProjectData = { ...dataToSave, createdAt: serverTimestamp() };
      const newProjectRef = await addDoc(projectsCollection, newProjectData);
      console.log(`✅ Nuevo proyecto creado con ID: ${newProjectRef.id}`);
      return { success: true, id: newProjectRef.id };
    }

  } catch (e) {
    console.error("🔥 Error en saveProject al interactuar con Firestore:", e);
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
        
        const projects = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Ensure timestamps are converted to a serializable format (ISO string)
                createdAt: data.createdAt?.toDate?.().toISOString() || null,
                updatedAt: data.updatedAt?.toDate?.().toISOString() || null,
            };
        });

        // Sort by updatedAt descending to show the most recent projects first
        projects.sort((a, b) => {
            const timeA = a.updatedAt || '';
            const timeB = b.updatedAt || '';
            return timeB.localeCompare(timeA);
        });

        return { data: JSON.parse(JSON.stringify(projects)) };
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
