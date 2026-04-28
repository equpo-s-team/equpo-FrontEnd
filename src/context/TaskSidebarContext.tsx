import React, { createContext, useContext, useState } from 'react';

interface TaskSidebarContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const TaskSidebarContext = createContext<TaskSidebarContextType | undefined>(undefined);

export const TaskSidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TaskSidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </TaskSidebarContext.Provider>
  );
};

export const useTaskSidebar = (): TaskSidebarContextType => {
  const context = useContext(TaskSidebarContext);
  if (!context) {
    throw new Error('useTaskSidebar debe usarse dentro de TaskSidebarProvider');
  }
  return context;
};
