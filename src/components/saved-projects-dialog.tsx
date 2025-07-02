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
import { Trash2, FolderUp, ImageIcon } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import type { FormData } from './calculator-form';

const STORAGE_PREFIX = 'luprintech-calc-project:';

interface SavedProject {
  key: string;
  name: string;
  data: FormData;
}

interface SavedProjectsDialogProps {
  form: UseFormReturn<FormData>;
  children: React.ReactNode;
}

export function SavedProjectsDialog({ form, children }: SavedProjectsDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    if (isOpen) {
      const savedProjects: SavedProject[] = [];
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(STORAGE_PREFIX)) {
                const item = localStorage.getItem(key);
                if (item) {
                  const data = JSON.parse(item);
                  savedProjects.push({
                    key,
                    name: data.jobName || 'Proyecto sin nombre',
                    data,
                  });
                }
            }
          }
          setProjects(savedProjects.sort((a, b) => a.name.localeCompare(b.name)));
        }
      } catch (error) {
        console.error("Error al cargar proyectos guardados:", error);
        toast({
          variant: "destructive",
          title: "Error al cargar",
          description: "No se pudieron cargar los proyectos guardados.",
        });
      }
    }
  }, [isOpen, toast]);

  const handleLoadProject = (project: SavedProject) => {
    form.reset(project.data);
    toast({
      title: 'Proyecto Cargado',
      description: `Se ha cargado el proyecto "${project.name}".`,
    });
    setIsOpen(false);
  };

  const handleDeleteProject = (project: SavedProject) => {
    try {
      localStorage.removeItem(project.key);
      setProjects(projects.filter((p) => p.key !== project.key));
      toast({
        title: 'Proyecto Eliminado',
        description: `El proyecto "${project.name}" ha sido eliminado.`,
      });
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: "No se pudo eliminar el proyecto.",
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
            Selecciona un proyecto guardado para cargarlo en la calculadora.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72 w-full rounded-md border">
          <div className="p-4">
            {projects.length > 0 ? (
              <ul className="space-y-2">
                {projects.map((project) => (
                  <li key={project.key} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {project.data.projectImage ? (
                        <Image
                          src={project.data.projectImage}
                          alt={`Imagen de ${project.name}`}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-md object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-muted-foreground flex-shrink-0">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                      <span className="font-medium truncate">{project.name}</span>
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
                                      Esta acción no se puede deshacer. Esto eliminará permanentemente el proyecto "{project.name}".
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
                <p className="text-center text-muted-foreground py-10">No hay proyectos guardados.</p>
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
