'use client';

import React, { useState, useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';
import { Trash2, FolderUp, ImageIcon, Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import type { FormData } from '@/lib/schema';
import { useAuth } from '@/context/auth-context';
import { getProjects, deleteProject } from '@/app/actions';

interface SavedProject extends FormData {
  id: string;
}

interface SavedProjectsDialogProps {
  form: UseFormReturn<FormData>;
  children: React.ReactNode;
}

export function SavedProjectsDialog({ form, children }: SavedProjectsDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      if (isOpen && user) {
        setIsLoading(true);
        const result = await getProjects(user.uid);
        
        if (result.error) {
           toast({
             variant: "destructive",
             title: "Error al cargar",
             description: result.error,
           });
           setProjects([]);
        } else if (result.data) {
           const formattedProjects: SavedProject[] = result.data.map((p: any) => ({
             ...p, // p already contains id and other form data
           }));
           setProjects(formattedProjects);
        }
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [isOpen, user, toast]);

  const handleLoadProject = (project: SavedProject) => {
    form.reset(project);
    toast({
      title: 'Proyecto Cargado',
      description: `Se ha cargado el proyecto "${project.jobName}".`,
    });
    setIsOpen(false);
  };

  const handleDeleteProject = async (projectToDelete: SavedProject) => {
    if (!user) return;
    const result = await deleteProject(user.uid, projectToDelete.id);
    
    if (result.error) {
       toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: result.error,
      });
    } else {
      setProjects(projects.filter((p) => p.id !== projectToDelete.id));
      toast({
        title: 'Proyecto Eliminado',
        description: `El proyecto "${projectToDelete.jobName}" ha sido eliminado de la nube.`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Proyectos Guardados</DialogTitle>
          <DialogDescription>
            Selecciona un proyecto guardado en la nube para cargarlo en la calculadora.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72 w-full rounded-md border">
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : projects.length > 0 ? (
              <ul className="space-y-2">
                {projects.map((project) => (
                  <li key={project.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {project.projectImage ? (
                        <Image
                          src={project.projectImage}
                          alt={`Imagen de ${project.jobName}`}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-md object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-muted-foreground flex-shrink-0">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                      <span className="font-medium truncate">{project.jobName}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => handleLoadProject(project)} title="Cargar proyecto">
                        <FolderUp className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                          <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Eliminar proyecto">
                                  <Trash2 className="h-4 w-4" />
                              </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      Esta acción no se puede deshacer. Esto eliminará permanentemente el proyecto "{project.jobName}" de la nube.
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteProject(project)}>Eliminar</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-center text-muted-foreground py-10">No hay proyectos guardados en la nube.</p>
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
