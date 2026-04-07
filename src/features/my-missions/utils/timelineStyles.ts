export function getTaskClasses(status: string) {
  switch (status) {
    case 'in-progress':
      return 'bg-gradient-progress-bg shadow-col-progress border-kanban-progress';
    case 'in-qa':
      return 'bg-gradient-qa-bg shadow-col-qa border-kanban-qa';
    case 'done':
      return 'bg-gradient-done-bg shadow-col-done border-kanban-done';
    case 'todo':
    default:
      return 'bg-gradient-todo-bg shadow-col-todo border-kanban-todo';
  }
}

export function getTaskColorClass(status: string) {
  switch (status) {
    case 'in-progress':
      return 'bg-blue text-white';
    case 'in-qa':
      return 'bg-kanban-qa text-white';
    case 'done':
      return 'bg-green text-white';
    case 'todo':
    default:
      return 'bg-purple text-white';
  }
}

export function getTaskDotClass(status: string) {
  switch (status) {
    case 'in-progress':
      return 'bg-blue';
    case 'in-qa':
      return 'bg-kanban-qa';
    case 'done':
      return 'bg-green';
    case 'todo':
    default:
      return 'bg-purple';
  }
}
